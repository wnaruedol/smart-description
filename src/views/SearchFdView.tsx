import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { FunctionalDescription } from '../types';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  Printer, 
  Eye, 
  Building2, 
  CheckSquare, 
  Square, 
  Archive, 
  CheckCircle2, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { FdDetailModal } from '../components/FdDetailModal';
import { generateFdDocumentHtml, printDocument, downloadFdsAsZip } from '../utils/exportUtils';

export const SearchFdView: React.FC = () => {
  const { fdList } = useAuth();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeputy, setSelectedDeputy] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Selection for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalFd, setModalFd] = useState<FunctionalDescription | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Extract filter options dynamically
  const deputyOptions = useMemo(() => {
    return Array.from(new Set(fdList.map(f => f.deputyName).filter(Boolean)));
  }, [fdList]);

  const assistantOptions = useMemo(() => {
    return Array.from(new Set(
      fdList
        .filter(f => !selectedDeputy || f.deputyName === selectedDeputy)
        .map(f => f.assistantName)
        .filter(Boolean)
    )) as string[];
  }, [fdList, selectedDeputy]);

  const departmentOptions = useMemo(() => {
    return Array.from(new Set(
      fdList
        .filter(f => (!selectedDeputy || f.deputyName === selectedDeputy) &&
                     (!selectedAssistant || f.assistantName === selectedAssistant))
        .map(f => f.departmentName)
        .filter(Boolean)
    )) as string[];
  }, [fdList, selectedDeputy, selectedAssistant]);

  const divisionOptions = useMemo(() => {
    return Array.from(new Set(
      fdList
        .filter(f => (!selectedDepartment || f.departmentName === selectedDepartment))
        .map(f => f.divisionName)
        .filter(Boolean)
    )) as string[];
  }, [fdList, selectedDepartment]);

  const sectionOptions = useMemo(() => {
    return Array.from(new Set(
      fdList
        .filter(f => (!selectedDivision || f.divisionName === selectedDivision))
        .map(f => f.sectionName)
        .filter(Boolean)
    )) as string[];
  }, [fdList, selectedDivision]);

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
  const filteredFds = useMemo(() => {
    return fdList.filter(fd => {
      // Free text search: unit name, code, short code, orgPath
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        fd.name.toLowerCase().includes(query) ||
        fd.shortName.toLowerCase().includes(query) ||
        fd.code.toLowerCase().includes(query) ||
        fd.orgPath.toLowerCase().includes(query);

      // Hierarchical dropdown filters
      const matchesDeputy = !selectedDeputy || fd.deputyName === selectedDeputy;
      const matchesAssistant = !selectedAssistant || fd.assistantName === selectedAssistant;
      const matchesDepartment = !selectedDepartment || fd.departmentName === selectedDepartment;
      const matchesDivision = !selectedDivision || fd.divisionName === selectedDivision;
      const matchesSection = !selectedSection || fd.sectionName === selectedSection;

      return matchesSearch && matchesDeputy && matchesAssistant && matchesDepartment && matchesDivision && matchesSection;
    });
  }, [fdList, searchTerm, selectedDeputy, selectedAssistant, selectedDepartment, selectedDivision, selectedSection]);

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredFds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFds.map(f => f.id));
    }
  };

  const handleDownloadSelectedZip = async () => {
    const selectedFds = fdList.filter(f => selectedIds.includes(f.id));
    if (selectedFds.length === 0) return;

    try {
      setIsExportingZip(true);
      await downloadFdsAsZip(selectedFds, `FD_Export_${selectedFds.length}_items.zip`);
    } finally {
      setIsExportingZip(false);
    }
  };

  const isAllSelected = filteredFds.length > 0 && selectedIds.length === filteredFds.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            ค้นหา FD หน้าที่และความรับผิดชอบของหน่วยงาน
          </h1>
        </div>

        {/* Action button for ZIP export */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDownloadSelectedZip}
              disabled={isExportingZip}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Archive className="w-4 h-4" />
              <span>
                {isExportingZip ? 'กำลังสร้างไฟล์ ZIP...' : `ดาวน์โหลด ZIP (${selectedIds.length} รายการ)`}
              </span>
            </button>
          )}
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
            placeholder="ค้นหาด้วยชื่อตำแหน่ง, ชื่อหน่วยงาน, รหัสหน่วยงาน (เช่น S100240), ชื่อย่อ (เช่น กกพ-ห., หคอ-ห.)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          />
        </div>

        {/* 5-Tier Cascading Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* 1. สายงานรองผู้ว่าการ */}
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
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
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
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
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
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
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
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
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
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
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
            พบข้อมูลหน่วยงาน: <strong className="text-slate-900 font-mono text-sm">{filteredFds.length}</strong> รายการ
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
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>เลือกทั้งหมด ({filteredFds.length})</span>
            </button>

            {selectedIds.length > 0 && (
              <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                เลือกแล้ว {selectedIds.length} รายการ
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDownloadSelectedZip}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดที่เลือกเป็น ZIP</span>
            </button>
          )}
        </div>

        {/* Data Rows */}
        {filteredFds.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">ไม่พบข้อมูลหน่วยงานตามเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFds.map((fd) => {
              const isSelected = selectedIds.includes(fd.id);

              return (
                <div
                  key={fd.id}
                  className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(fd.id)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm md:text-base">
                          {fd.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                          {fd.shortName}
                        </span>
                        <span className="font-mono text-xs text-slate-500">
                          รหัส SAP: {fd.code}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                        <span>{fd.orgPath}</span>
                      </div>

                      {/*<div className="text-xs text-slate-600 line-clamp-1 pt-0.5">
                        <span className="font-semibold text-slate-700">วัตถุประสงค์: </span>
                        {fd.objective}
                      </div>*/}
                    </div>
                  </div>

                  {/* Actions for single item */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center pl-7 md:pl-0">
                    <button
                      onClick={() => setModalFd(fd)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>เปิดดู FD</span>
                    </button>

                    <button
                      onClick={() => printDocument(generateFdDocumentHtml(fd), `FD_${fd.code}_${fd.shortName}`)}
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

      {/* FD Detail Modal */}
      <FdDetailModal
        fd={modalFd}
        isOpen={!!modalFd}
        onClose={() => setModalFd(null)}
      />
    </div>
  );
};
