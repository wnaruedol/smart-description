import React, { useState } from 'react';
import { FunctionalDescription } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  FileText,
  LayoutTemplate,
  Check
} from 'lucide-react';
import { generateFdDocumentHtml, printDocument } from '../utils/exportUtils';

interface FdDetailModalProps {
  fd: FunctionalDescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FdDetailModal: React.FC<FdDetailModalProps> = ({ fd, isOpen, onClose }) => {
  // Option: Include Job Purpose box in FD
  const [includeObjective, setIncludeObjective] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'document' | 'detail'>('document');

  if (!isOpen || !fd) return null;

  const isExecutive = fd.levelType === 'deputy' || 
                      fd.levelType === 'assistant' || 
                      fd.name.includes('ผู้ช่วยผู้ว่าการ') || 
                      fd.name.includes('รองผู้ว่าการ');

  const handlePrint = () => {
    const html = generateFdDocumentHtml(fd, { includeObjective });
    printDocument(html, `FD_${fd.code}_${fd.shortName}`, 'landscape');
  };

  const handleDownloadHtml = () => {
    const docHtml = generateFdDocumentHtml(fd, { includeObjective });
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>FD - ${fd.name} (${fd.shortName})</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 10mm 12mm; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { 
            font-family: 'Sarabun', sans-serif; 
            margin: 0; 
            padding: 24px 0; 
            background: #f1f5f9; 
          }
          @media print {
            body { background: #fff; padding: 0; }
            .fd-page {
              border: none !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              max-width: 100% !important;
            }
          }
        </style>
      </head>
      <body>
        ${docHtml}
      </body>
      </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FD_${fd.code}_${fd.shortName}_Landscape.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-2xs ${
              isExecutive ? 'bg-sky-100 text-[#0681BF]' : 'bg-blue-100 text-blue-700'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                เอกสารหน้าที่ความรับผิดชอบของหน่วยงาน (FD)
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{fd.name}</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-md border ${
                  isExecutive 
                    ? 'bg-sky-50 text-[#0681BF] border-sky-300 font-bold' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {fd.shortName}
                </span>
                {isExecutive && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#0681BF]/10 text-[#0681BF] border border-[#0681BF]/20">
                    {fd.levelType === 'deputy' ? 'สายงานรองผู้ว่าการ' : 'ผู้ช่วยผู้ว่าการ'}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            <div className="hidden sm:flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold mr-2">
              <button
                onClick={() => setActiveTab('document')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'document'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>ตัวอย่างเอกสารทางการ (แนวนอน)</span>
              </button>
              <button
                onClick={() => setActiveTab('detail')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'detail'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ข้อมูลหน่วยงาน</span>
              </button>
            </div>

            {/* Print / PDF Button */}
            {/*<button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title="พิมพ์เอกสาร หรือบันทึกเป็น PDF แนวนอน"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>พิมพ์ / PDF</span>
            </button>*/}

            {/* Download HTML Button */}
            <button
              onClick={handleDownloadHtml}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs cursor-pointer ${
                isExecutive ? 'bg-[#0681BF] hover:bg-[#056d9f]' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title="ดาวน์โหลดไฟล์เอกสาร HTML แนวนอน"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors ml-1 cursor-pointer"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Bar for Landscape FD */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">รูปแบบเอกสาร:</span>
            <div className="inline-flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setIncludeObjective(false)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  !includeObjective 
                    ? (isExecutive ? 'bg-[#0681BF] text-white font-bold shadow-xs' : 'bg-amber-500 text-white font-bold shadow-xs')
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. เฉพาะความรับผิดชอบหลัก (มาตรฐาน)
              </button>
              <button
                type="button"
                onClick={() => setIncludeObjective(true)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  includeObjective 
                    ? (isExecutive ? 'bg-[#0681BF] text-white font-bold shadow-xs' : 'bg-amber-500 text-white font-bold shadow-xs')
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. รวมกรอบวัตถุประสงค์หน่วยงาน (Job Purpose)
              </button>
            </div>
          </div>

          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isExecutive ? 'bg-[#0681BF]' : 'bg-amber-500'}`} />
            <span>
              {isExecutive 
                ? 'ระดับผู้บริหาร (ผู้ช่วยผู้ว่าการ / รองผู้ว่าการ): หัวข้อสีน้ำเงิน #0681BF' 
                : 'ระดับฝ่าย / กอง / แผนก: หัวข้อสีเหลืองทอง #EAA414'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          {activeTab === 'document' ? (
            <div className="flex justify-center">
              <div 
                className="w-full max-w-[1060px] bg-white rounded-lg shadow-lg border border-slate-300 overflow-hidden"
                dangerouslySetInnerHTML={{ 
                  __html: generateFdDocumentHtml(fd, { includeObjective }) 
                }}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
              {/* Document Banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 font-medium">โครงสร้างสายการบังคับบัญชา</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{fd.orgPath}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">รหัส SAP: <span className="font-mono text-blue-700">{fd.code}</span></span>
                    <span>•</span>
                    <span>เลขที่คำสั่ง: {fd.orderNo}</span>
                    <span>•</span>
                    <span>มีผลบังคับใช้: {fd.effectiveDate}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    สถานะ: {fd.status}
                  </span>
                </div>
              </div>

              {/* Section: Full Name */}
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">ชื่อหน่วยงานเต็ม</div>
                <div className="text-2xl font-bold text-slate-900">{fd.name}</div>
              </div>

              {/* Section 1: Objective (Paragraph) */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-1.5 h-5 ${isExecutive ? 'bg-[#0681BF]' : 'bg-amber-500'} rounded-full`} />
                  <h3 className="text-base font-bold text-slate-900">วัตถุประสงค์ของหน่วยงาน</h3>
                </div>
                <p className={`text-slate-700 leading-relaxed text-sm md:text-base text-justify p-4 rounded-lg border indent-6 ${
                  isExecutive 
                    ? 'bg-sky-50/50 border-sky-200/60' 
                    : 'bg-amber-50/30 border-amber-200/50'
                }`}>
                  {fd.objective}
                </p>
              </div>

              {/* Section 2: Key Accountabilities (Bullets) */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-5 ${isExecutive ? 'bg-[#0681BF]' : 'bg-amber-500'} rounded-full`} />
                    <h3 className="text-base font-bold text-slate-900">
                      หน้าที่และความรับผิดชอบหลัก ({fd.responsibilities.length} ข้อ)
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {fd.responsibilities.map((item, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-lg bg-white border transition-colors ${
                      isExecutive ? 'border-slate-200 hover:border-sky-300' : 'border-slate-200 hover:border-amber-300'
                    }`}>
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                        isExecutive ? 'bg-sky-100 text-[#0681BF]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="text-sm text-slate-800 leading-relaxed">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            <span>รหัส SAP: <strong className="text-slate-700 font-mono">{fd.code}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
