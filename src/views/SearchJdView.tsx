import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobDescription } from '../types';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Printer, 
  Eye, 
  UserCheck, 
  CheckSquare, 
  Square, 
  Archive, 
  Lock, 
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { JdDetailModal } from '../components/JdDetailModal';
import { generateJdDocumentHtml, printDocument, downloadJdsAsZip } from '../utils/exportUtils';

export const SearchJdView: React.FC = () => {
  const { 
    currentUser, 
    jdList, 
    filterAllowedSupervisoryJds, 
    canAccessSupervisoryJdSearch, 
  } = useAuth();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeputy, setSelectedDeputy] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Selection for batch actions
  // Selection for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalJd, setModalJd] = useState<JobDescription | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Get allowed JDs for current user's role
  const allowedJds = useMemo(() => {
    return filterAllowedSupervisoryJds(jdList);
  }, [jdList, filterAllowedSupervisoryJds]);

  // Extract filter options from allowed list
  const deputyOptions = useMemo(() => {
    return Array.from(new Set(allowedJds.map(j => {
      const parts = j.orgPath.split(' > ');
      return parts[0] || '';
    }).filter(Boolean)));
  }, [allowedJds]);

  const assistantOptions = useMemo(() => {
    return Array.from(new Set(allowedJds.map(j => {
      const parts = j.orgPath.split(' > ');
      return parts[1] || '';
    }).filter(Boolean)));
  }, [allowedJds]);

  const departmentOptions = useMemo(() => {
    return Array.from(new Set(allowedJds.map(j => {
      const parts = j.orgPath.split(' > ');
      return parts[2] || '';
    }).filter(Boolean)));
  }, [allowedJds]);

  const divisionOptions = useMemo(() => {
    return Array.from(new Set(allowedJds.map(j => {
      const parts = j.orgPath.split(' > ');
      return parts[3] || '';
    }).filter(Boolean)));
  }, [allowedJds]);

  const sectionOptions = useMemo(() => {
    return Array.from(new Set(allowedJds.map(j => {
      const parts = j.orgPath.split(' > ');
      return parts[4] || '';
    }).filter(Boolean)));
  }, [allowedJds]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDeputy('');
    setSelectedAssistant('');
    setSelectedDepartment('');
    setSelectedDivision('');
    setSelectedSection('');
  };

  // Filtered List
  const filteredJds = useMemo(() => {
    return allowedJds.filter(jd => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        jd.positionTitle.toLowerCase().includes(query) ||
        jd.shortCode.toLowerCase().includes(query) ||
        jd.unitName.toLowerCase().includes(query) ||
        jd.unitCode.toLowerCase().includes(query) ||
        jd.positionCode.toLowerCase().includes(query) ||
        jd.orgPath.toLowerCase().includes(query);

      const matchesDeputy = !selectedDeputy || jd.orgPath.includes(selectedDeputy);
      const matchesAssistant = !selectedAssistant || jd.orgPath.includes(selectedAssistant);
      const matchesDepartment = !selectedDepartment || jd.orgPath.includes(selectedDepartment);
      const matchesDivision = !selectedDivision || jd.orgPath.includes(selectedDivision);
      const matchesSection = !selectedSection || jd.orgPath.includes(selectedSection);

      return matchesSearch && matchesDeputy && matchesAssistant && matchesDepartment && matchesDivision && matchesSection;
    });
  }, [allowedJds, searchTerm, selectedDeputy, selectedAssistant, selectedDepartment, selectedDivision, selectedSection]);

  // If user cannot access this view at all (e.g. general_employee)
  if (!canAccessSupervisoryJdSearch) {
    return (
      <div className="max-w-3xl mx-auto my-12 bg-white p-8 rounded-xl border border-red-200 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          ไม่มีสิทธิ์เข้าถึงหน้านี้
        </h2>
        <p className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
          ตามระเบียบการรักษาความปลอดภัยของระบบ SMART Description: 
          <strong> พนักงานทั่วไปที่ไม่มีตำแหน่งบังคับบัญชา </strong>
          ไม่ได้รับสิทธิ์เข้าดูหน้า "ค้นหา JD ตำแหน่งบังคับบัญชา"
        </p>
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block">
          ท่านสามารถกดปุ่ม "สลับสิทธิ์ผู้ใช้งาน" ที่มุมขวาบนเพื่อทดสอบด้วยบทบาทพนักงานบังคับบัญชา หรือ HR
        </div>
      </div>
    );
  }

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredJds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJds.map(j => j.id));
    }
  };

  const handleDownloadSelectedZip = async () => {
    const selectedJds = allowedJds.filter(j => selectedIds.includes(j.id));
    if (selectedJds.length === 0) return;

    try {
      setIsExportingZip(true);
      await downloadJdsAsZip(selectedJds, `JD_Supervisory_Export_${selectedJds.length}_items.zip`);
    } finally {
      setIsExportingZip(false);
    }
  };

  const isAllSelected = filteredJds.length > 0 && selectedIds.length === filteredJds.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & RBAC Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              ค้นหา JD ตำแหน่งบังคับบัญชา
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleDownloadSelectedZip}
                disabled={isExportingZip}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors shadow-xs"
              >
                <Archive className="w-4 h-4" />
                <span>
                  {isExportingZip ? 'กำลังสร้างไฟล์ ZIP...' : `ดาวน์โหลด ZIP (${selectedIds.length} รายการ)`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาด้วยชื่อตำแหน่ง, ชื่อหน่วยงาน, รหัสตำแหน่ง, รหัสย่อ (เช่น กกพ-ห., หคอ-ห.)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
        </div>

        {/* 5-Tier Cascading Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* 1. สายงาน */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              สายงาน
            </label>
            <select
              value={selectedDeputy}
              onChange={(e) => {
                setSelectedDeputy(e.target.value);
                setSelectedAssistant('');
                setSelectedDepartment('');
                setSelectedDivision('');
                setSelectedSection('');
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="">ทั้งหมด (ทุกสายงาน)</option>
              {deputyOptions.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          {/* 2. ผู้ช่วยผู้ว่าการ */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              ผู้ช่วยผู้ว่าการ
            </label>
            <select
              value={selectedAssistant}
              onChange={(e) => {
                setSelectedAssistant(e.target.value);
                setSelectedDepartment('');
                setSelectedDivision('');
                setSelectedSection('');
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="">ทั้งหมด (ทุกผู้ช่วย)</option>
              {assistantOptions.map(asst => (
                <option key={asst} value={asst}>{asst}</option>
              ))}
            </select>
          </div>

          {/* 3. ฝ่าย */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              ฝ่าย
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedDivision('');
                setSelectedSection('');
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="">ทั้งหมด (ทุกฝ่าย)</option>
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* 4. กอง */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              กอง
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedSection('');
              }}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="">ทั้งหมด (ทุกกอง)</option>
              {divisionOptions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          {/* 5. แผนก */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              แผนก
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="">ทั้งหมด (ทุกแผนก)</option>
              {sectionOptions.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Toolbar & Reset Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            พบข้อมูลตำแหน่งบังคับบัญชาที่สามารถเข้าดูได้:{' '}
            <strong className="text-slate-900 font-mono text-sm">{filteredJds.length}</strong> ตำแหน่ง
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรองทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Results Table & Multi-Select Bar */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Table Selection Header */}
        <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>เลือกทั้งหมด ({filteredJds.length})</span>
            </button>

            {selectedIds.length > 0 && (
              <span className="text-xs text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                เลือกแล้ว {selectedIds.length} รายการ
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDownloadSelectedZip}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดที่เลือกเป็น ZIP</span>
            </button>
          )}
        </div>

        {/* Data Rows */}
        {filteredJds.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">ไม่พบข้อมูลตำแหน่งบังคับบัญชาตามเงื่อนไข หรืออยู่นอกเหนือสิทธิ์ที่ได้รับอนุญาต</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredJds.map((jd) => {
              const isSelected = selectedIds.includes(jd.id);

              return (
                <div
                  key={jd.id}
                  className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(jd.id)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm md:text-base">
                          {jd.positionTitle}
                        </span>
                        <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200">
                          {jd.shortCode}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                          {jd.jobLevelTitle}
                        </span>
                      </div>

                      <div className="text-xs text-indigo-700 font-medium">
                        {jd.orgPath}
                      </div>

                      {/*<div className="text-xs text-slate-600 line-clamp-1 pt-0.5">
                        <span className="font-semibold text-slate-700">วัตถุประสงค์ตำแหน่ง: </span>
                        {jd.positionObjective}
                      </div>*/}
                    </div>
                  </div>

                  {/* Actions for single item */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center pl-7 md:pl-0">
                    <button
                      onClick={() => setModalJd(jd)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>เปิดดู JD</span>
                    </button>

                    <button
                      onClick={() => printDocument(generateJdDocumentHtml(jd), `JD_${jd.unitCode}_${jd.shortCode}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
                      title="พิมพ์หรือบันทึกเป็น PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JD Detail Modal */}
      <JdDetailModal
        jd={modalJd}
        isOpen={!!modalJd}
        onClose={() => setModalJd(null)}
      />
    </div>
  );
};
