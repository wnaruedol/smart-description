import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FunctionalDescription, JobDescription, JdDutyItem } from '../types';
import { MOCK_NEW_UNITS_WAITING_FD } from '../data/mockData';
import { 
  Building2, 
  UserCheck, 
  Search, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Lock,
  Layers
} from 'lucide-react';
import { FdDetailModal } from '../components/FdDetailModal';
import { JdDetailModal } from '../components/JdDetailModal';
import { Pagination } from '../components/Pagination';

const formatThaiDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  if (/[ก-๙]/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      const month = thaiMonths[d.getMonth()];
      const year = d.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
};

export const ManageDataView: React.FC = () => {
  const { 
    currentUser, 
    fdList, 
    addFd, 
    updateFd, 
    deleteFd, 
    jdList, 
    addJd, 
    updateJd, 
    deleteJd, 
    canManageFd, 
    canManageJd,
    canAccessAdminMenu 
  } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'fd' | 'jd'>('fd');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeputy, setSelectedDeputy] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Modals
  const [viewingFd, setViewingFd] = useState<FunctionalDescription | null>(null);
  const [viewingJd, setViewingJd] = useState<JobDescription | null>(null);

  // Add / Edit States for FD
  const [isAddFdOpen, setIsAddFdOpen] = useState(false);
  const [editingFd, setEditingFd] = useState<FunctionalDescription | null>(null);

  // Add / Edit States for JD
  const [isAddJdOpen, setIsAddJdOpen] = useState(false);
  const [editingJd, setEditingJd] = useState<JobDescription | null>(null);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'fd' | 'jd'; id: string; name: string } | null>(null);

  // Pagination State for FD and JD tables
  const [currentFdPage, setCurrentFdPage] = useState(1);
  const [fdPageSize, setFdPageSize] = useState(10);
  const [currentJdPage, setCurrentJdPage] = useState(1);
  const [jdPageSize, setJdPageSize] = useState(10);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDeputy('');
    setSelectedAssistant('');
    setSelectedDepartment('');
    setSelectedDivision('');
    setSelectedSection('');
    setCurrentFdPage(1);
    setCurrentJdPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentFdPage(1);
    setCurrentJdPage(1);
  }, [searchTerm, selectedDeputy, selectedAssistant, selectedDepartment, selectedDivision, selectedSection]);

  // 1. FD Filtered Data
  const filteredFds = useMemo(() => {
    return fdList.filter(fd => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q ||
        fd.name.toLowerCase().includes(q) ||
        fd.shortName.toLowerCase().includes(q) ||
        fd.code.toLowerCase().includes(q) ||
        fd.orgPath.toLowerCase().includes(q);

      const matchDep = !selectedDeputy || fd.deputyName === selectedDeputy;
      const matchAsst = !selectedAssistant || fd.assistantName === selectedAssistant;
      const matchDept = !selectedDepartment || fd.departmentName === selectedDepartment;
      const matchDiv = !selectedDivision || fd.divisionName === selectedDivision;
      const matchSec = !selectedSection || fd.sectionName === selectedSection;

      return matchSearch && matchDep && matchAsst && matchDept && matchDiv && matchSec;
    });
  }, [fdList, searchTerm, selectedDeputy, selectedAssistant, selectedDepartment, selectedDivision, selectedSection]);

  const totalFdPages = Math.ceil(filteredFds.length / fdPageSize) || 1;
  const paginatedFds = useMemo(() => {
    const start = (currentFdPage - 1) * fdPageSize;
    return filteredFds.slice(start, start + fdPageSize);
  }, [filteredFds, currentFdPage, fdPageSize]);

  // 2. JD Filtered Data
  const filteredJds = useMemo(() => {
    return jdList.filter(jd => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q ||
        jd.positionTitle.toLowerCase().includes(q) ||
        jd.shortCode.toLowerCase().includes(q) ||
        jd.unitName.toLowerCase().includes(q) ||
        jd.unitCode.toLowerCase().includes(q) ||
        jd.orgPath.toLowerCase().includes(q);

      const matchDep = !selectedDeputy || jd.orgPath.includes(selectedDeputy);
      const matchAsst = !selectedAssistant || jd.orgPath.includes(selectedAssistant);
      const matchDept = !selectedDepartment || jd.orgPath.includes(selectedDepartment);
      const matchDiv = !selectedDivision || jd.orgPath.includes(selectedDivision);
      const matchSec = !selectedSection || jd.orgPath.includes(selectedSection);

      return matchSearch && matchDep && matchAsst && matchDept && matchDiv && matchSec;
    });
  }, [jdList, searchTerm, selectedDeputy, selectedAssistant, selectedDepartment, selectedDivision, selectedSection]);

  const totalJdPages = Math.ceil(filteredJds.length / jdPageSize) || 1;
  const paginatedJds = useMemo(() => {
    const start = (currentJdPage - 1) * jdPageSize;
    return filteredJds.slice(start, start + jdPageSize);
  }, [filteredJds, currentJdPage, jdPageSize]);

  // Delete Action Confirm
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'fd') {
      deleteFd(deleteTarget.id);
    } else {
      deleteJd(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  if (!canAccessAdminMenu) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-xl border border-red-200 text-center shadow-xs">
        <Lock className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">สงวนสิทธิ์เฉพาะผู้ดูแลระบบ HR</h2>
        <p className="text-sm text-slate-600 mb-4">
          เมนูนี้อนุญาตให้เฉพาะกลุ่ม <strong>แอดมิน HR-FD</strong> หรือ <strong>แอดมิน HR-JD</strong> เข้าถึงเท่านั้น
        </p>
        <p className="text-xs text-slate-400">กรุณาสลับสิทธิ์ผู้ใช้งานที่แถบด้านบนเพื่อเข้าใช้งาน</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 tracking-wide uppercase">
            ระบบบริหารจัดการข้อมูล (ADMINISTRATOR)
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            จัดการข้อมูล FD / JD ขององค์การ
          </h1>
        </div>

        {/* Current Admin Role Indicator */}
        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-lg border border-amber-200 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          {/*<div>
            <span className="font-bold">สิทธิ์การแก้ไขของคุณ: </span>
            {canManageFd && <span className="text-emerald-700 font-bold">สามารถ เพิ่ม/แก้ไข/ลบ FD ได้ (HR-FD)</span>}
            {canManageJd && <span className="text-indigo-700 font-bold">สามารถ เพิ่ม/แก้ไข/ลบ JD ได้ (HR-JD)</span>}
          </div>*/}
        </div>
      </div>

      {/* Tabs Switcher: FD หน่วยงาน vs JD ตำแหน่งบังคับบัญชา */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('fd')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'fd'
              ? 'border-blue-600 text-blue-700 bg-blue-50/30'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>FD หน่วยงาน</span>
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
            {fdList.length}
          </span>
          {canManageFd ? (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-xs font-normal">
              แก้ไขได้
            </span>
          ) : (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-xs font-normal">
              ดูอย่างเดียว
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('jd')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'jd'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>JD ตำแหน่งบังคับบัญชา</span>
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
            {jdList.filter(j => j.isSupervisory).length}
          </span>
          {canManageJd ? (
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-xs font-normal">
              แก้ไขได้
            </span>
          ) : (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-xs font-normal">
              ดูอย่างเดียว
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด้วยชื่อตำแหน่ง, ชื่อหน่วยงาน, รหัส Sxxxxxx, ชื่อย่อ..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Add New Button based on Tab and Role */}
          {activeTab === 'fd' && (
            <button
              onClick={() => setIsAddFdOpen(true)}
              disabled={!canManageFd}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-xs ${
                canManageFd
                  ? 'bg-blue-700 text-white hover:bg-blue-800 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title={!canManageFd ? 'เฉพาะกลุ่ม HR-FD เท่านั้นที่สามารถเพิ่ม FD ได้' : ''}
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่ม FD ใหม่</span>
            </button>
          )}

          {activeTab === 'jd' && (
            <button
              onClick={() => setIsAddJdOpen(true)}
              disabled={!canManageJd}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-xs ${
                canManageJd
                  ? 'bg-indigo-700 text-white hover:bg-indigo-800 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title={!canManageJd ? 'เฉพาะกลุ่ม HR-JD เท่านั้นที่สามารถเพิ่ม JD ได้' : ''}
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่ม JD ใหม่</span>
            </button>
          )}
        </div>

        {/* 5 Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">สายงาน</label>
            <input
              type="text"
              value={selectedDeputy}
              onChange={(e) => setSelectedDeputy(e.target.value)}
              placeholder="ระบุสายงาน..."
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">ผู้ช่วย</label>
            <input
              type="text"
              value={selectedAssistant}
              onChange={(e) => setSelectedAssistant(e.target.value)}
              placeholder="ระบุผู้ช่วย..."
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">ฝ่าย</label>
            <input
              type="text"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              placeholder="ระบุฝ่าย..."
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">กอง</label>
            <input
              type="text"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              placeholder="ระบุกอง..."
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">แผนก</label>
            <input
              type="text"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              placeholder="ระบุแผนก..."
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            แสดงผล: <strong className="font-mono text-slate-900">{activeTab === 'fd' ? filteredFds.length : filteredJds.length}</strong> รายการ
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรอง</span>
          </button>
        </div>
      </div>

      {/* Table: FD TAB */}
      {activeTab === 'fd' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3.5">ชื่อหน่วยงาน</th>
                  <th scope="col" className="px-4 py-3.5">สายการบังคับบัญชา</th>
                  <th scope="col" className="px-4 py-3.5">รหัส SAP</th>
                  <th scope="col" className="px-4 py-3.5 whitespace-nowrap">มีผลบังคับใช้</th>
                  <th scope="col" className="px-4 py-3.5 text-center">สถานะ</th>
                  <th scope="col" className="px-4 py-3.5 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      ไม่พบข้อมูลหน่วยงานตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  paginatedFds.map((fd) => (
                    <tr key={fd.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{fd.name}</span>
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200">
                            {fd.shortName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={fd.orgPath}>
                        {fd.orgPath}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-blue-700">
                        {fd.code}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-medium">
                        {formatThaiDate(fd.effectiveDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● {fd.status}
                        </span>
                      </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingFd(fd)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="ดูรายละเอียด FD"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (canManageFd) setEditingFd(fd);
                          }}
                          disabled={!canManageFd}
                          className={`p-1.5 rounded-md transition-colors ${
                            canManageFd
                              ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title={canManageFd ? 'แก้ไข FD' : 'เฉพาะกลุ่ม HR-FD เท่านั้นที่แก้ไขได้'}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (canManageFd) {
                              setDeleteTarget({ type: 'fd', id: fd.id, name: `${fd.name} (${fd.code})` });
                            }
                          }}
                          disabled={!canManageFd}
                          className={`p-1.5 rounded-md transition-colors ${
                            canManageFd
                              ? 'text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title={canManageFd ? 'ลบ FD' : 'เฉพาะกลุ่ม HR-FD เท่านั้นที่ลบได้'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentFdPage}
            totalPages={totalFdPages}
            totalItems={filteredFds.length}
            pageSize={fdPageSize}
            onPageChange={setCurrentFdPage}
            onPageSizeChange={setFdPageSize}
            colorTheme="blue"
          />
        </div>
      )}

      {/* Table: JD TAB */}
      {activeTab === 'jd' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3.5">ชื่อตำแหน่งงาน</th>
                  <th scope="col" className="px-4 py-3.5">สายการบังคับบัญชา</th>
                  <th scope="col" className="px-4 py-3.5">รหัส SAP</th>
                  <th scope="col" className="px-4 py-3.5 whitespace-nowrap">มีผลบังคับใช้</th>
                  <th scope="col" className="px-4 py-3.5 text-center">สถานะ</th>
                  <th scope="col" className="px-4 py-3.5 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredJds.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      ไม่พบข้อมูลตำแหน่งงานตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  paginatedJds.map((jd) => (
                    <tr key={jd.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{jd.positionTitle}</span>
                          <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-sm border border-indigo-200">
                            {jd.shortCode}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={jd.orgPath}>
                        {jd.orgPath}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-indigo-700">
                        {jd.unitCode}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-medium">
                        {formatThaiDate(jd.effectiveDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● {jd.status}
                        </span>
                      </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingJd(jd)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="ดูรายละเอียด JD"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (canManageJd) setEditingJd(jd);
                          }}
                          disabled={!canManageJd}
                          className={`p-1.5 rounded-md transition-colors ${
                            canManageJd
                              ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title={canManageJd ? 'แก้ไข JD' : 'เฉพาะกลุ่ม HR-JD เท่านั้นที่แก้ไขได้'}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (canManageJd) {
                              setDeleteTarget({ type: 'jd', id: jd.id, name: `${jd.positionTitle} (${jd.unitCode})` });
                            }
                          }}
                          disabled={!canManageJd}
                          className={`p-1.5 rounded-md transition-colors ${
                            canManageJd
                              ? 'text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed'
                          }`}
                          title={canManageJd ? 'ลบ JD' : 'เฉพาะกลุ่ม HR-JD เท่านั้นที่ลบได้'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentJdPage}
            totalPages={totalJdPages}
            totalItems={filteredJds.length}
            pageSize={jdPageSize}
            onPageChange={setCurrentJdPage}
            onPageSizeChange={setJdPageSize}
            colorTheme="indigo"
          />
        </div>
      )}

      {/* MODAL 1: ADD FD MODAL */}
      {isAddFdOpen && (
        <AddFdModal
          onClose={() => setIsAddFdOpen(false)}
          onSave={(newFd) => {
            addFd(newFd);
            setIsAddFdOpen(false);
          }}
        />
      )}

      {/* MODAL 2: EDIT FD MODAL */}
      {editingFd && (
        <EditFdModal
          fd={editingFd}
          onClose={() => setEditingFd(null)}
          onSave={(updated) => {
            updateFd(editingFd.id, updated);
            setEditingFd(null);
          }}
        />
      )}

      {/* MODAL 3: ADD JD MODAL */}
      {isAddJdOpen && (
        <AddJdModal
          fdList={fdList}
          onClose={() => setIsAddJdOpen(false)}
          onSave={(newJd) => {
            addJd(newJd);
            setIsAddJdOpen(false);
          }}
        />
      )}

      {/* MODAL 4: EDIT JD MODAL */}
      {editingJd && (
        <EditJdModal
          jd={editingJd}
          fdList={fdList}
          onClose={() => setEditingJd(null)}
          onSave={(updated) => {
            updateJd(editingJd.id, updated);
            setEditingJd(null);
          }}
        />
      )}

      {/* MODAL 5: DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ยืนยันการลบข้อมูล (Delete)
              </h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              คุณแน่ใจหรือไม่ว่าต้องการลบรายการ: <br />
              <strong className="text-slate-900">{deleteTarget.name}</strong>
              <br /><br />
              {/*<span className="text-red-500 font-semibold">* การลบนี้จะมีผลต่อฐานข้อมูลในระบบทันที</span>*/}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modals */}
      <FdDetailModal
        fd={viewingFd}
        isOpen={!!viewingFd}
        onClose={() => setViewingFd(null)}
      />

      <JdDetailModal
        jd={viewingJd}
        isOpen={!!viewingJd}
        onClose={() => setViewingJd(null)}
      />
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: ADD FD MODAL
// -------------------------------------------------------------
interface AddFdModalProps {
  onClose: () => void;
  onSave: (fd: Omit<FunctionalDescription, 'id' | 'updatedAt'>) => void;
}

const AddFdModal: React.FC<AddFdModalProps> = ({ onClose, onSave }) => {
  // Option to select new unit waiting for FD or custom
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [objective, setObjective] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [orderNo, setOrderNo] = useState('กฟผ. ที่ ค.155/2567');
  const [effectiveDate, setEffectiveDate] = useState('1 ต.ค. 2567');

  const presetUnits = MOCK_NEW_UNITS_WAITING_FD;
  const currentUnit = presetUnits[selectedPresetIndex];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) {
      alert('กรุณากรอกวัตถุประสงค์ของหน่วยงาน');
      return;
    }

    const bullets = responsibilitiesText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    onSave({
      code: currentUnit.code,
      shortName: currentUnit.shortName,
      name: currentUnit.name,
      levelType: currentUnit.levelType,
      deputyName: currentUnit.deputyName,
      assistantName: currentUnit.assistantName,
      departmentName: currentUnit.departmentName,
      divisionName: currentUnit.divisionName,
      sectionName: currentUnit.sectionName,
      orgPath: currentUnit.orgPath,
      objective: objective.trim(),
      responsibilities: bullets.length > 0 ? bullets : ['ปฏิบัติหน้าที่ความรับผิดชอบตามภารกิจหลักของหน่วยงาน'],
      orderNo,
      effectiveDate,
      status: 'ใช้งาน',
      itemCount: bullets.length
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-blue-700">ADD FUNCTIONAL DESCRIPTION</div>
            <h2 className="text-lg font-bold text-slate-900">เพิ่ม FD หน่วยงานใหม่</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-100 text-xs text-blue-800">
            <strong>* หมายเหตุตามระเบียบ:</strong> กรณีมีหน่วยงานใหม่ รอให้มีหน่วยงานใหม่บังคับใช้ก่อน ให้เลือกหน่วยงานใหม่ที่ยังไม่มี FD แล้วใส่วัตถุประสงค์และความรับผิดชอบหลัก
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              เลือกหน่วยงานใหม่ที่ยังไม่มี FD (ดึงจาก SAP Org Structure)
            </label>
            <select
              value={selectedPresetIndex}
              onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
              className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              {presetUnits.map((u, idx) => (
                <option key={u.code} value={idx}>
                  {u.code} : {u.name} ({u.shortName})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div><span className="font-semibold">สายการบังคับบัญชา:</span> {currentUnit.orgPath}</div>
            <div><span className="font-semibold">ชื่อหน่วยงานย่อ:</span> {currentUnit.shortName}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              วัตถุประสงค์ของหน่วยงาน (Paragraph) *
            </label>
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="กรอกวัตถุประสงค์ของหน่วยงานเป็นข้อความพารากราฟ..."
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ความรับผิดชอบหลัก (1 บรรทัด = 1 Bullet) *
            </label>
            <textarea
              rows={5}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              placeholder="ข้อ 1: ศึกษาและวิเคราะห์ข้อมูล...&#10;ข้อ 2: ดำเนินการจัดทำแผนงาน...&#10;ข้อ 3: พัฒนาระบบสารสนเทศ..."
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">เลขที่คำสั่ง กฟผ.</label>
              <input
                type="text"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">มีผลบังคับใช้</label>
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              บันทึก FD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: EDIT FD MODAL
// -------------------------------------------------------------
interface EditFdModalProps {
  fd: FunctionalDescription;
  onClose: () => void;
  onSave: (updated: Partial<FunctionalDescription>) => void;
}

const EditFdModal: React.FC<EditFdModalProps> = ({ fd, onClose, onSave }) => {
  const [objective, setObjective] = useState(fd.objective);
  const [responsibilitiesText, setResponsibilitiesText] = useState(fd.responsibilities.join('\n'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bullets = responsibilitiesText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    onSave({
      objective: objective.trim(),
      responsibilities: bullets,
      itemCount: bullets.length
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-amber-700">EDIT FUNCTIONAL DESCRIPTION</div>
            <h2 className="text-lg font-bold text-slate-900">แก้ไข FD: {fd.name} ({fd.shortName})</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div><span className="font-semibold text-slate-700">รหัสหน่วยงาน:</span> {fd.code} ({fd.shortName})</div>
            <div><span className="font-semibold text-slate-700">สังกัด:</span> {fd.orgPath}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              วัตถุประสงค์ของหน่วยงาน (แก้ไขได้)
            </label>
            <textarea
              rows={4}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หน้าที่และความรับผิดชอบหลัก (1 บรรทัด = 1 Bullet)
            </label>
            <textarea
              rows={6}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono leading-relaxed"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              บันทึกการแก้ไข FD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: ADD JD MODAL
// -------------------------------------------------------------
interface AddJdModalProps {
  fdList: FunctionalDescription[];
  onClose: () => void;
  onSave: (jd: Omit<JobDescription, 'id' | 'updatedAt'>) => void;
}

const AddJdModal: React.FC<AddJdModalProps> = ({ fdList, onClose, onSave }) => {
  const [selectedFdId, setSelectedFdId] = useState(fdList[0]?.id || '');
  const selectedFd = fdList.find(f => f.id === selectedFdId) || fdList[0];

  const [positionTitle, setPositionTitle] = useState('');
  const [levelNumber, setLevelNumber] = useState(10);
  const [jobLevelTitle, setJobLevelTitle] = useState('หัวหน้ากอง');
  const [directSupervisor, setDirectSupervisor] = useState('');
  const [directSubordinatesText, setDirectSubordinatesText] = useState('');
  const [positionObjective, setPositionObjective] = useState('');
  
  // Table 3 columns duties
  const [duties, setDuties] = useState<JdDutyItem[]>([
    {
      id: 'dt-1',
      taskGroup: '1. การบริหารและวางแผนงาน',
      responsibilities: ['วางแผน ควบคุม และกำกับดูแลงานในหน้าที่'],
      expectedOutcomes: ['งานสำเร็จลุล่วงตามแผนงานและ KPI']
    }
  ]);

  // Qualifications
  const [basicQualifications, setBasicQualifications] = useState('ปัจจุบันดำรงตำแหน่งหัวหน้าแผนก หรือเทียบเท่า เป็นพนักงานระดับ 8 มาเป็นเวลาไม่น้อยกว่า 2 ปี');
  const [educationLevel, setEducationLevel] = useState('สำเร็จการศึกษาระดับปริญญาตรีขึ้นไป');
  const [fieldsOfStudy, setFieldsOfStudy] = useState('บริหารธุรกิจ, รัฐศาสตร์ หรือสาขาที่เกี่ยวข้อง');
  const [workExperience, setWorkExperience] = useState('มีประสบการณ์การทำงานในสายงานไม่น้อยกว่า 5 ปี');

  // Copy from FD
  const handleCopyFromFd = () => {
    if (selectedFd) {
      setPositionObjective(selectedFd.objective);
      const newDuties: JdDutyItem[] = selectedFd.responsibilities.map((resp, idx) => ({
        id: `copied-${idx}`,
        taskGroup: `${idx + 1}. งานตามภารกิจหลัก`,
        responsibilities: [resp],
        expectedOutcomes: ['ผลการปฏิบัติงานเป็นไปตามมาตรฐานที่กำหนดและถูกต้อง 100%']
      }));
      setDuties(newDuties);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionTitle.trim()) {
      alert('กรุณากรอกชื่อตำแหน่งงาน');
      return;
    }

    const subs = directSubordinatesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      fdId: selectedFd.id,
      positionTitle: positionTitle.trim(),
      positionCode: `JD-${selectedFd.code}-NEW`,
      shortCode: selectedFd.shortName,
      orgPath: selectedFd.orgPath,
      departmentLine: `${selectedFd.deputyName} / ${selectedFd.assistantName || selectedFd.departmentName}`,
      jobLevelTitle,
      levelNumber,
      isSupervisory: true,
      directSupervisor: directSupervisor || 'ผู้บังคับบัญชาตามสายงาน',
      directSubordinates: subs,
      unitCode: selectedFd.code,
      unitName: selectedFd.name,
      orderNo: selectedFd.orderNo,
      effectiveDate: selectedFd.effectiveDate,
      status: 'ใช้งาน',
      positionObjective: positionObjective || selectedFd.objective,
      duties,
      qualifications: {
        basicQualifications,
        educationLevel,
        fieldsOfStudy,
        workExperience
      },
      targetCategory: 'supervisory'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-indigo-700">ADD JOB DESCRIPTION</div>
            <h2 className="text-lg font-bold text-slate-900">เพิ่ม JD ตำแหน่งบังคับบัญชาใหม่</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Step 1: Select Reference FD */}
          <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
              <label className="text-xs font-bold text-indigo-900">
                1. เลือก FD ที่ต้องการอ้างอิง *
              </label>
              <button
                type="button"
                onClick={handleCopyFromFd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกวัตถุประสงค์และความรับผิดชอบหลักจาก FD</span>
              </button>
            </div>

            <select
              value={selectedFdId}
              onChange={(e) => setSelectedFdId(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              {fdList.map(f => (
                <option key={f.id} value={f.id}>
                  {f.code} : {f.name} ({f.shortName})
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mt-1">
              สังกัด: {selectedFd?.orgPath}
            </div>
          </div>

          {/* Position Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อตำแหน่งงาน (เช่น หัวหน้ากอง... (กกพ-ห.)) *
              </label>
              <input
                type="text"
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                placeholder="เช่น หัวหน้ากอง..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ระดับงาน / ตำแหน่ง
              </label>
              <select
                value={levelNumber}
                onChange={(e) => {
                  const lvl = Number(e.target.value);
                  setLevelNumber(lvl);
                  if (lvl === 14) setJobLevelTitle('รองผู้ว่าการ (ระดับ 14)');
                  else if (lvl === 13) setJobLevelTitle('ผู้ช่วยผู้ว่าการ (ระดับ 13)');
                  else if (lvl === 12) setJobLevelTitle('ผู้อำนวยการฝ่าย (ระดับ 12)');
                  else if (lvl === 11) setJobLevelTitle('ผู้ช่วยผู้อำนวยการฝ่าย (ระดับ 11)');
                  else if (lvl === 10) setJobLevelTitle('หัวหน้ากอง (ระดับ 10)');
                  else if (lvl === 9) setJobLevelTitle('รักษาการหัวหน้ากอง (ระดับ 9)');
                  else if (lvl === 8) setJobLevelTitle('หัวหน้าแผนก (ระดับ 8)');
                  else if (lvl === 7) setJobLevelTitle('รักษาการหัวหน้าแผนก (ระดับ 7)');
                }}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
              >
                <option value={14}>รองผู้ว่าการ (ระดับ 14)</option>
                <option value={13}>ผู้ช่วยผู้ว่าการ (ระดับ 13)</option>
                <option value={12}>ผู้อำนวยการฝ่าย (ระดับ 12)</option>
                <option value={11}>ผู้ช่วยผู้อำนวยการฝ่าย (ระดับ 11)</option>
                <option value={10}>หัวหน้ากอง (ระดับ 10)</option>
                <option value={9}>รักษาการหัวหน้ากอง (ระดับ 9)</option>
                <option value={8}>หัวหน้าแผนก (ระดับ 8)</option>
                <option value={7}>รักษาการหัวหน้าแผนก (ระดับ 7)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ผู้บังคับบัญชาโดยตรง</label>
              <input
                type="text"
                value={directSupervisor}
                onChange={(e) => setDirectSupervisor(e.target.value)}
                placeholder="เช่น ผู้อำนวยการฝ่าย..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ตำแหน่งภายใต้บังคับบัญชา (1 บรรทัด = 1 ตำแหน่ง)
              </label>
              <textarea
                rows={2}
                value={directSubordinatesText}
                onChange={(e) => setDirectSubordinatesText(e.target.value)}
                placeholder="หัวหน้าแผนก...&#10;วิทยากรระดับ..."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Section: วัตถุประสงค์ของตำแหน่งงาน */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              วัตถุประสงค์ของตำแหน่งงาน (Paragraph)
            </label>
            <textarea
              rows={3}
              value={positionObjective}
              onChange={(e) => setPositionObjective(e.target.value)}
              placeholder="วัตถุประสงค์ตำแหน่งงาน..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg leading-relaxed"
            />
          </div>

          {/* Section: หน้าที่ความรับผิดชอบ (ตาราง 3 คอลัมน์) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                หน้าที่ความรับผิดชอบและผลลัพธ์ที่คาดหวัง (ตาราง 3 คอลัมน์)
              </label>
              <button
                type="button"
                onClick={() => {
                  setDuties(prev => [
                    ...prev,
                    {
                      id: `duty-${Date.now()}`,
                      taskGroup: `${prev.length + 1}. งานที่มอบหมายเพิ่มเติม`,
                      responsibilities: ['ปฏิบัติงานตามที่ได้รับมอบหมาย'],
                      expectedOutcomes: ['งานสำเร็จตามเกณฑ์มาตรฐาน']
                    }
                  ]);
                }}
                className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแถวหัวข้องาน</span>
              </button>
            </div>

            <div className="space-y-3">
              {duties.map((duty, idx) => (
                <div key={duty.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">หัวข้องานที่ {idx + 1}</span>
                    {duties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDuties(prev => prev.filter((_, i) => i !== idx))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        ลบแถวนี้
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={duty.taskGroup}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDuties(prev => prev.map((d, i) => i === idx ? { ...d, taskGroup: val } : d));
                    }}
                    placeholder="หัวข้องาน"
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">หน้าที่ความรับผิดชอบ (คั่นด้วย ;)</label>
                      <input
                        type="text"
                        value={duty.responsibilities.join('; ')}
                        onChange={(e) => {
                          const val = e.target.value.split(';').map(s => s.trim()).filter(Boolean);
                          setDuties(prev => prev.map((d, i) => i === idx ? { ...d, responsibilities: val } : d));
                        }}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">ผลลัพธ์ที่คาดหวัง (คั่นด้วย ;)</label>
                      <input
                        type="text"
                        value={duty.expectedOutcomes.join('; ')}
                        onChange={(e) => {
                          const val = e.target.value.split(';').map(s => s.trim()).filter(Boolean);
                          setDuties(prev => prev.map((d, i) => i === idx ? { ...d, expectedOutcomes: val } : d));
                        }}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: คุณสมบัติเฉพาะตำแหน่ง (4 รายการ) */}
          <div className="p-4 rounded-lg border-2 border-slate-300 bg-slate-50/50 space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase">
              คุณสมบัติเฉพาะด้าน (Job Specifications - กรอบ 4 รายการ)
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">1. คุณสมบัติพื้นฐาน</label>
              <input
                type="text"
                value={basicQualifications}
                onChange={(e) => setBasicQualifications(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">2. ระดับการศึกษา</label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">3. คุณวุฒิ / สาขาวิชา</label>
              <input
                type="text"
                value={fieldsOfStudy}
                onChange={(e) => setFieldsOfStudy(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">4. ประสบการณ์ทำงาน</label>
              <input
                type="text"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              บันทึก JD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-COMPONENT: EDIT JD MODAL
// -------------------------------------------------------------
interface EditJdModalProps {
  jd: JobDescription;
  fdList: FunctionalDescription[];
  onClose: () => void;
  onSave: (updated: Partial<JobDescription>) => void;
}

const EditJdModal: React.FC<EditJdModalProps> = ({ jd, fdList, onClose, onSave }) => {
  const [positionObjective, setPositionObjective] = useState(jd.positionObjective);
  const [duties, setDuties] = useState<JdDutyItem[]>(jd.duties);
  const [qualifications, setQualifications] = useState(jd.qualifications);

  // Pull from matching FD
  const matchingFd = fdList.find(f => f.id === jd.fdId || f.code === jd.unitCode);

  const handlePullFromFd = () => {
    if (matchingFd) {
      setPositionObjective(matchingFd.objective);
      const newDuties: JdDutyItem[] = matchingFd.responsibilities.map((r, i) => ({
        id: `pulled-${i}`,
        taskGroup: `${i + 1}. งานตามภารกิจองค์การ`,
        responsibilities: [r],
        expectedOutcomes: ['ผลลัพธ์เป็นไปตามเกณฑ์มาตรฐาน กฟผ. 100%']
      }));
      setDuties(newDuties);
    } else {
      alert('ไม่พบข้อมูล FD ต้นทาง');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      positionObjective,
      duties,
      qualifications
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-amber-700">EDIT JOB DESCRIPTION</div>
            <h2 className="text-lg font-bold text-slate-900">แก้ไข JD: {jd.positionTitle}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-700">หน่วยงาน:</span> {jd.unitName} ({jd.unitCode})
              <span className="ml-3 font-semibold text-slate-700">ระดับ:</span> {jd.jobLevelTitle}
            </div>
            <button
              type="button"
              onClick={handlePullFromFd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>ดึงวัตถุประสงค์และความรับผิดชอบจาก FD มาใส่</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              วัตถุประสงค์ของตำแหน่งงาน (แก้ไขได้)
            </label>
            <textarea
              rows={3}
              value={positionObjective}
              onChange={(e) => setPositionObjective(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              หน้าที่ความรับผิดชอบ (ตาราง 3 คอลัมน์)
            </label>
            <div className="space-y-3">
              {duties.map((duty, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                  <input
                    type="text"
                    value={duty.taskGroup}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDuties(prev => prev.map((d, i) => i === idx ? { ...d, taskGroup: val } : d));
                    }}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500">หน้าที่ความรับผิดชอบ (คั่นด้วย ;)</span>
                      <textarea
                        rows={2}
                        value={duty.responsibilities.join('; ')}
                        onChange={(e) => {
                          const val = e.target.value.split(';').map(s => s.trim()).filter(Boolean);
                          setDuties(prev => prev.map((d, i) => i === idx ? { ...d, responsibilities: val } : d));
                        }}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">ผลลัพธ์ที่คาดหวัง (คั่นด้วย ;)</span>
                      <textarea
                        rows={2}
                        value={duty.expectedOutcomes.join('; ')}
                        onChange={(e) => {
                          const val = e.target.value.split(';').map(s => s.trim()).filter(Boolean);
                          setDuties(prev => prev.map((d, i) => i === idx ? { ...d, expectedOutcomes: val } : d));
                        }}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications 4 items */}
          <div className="p-4 rounded-lg border-2 border-slate-300 bg-slate-50/50 space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase">
              คุณสมบัติเฉพาะด้าน (แก้ไขได้)
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">1. คุณสมบัติพื้นฐาน</label>
              <input
                type="text"
                value={qualifications.basicQualifications}
                onChange={(e) => setQualifications(prev => ({ ...prev, basicQualifications: e.target.value }))}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">2. ระดับการศึกษา</label>
              <input
                type="text"
                value={qualifications.educationLevel}
                onChange={(e) => setQualifications(prev => ({ ...prev, educationLevel: e.target.value }))}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">3. คุณวุฒิ / สาขาวิชา</label>
              <input
                type="text"
                value={qualifications.fieldsOfStudy}
                onChange={(e) => setQualifications(prev => ({ ...prev, fieldsOfStudy: e.target.value }))}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-0.5">4. ประสบการณ์ทำงาน</label>
              <input
                type="text"
                value={qualifications.workExperience}
                onChange={(e) => setQualifications(prev => ({ ...prev, workExperience: e.target.value }))}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              บันทึกการแก้ไข JD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
