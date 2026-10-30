import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, UserRole } from '../types';
import { X, Check, Shield, Users, User, Briefcase, Award, Sparkles } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, allUsers, switchUser } = useAuth();

  if (!isOpen) return null;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin_hr_fd':
        return { label: 'Admin HR-FD', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'admin_hr_jd':
        return { label: 'Admin HR-JD', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'executive_recruitment':
        return { label: 'ทีมสรรหาผู้บริหาร', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'hrbp':
        return { label: 'HRBP', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'supervisory_employee':
        return { label: 'ตำแหน่งบังคับบัญชา (ผบ.)', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'general_employee':
      default:
        return { label: 'พนักงานทั่วไป', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin_hr_fd':
      case 'admin_hr_jd':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'executive_recruitment':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'hrbp':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'supervisory_employee':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      default:
        return <User className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPermissionSummary = (role: UserRole) => {
    switch (role) {
      case 'general_employee':
        return 'เข้าดูได้ทุกเมนู ยกเว้นหน้า "ค้นหา JD ตำแหน่งบังคับบัญชา" และไม่มีสิทธิ์จัดการข้อมูล';
      case 'supervisory_employee':
        return 'ค้นหา JD ได้เฉพาะตำแหน่งบังคับบัญชาของหน่วยงานตนเอง (กกพ-ห.) และหน่วยงานภายใต้สังกัด';
      case 'hrbp':
        return 'ค้นหา JD ได้เฉพาะตำแหน่งหัวหน้ากอง + หัวหน้าแผนก ตามหน่วยงานที่ดูแล (ฝ่ายเทคโนโลยีฯ และทรัพยากรบุคคล)';
      case 'executive_recruitment':
        return 'ค้นหา JD ได้เฉพาะตำแหน่งตนเอง และตำแหน่งผู้ช่วยผู้อำนวยการฝ่ายขึ้นไปทั้งหมด (ระดับ 11 - 14)';
      case 'admin_hr_fd':
        return 'แอดมินกลุ่ม HR-FD (แผนกโครงสร้างองค์การ หคอ-ห. / กกพ-ห. / อหพ. / ชหพ.): ดู FD, JD ได้ทั้งหมด สามารถเพิ่ม จัดการ ลบ FD ได้ แต่ไม่สามารถเพิ่ม จัดการ ลบ JD ได้';
      case 'admin_hr_jd':
        return 'แอดมินกลุ่ม HR-JD (แผนกความก้าวหน้าในสายอาชีพและตำแหน่งงาน หคต-ห. / กบป-ห. / อหพ. / ชหพ.): ดู FD, JD ได้ทั้งหมด สามารถเพิ่ม จัดการ ลบ JD ได้ แต่ไม่สามารถเพิ่ม จัดการ ลบ FD ได้';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-blue-700 tracking-wide">
              AUTHENTICATION & ROLE SELECTION
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              เข้าสู่ระบบ / สลับกลุ่มผู้ใช้งานตามสิทธิ์ระบบ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          <p className="text-xs text-slate-500 mb-2">
            เลือกรอบการทดสอบระบบด้วยกลุ่มผู้ใช้ 6 กลุ่ม เพื่อตรวจสอบการควบคุมสิทธิ์การเข้าถึง (RBAC) ข้อมูล FD / JD ตามระเบียบองค์การ
          </p>

          <div className="space-y-2.5">
            {allUsers.map((user) => {
              const isSelected = currentUser.id === user.id;
              const badge = getRoleBadge(user.role);
              const icon = getRoleIcon(user.role);

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                          <span className="text-xs text-slate-400">({user.employeeId})</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-0.5">
                          {user.positionTitle} • ระดับ {user.positionLevel}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          หน่วยงาน: {user.unitFullName} ({user.unitShortName})
                        </div>
                        <div className="text-xs text-blue-700 bg-blue-50/80 rounded-md p-2 mt-2 border border-blue-100">
                          <span className="font-semibold">ขอบเขตสิทธิ์: </span>
                          {getPermissionSummary(user.role)}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                          <span>ใช้งานอยู่</span>
                        </div>
                      ) : (
                        <button className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md font-medium transition-colors">
                          เลือกใช้งาน
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
