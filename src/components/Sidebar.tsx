import React from 'react';
import { ActiveMenu } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  GitFork, 
  BarChart3, 
  Search, 
  Layers, 
  Users2, 
  UserCheck, 
  Settings, 
  Lock,
  Building,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeMenu: ActiveMenu;
  onSelectMenu: (menu: ActiveMenu) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onSelectMenu }) => {
  const { currentUser, canAccessSupervisoryJdSearch, canAccessAdminMenu } = useAuth();

  return (
    <aside className="w-64 md:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full select-none">
      {/* Brand Zone */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-slate-900 leading-tight text-base tracking-tight flex items-center gap-1.5">
            <span>SMART Description</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Group 1: General */}
        <div>
          <button
            onClick={() => onSelectMenu('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeMenu === 'home'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-800" />
            <span>1. หน้าหลัก</span>
          </button>
        </div>

        {/* Group 2: โครงสร้างองค์การ */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>โครงสร้างองค์การ</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => onSelectMenu('org-chart')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                activeMenu === 'org-chart'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GitFork className="w-4 h-4 shrink-0 text-slate-400" />
                <span>2. แผนภูมิโครงสายการบังคับบัญชา (ระยะที่ 2)</span>
              </div>
            </button>

            <button
              onClick={() => onSelectMenu('unit-count')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                activeMenu === 'unit-count'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 shrink-0 text-slate-400" />
                <span>3. จำนวนหน่วยงาน (ระยะที่ 2)</span>
              </div>
            </button>

            <button
              onClick={() => onSelectMenu('search-fd')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                activeMenu === 'search-fd'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 shrink-0 text-blue-600" />
                <span>4. ค้นหา FD หน่วยงาน</span>
              </div>
            </button>
          </div>
        </div>

        {/* Group 3: โครงสร้างตำแหน่งงาน */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>โครงสร้างตำแหน่งงาน</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => onSelectMenu('job-structure')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                activeMenu === 'job-structure'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0 text-slate-400" />
                <span>5. โครงสร้างตำแหน่งงาน (ระยะที่ 2)</span>
              </div>
            </button>

            <button
              onClick={() => onSelectMenu('search-general-jd')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                activeMenu === 'search-general-jd'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users2 className="w-4 h-4 shrink-0 text-slate-400" />
                <span>6. ค้นหา JD วิชาชีพ/ทั่วไป (ระยะที่ 2)</span>
              </div>
            </button>

            {/* ค้นหา JD ตำแหน่งบังคับบัญชา with RBAC check */}
            <button
              onClick={() => {
                if (canAccessSupervisoryJdSearch) {
                  onSelectMenu('search-supervisory-jd');
                }
              }}
              disabled={!canAccessSupervisoryJdSearch}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                !canAccessSupervisoryJdSearch
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                  : activeMenu === 'search-supervisory-jd'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
              title={!canAccessSupervisoryJdSearch ? 'พนักงานทั่วไปไม่มีสิทธิ์เข้าถึงเมนูนี้' : ''}
            >
              <div className="flex items-center gap-2.5">
                {canAccessSupervisoryJdSearch ? (
                  <UserCheck className="w-4 h-4 shrink-0 text-indigo-600" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0 text-slate-400" />
                )}
                <span>7. ค้นหา JD ตำแหน่งบังคับบัญชา</span>
              </div>
            </button>
          </div>
        </div>

        {/* Group 4: ผู้ดูแลระบบ (Admin) */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>ผู้ดูแลระบบ</span>
          </div>

          <button
            onClick={() => {
              if (canAccessAdminMenu) {
                onSelectMenu('manage-data');
              }
            }}
            disabled={!canAccessAdminMenu}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              !canAccessAdminMenu
                ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                : activeMenu === 'manage-data'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
            }`}
            title={!canAccessAdminMenu ? 'เฉพาะกลุ่มผู้ดูแลระบบ HR-FD หรือ HR-JD เท่านั้น' : ''}
          >
            <div className="flex items-center gap-2.5">
              {canAccessAdminMenu ? (
                <Settings className="w-4 h-4 shrink-0 text-amber-600" />
              ) : (
                <Lock className="w-4 h-4 shrink-0 text-slate-400" />
              )}
              <span>8. จัดการข้อมูล FD / JD</span>
            </div>
          </button>
        </div>
      </div>

    </aside>
  );
};
