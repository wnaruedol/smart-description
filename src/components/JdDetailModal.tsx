import React from 'react';
import { JobDescription } from '../types';
import { X, Printer, Download, UserCheck, CheckCircle2, Calendar, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { generateJdDocumentHtml, printDocument } from '../utils/exportUtils';

interface JdDetailModalProps {
  jd: JobDescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JdDetailModal: React.FC<JdDetailModalProps> = ({ jd, isOpen, onClose }) => {
  if (!isOpen || !jd) return null;

  const handlePrint = () => {
    printDocument(generateJdDocumentHtml(jd), `JD_${jd.unitCode}_${jd.shortCode}`);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>JD - ${jd.positionTitle}</title>
      </head>
      <body>
        ${generateJdDocumentHtml(jd)}
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JD_${jd.unitCode}_${jd.shortCode}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-700 tracking-wide">
                JOB DESCRIPTION (JD)
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                คำบรรยายลักษณะงาน (ตำแหน่งบังคับบัญชา)
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
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
          {/* Metadata Banner with exact required fields */}
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/70 pb-4 mb-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">ชื่อตำแหน่ง</span>
                <h1 className="text-xl font-bold text-slate-900 mt-0.5">{jd.positionTitle}</h1>
                <div className="text-xs text-indigo-700 font-medium mt-1">
                  {jd.orgPath}
                </div>
              </div>
            </div>

            {/* Official Order details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">รหัสหน่วยงาน:</span>
                <span className="font-semibold text-slate-800 font-mono text-sm">{jd.unitCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block">เลขที่คำสั่ง กฟผ.:</span>
                <span className="font-semibold text-slate-800 text-sm">{jd.orderNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block">มีผลบังคับใช้:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 text-sm">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {jd.effectiveDate}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">สถานะเอกสาร:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {jd.status}
                </span>
              </div>
            </div>
          </div>

          {/* ส่วนที่ 1 ข้อมูลทั่วไปของตำแหน่งงาน */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>ส่วนที่ 1 ข้อมูลทั่วไปของตำแหน่งงาน</span>
              <span className="text-xs font-normal text-slate-500">รหัส: {jd.positionCode}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">ชื่อตำแหน่งงาน</span>
                <span className="font-medium text-slate-900">{jd.positionTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">สายงาน / ผู้ช่วยผู้ว่าการ / ฝ่าย</span>
                <span className="font-medium text-slate-900">{jd.departmentLine}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">ระดับงาน</span>
                <span className="font-medium text-slate-900 inline-flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-semibold text-slate-800">
                    {jd.jobLevelTitle}
                  </span>
                  <span className="text-xs text-slate-500">(ระดับ {jd.levelNumber})</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">ผู้บังคับบัญชาโดยตรง</span>
                <span className="font-medium text-slate-900">{jd.directSupervisor}</span>
              </div>
              <div className="md:col-span-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200/70">
                <span className="text-slate-700 block text-xs font-semibold mb-1">
                  ตำแหน่งงานภายใต้การบังคับบัญชาโดยตรง ({jd.directSubordinates.length} ตำแหน่ง)
                </span>
                {jd.directSubordinates.length > 0 ? (
                  <ul className="space-y-1 pl-4 text-xs text-slate-700 list-disc">
                    {jd.directSubordinates.map((sub, idx) => (
                      <li key={idx} className="font-medium">{sub}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-slate-500">ไม่มีตำแหน่งภายใต้การบังคับบัญชาโดยตรง</span>
                )}
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2 วัตถุประสงค์ของตำแหน่งงาน */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
              ส่วนที่ 2 วัตถุประสงค์ของตำแหน่งงาน (Position Purpose)
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm text-justify bg-indigo-50/20 p-4 rounded-lg border border-indigo-100/50 indent-6">
              {jd.positionObjective}
            </p>
          </div>

          {/* ส่วนที่ 3 หน้าที่ความรับผิดชอบ (ตาราง 3 คอลัมน์) */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                ส่วนที่ 3 หน้าที่ความรับผิดชอบและผลลัพธ์ที่คาดหวัง
              </h3>
              <span className="text-xs text-slate-500 font-medium">ตาราง 3 คอลัมน์มาตรฐาน</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3 w-1/4">หัวข้องาน</th>
                    <th scope="col" className="px-4 py-3 w-5/12">หน้าที่ความรับผิดชอบ</th>
                    <th scope="col" className="px-4 py-3 w-1/3">ผลลัพธ์ที่คาดหวัง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {jd.duties.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors align-top">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.taskGroup}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <ul className="space-y-1.5 pl-4 list-disc marker:text-indigo-500 leading-relaxed">
                          {item.responsibilities.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <ul className="space-y-1.5 pl-4 list-disc marker:text-emerald-500 leading-relaxed">
                          {item.expectedOutcomes.map((o, oIdx) => (
                            <li key={oIdx}>{o}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ส่วนที่ 4 คุณสมบัติเฉพาะตำแหน่ง (กรอบสี่เหลี่ยม 4 รายการ) */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
              ส่วนที่ 4 คุณสมบัติเฉพาะตำแหน่ง (Job Specifications)
            </h3>
            
            {/* Box container for 4 items as requested */}
            <div className="border-2 border-slate-300 rounded-lg p-5 bg-slate-50/40 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    1. คุณสมบัติพื้นฐาน
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed pl-3.5">
                    {jd.qualifications.basicQualifications}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    2. ระดับการศึกษา
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed pl-3.5">
                    {jd.qualifications.educationLevel}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    3. คุณวุฒิ / สาขาวิชา
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed pl-3.5">
                    {jd.qualifications.fieldsOfStudy}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    4. ประสบการณ์ทำงาน
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed pl-3.5">
                    {jd.qualifications.workExperience}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>เชื่อมโยงตำแหน่งกับข้อมูลองค์การ (SAP) แบบเรียลไทม์</span>
          </div>
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
