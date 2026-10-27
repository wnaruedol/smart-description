import React from 'react';
import { FunctionalDescription } from '../types';
import { X, Printer, Download, Building2, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { generateFdDocumentHtml, printDocument } from '../utils/exportUtils';

interface FdDetailModalProps {
  fd: FunctionalDescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FdDetailModal: React.FC<FdDetailModalProps> = ({ fd, isOpen, onClose }) => {
  if (!isOpen || !fd) return null;

  const handlePrint = () => {
    printDocument(generateFdDocumentHtml(fd), `FD_${fd.code}_${fd.shortName}`);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>FD - ${fd.name} (${fd.shortName})</title>
      </head>
      <body>
        ${generateFdDocumentHtml(fd)}
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FD_${fd.code}_${fd.shortName}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-700 tracking-wide">
                FUNCTIONAL DESCRIPTION (FD)
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                หน้าที่ความรับผิดชอบของหน่วยงาน
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              title="พิมพ์ / บันทึกเป็น PDF"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>พิมพ์ PDF</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
              title="ดาวน์โหลดไฟล์เอกสาร"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors ml-2"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Document Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <div className="text-xs text-slate-500 font-medium">โครงสร้างสายการบังคับบัญชา (Org Path)</div>
              <div className="text-sm font-medium text-slate-800 mt-0.5">{fd.orgPath}</div>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">รหัสหน่วยงาน: <span className="font-mono text-blue-700">{fd.code}</span></span>
                <span>•</span>
                <span>เลขที่คำสั่ง: {fd.orderNo}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  มีผลบังคับใช้: {fd.effectiveDate}
                </span>
              </div>
            </div>

            {/* Top Right Unit Short Code */}
            <div className="flex flex-col items-end shrink-0">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                สถานะ: {fd.status}
              </span>
            </div>
          </div>

          {/* Section: Full Name */}
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">ชื่อหน่วยงานเต็ม</div>
            <div className="text-xl font-bold text-slate-900">{fd.name}</div>
          </div>

          {/* Section 1: Objective (Paragraph) */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-bold text-slate-900">วัตถุประสงค์ของหน่วยงาน</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base text-justify bg-blue-50/30 p-4 rounded-lg border border-blue-100/50 indent-6">
              {fd.objective}
            </p>
          </div>

          {/* Section 2: Key Accountabilities (Bullets) */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
                <h3 className="text-base font-bold text-slate-900">หน้าที่และความรับผิดชอบหลัก</h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {fd.responsibilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200/80 hover:border-blue-200 hover:bg-slate-50/50 transition-colors">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-sm text-slate-700 leading-normal">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
