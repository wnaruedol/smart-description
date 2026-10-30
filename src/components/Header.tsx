import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ActiveMenu } from '../types';
import { Users, ChevronRight, RefreshCw, Shield, Award, User, Briefcase } from 'lucide-react';

interface HeaderProps {
  activeMenu: ActiveMenu;
  onOpenRoleSwitcher: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeMenu, onOpenRoleSwitcher }) => {
  const { currentUser } = useAuth();

  const getMenuTitle = (menu: ActiveMenu) => {
    switch (menu) {
      case 'home':
        return 'หน้าหลัก (Dashboard)';
      case 'org-chart':
        return 'แผนภูมิโครงสายการบังคับบัญชา (Organization Chart)';
      case 'unit-count':
        return 'จำนวนหน่วยงาน (Organization Statistics)';
      case 'search-fd':
        return 'ค้นหา FD หน้าที่ความรับผิดชอบของหน่วยงาน';
      case 'job-structure':
        return 'โครงสร้างตำแหน่งงาน (Job Level 1-14)';
      case 'search-general-jd':
        return 'ค้นหา JD ตำแหน่งวิชาชีพ / ทั่วไป';
      case 'search-supervisory-jd':
        return 'ค้นหา JD คำบรรยายลักษณะงาน (ตำแหน่งบังคับบัญชา)';
      case 'manage-data':
        return 'จัดการข้อมูล FD / JD (สำหรับผู้ดูแลระบบ HR)';
      default:
        return 'ระบบ SMART Description';
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin_hr_fd':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'admin_hr_jd':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'executive_recruitment':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'hrbp':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'supervisory_employee':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-end shrink-0 z-10">
      {/* Zone 3: Role Switcher & User Profile */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Switch Persona / Role Button */}
        <button
          onClick={onOpenRoleSwitcher}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
          title="สลับกลุ่มผู้ใช้เพื่อทดสอบสิทธิ์ (RBAC)"
        >
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">สลับสิทธิ์ผู้ใช้งาน</span>
          <span className="md:hidden">สลับผู้ใช้</span>
        </button>

        {/* Current User Card */}
        <div 
          onClick={onOpenRoleSwitcher}
          className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer group"
          title="คลิกเพื่อสลับบทบาท"
        >
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {currentUser.name.slice(3, 5) || 'พน'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
              {currentUser.name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-xs border ${getRoleBadgeStyle(currentUser.role)}`}>
                {currentUser.unitShortName} • {currentUser.positionTitle.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
