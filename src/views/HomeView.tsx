import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ActiveMenu, FunctionalDescription, JobDescription } from '../types';
import { 
  Building2, 
  UserCheck, 
  FileText, 
  Download, 
  ExternalLink, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search
} from 'lucide-react';
import { FdDetailModal } from '../components/FdDetailModal';
import { JdDetailModal } from '../components/JdDetailModal';
import { generateFdDocumentHtml, generateJdDocumentHtml, printDocument } from '../utils/exportUtils';

interface HomeViewProps {
  onNavigate: (menu: ActiveMenu) => void;
  onOpenRoleSwitcher: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenRoleSwitcher }) => {
  const { currentUser, fdList, jdList, canAccessSupervisoryJdSearch } = useAuth();

  // Find My FD & My JD
  const myFd = fdList.find(f => f.id === currentUser.myFdId) || fdList[0];
  const myJd = jdList.find(j => j.id === currentUser.myJdId) || jdList[0];

  const [selectedFd, setSelectedFd] = useState<FunctionalDescription | null>(null);
  const [selectedJd, setSelectedJd] = useState<JobDescription | null>(null);

  const handlePrintMyFd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (myFd) {
      printDocument(generateFdDocumentHtml(myFd), `FD_${myFd.code}_${myFd.shortName}`);
    }
  };

  const handlePrintMyJd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (myJd) {
      printDocument(generateJdDocumentHtml(myJd), `JD_${myJd.unitCode}_${myJd.shortCode}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Greeting & User Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              สวัสดีคุณ {currentUser.name}
            </h1>
            <div className="text-slate-200 text-sm md:text-base flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>ตำแหน่ง: <strong className="text-white font-semibold">{currentUser.positionTitle}</strong> (ระดับ {currentUser.positionLevel})</span>
              <span>•</span>
              <span>หน่วยงาน: <strong className="text-white font-semibold">{currentUser.unitFullName} ({currentUser.unitShortName})</strong></span>
              <span>•</span>
              <span>รหัสพนักงาน: <span className="font-mono text-cyan-300">{currentUser.employeeId}</span></span>
            </div>
          </div>
        </div>

        {/* Subtle decorative background circle */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none blur-2xl" />
      </div>

      {/* 2. My FD & My JD Primary Cards (คลิกเพื่อขยาย เปิดเป็น modal กดโหลด PDF ได้) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: FD ของฉัน */}
        <div 
          onClick={() => setSelectedFd(myFd)}
          className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-6 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              FUNCTIONAL DESCRIPTION
            </div>
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              FD ของฉัน ({myFd.name})
            </h2>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">
              สังกัด: {myFd.orgPath}
            </div>

            {/* Objective Preview */}
            <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-1">วัตถุประสงค์หน่วยงาน:</div>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {myFd.objective}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 group-hover:underline inline-flex items-center gap-1">
              <span>คลิกเพื่อขยายดูรายละเอียด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <button
              onClick={handlePrintMyFd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="พิมพ์เอกสาร FD เป็น PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>พิมพ์ PDF</span>
            </button>
          </div>
        </div>

        {/* Card 2: JD ตำแหน่งของฉัน (ผบ.) */}
        <div 
          onClick={() => setSelectedJd(myJd)}
          className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all p-6 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              JOB DESCRIPTION
            </div>
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              JD ตำแหน่งของฉัน
            </h2>
            <div className="text-xs text-slate-500 mt-1 line-clamp-1">
              {myJd.positionTitle} • {myJd.jobLevelTitle}
            </div>

            {/* Purpose Preview */}
            <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-1">วัตถุประสงค์ของตำแหน่งงาน:</div>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {myJd.positionObjective}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 group-hover:underline inline-flex items-center gap-1">
              <span>คลิกเพื่อขยายดูรายละเอียด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <button
              onClick={handlePrintMyJd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="พิมพ์เอกสาร JD เป็น PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>พิมพ์ PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals for My FD and My JD */}
      <FdDetailModal
        fd={selectedFd}
        isOpen={!!selectedFd}
        onClose={() => setSelectedFd(null)}
      />

      <JdDetailModal
        jd={selectedJd}
        isOpen={!!selectedJd}
        onClose={() => setSelectedJd(null)}
      />
    </div>
  );
};
