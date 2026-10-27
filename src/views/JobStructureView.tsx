import React from 'react';
import { Layers, ShieldCheck, UserCheck, Users, Award, CheckCircle2 } from 'lucide-react';

export const JobStructureView: React.FC = () => {
  const levels = [
    {
      level: 14,
      title: 'รองผู้ว่าการ',
      rule: 'ระดับ 14',
      type: 'ตำแหน่งบังคับบัญชาระดับสูง (Supervisory)',
      description: 'ผู้บริหารระดับสูงระดับสายงาน กำกับดูแลสายงานผู้ช่วยผู้ว่าการ รายงานตรงต่อผู้ว่าการ กฟผ.',
      color: 'bg-amber-500 text-white'
    },
    {
      level: 13,
      title: 'ผู้ช่วยผู้ว่าการ',
      rule: 'ระดับ 13',
      type: 'ตำแหน่งบังคับบัญชาระดับสูง (Supervisory)',
      description: 'ผู้บริหารระดับสายงานผู้ช่วย กำกับดูแลฝ่ายต่าง ๆ ภายใต้สายงานรองผู้ว่าการ',
      color: 'bg-blue-600 text-white'
    },
    {
      level: 12,
      title: 'ผู้อำนวยการฝ่าย',
      rule: 'ระดับ 12',
      type: 'ตำแหน่งบังคับบัญชา (Supervisory)',
      description: 'ผู้บริหารสูงสุดของหน่วยงานระดับฝ่าย ควบคุมและสั่งการการดำเนินงานของกองในสังกัด',
      color: 'bg-indigo-600 text-white'
    },
    {
      level: 11,
      title: 'ผู้ช่วยผู้อำนวยการฝ่าย',
      rule: 'ระดับ 11',
      type: 'ตำแหน่งบังคับบัญชา (Supervisory)',
      description: 'ช่วยผู้อำนวยการฝ่ายในการกำกับและสั่งการหน่วยงานระดับกอง',
      color: 'bg-indigo-500 text-white'
    },
    {
      level: 10,
      title: 'หัวหน้ากอง',
      rule: 'ระดับ 10 หรือรักษาการระดับ 9',
      type: 'ตำแหน่งบังคับบัญชา (Supervisory)',
      description: 'ผู้บังคับบัญชาหน่วยงานระดับกอง กำกับดูแลหัวหน้าแผนกในสังกัด',
      color: 'bg-teal-600 text-white'
    },
    {
      level: 9,
      title: 'รักษาการหัวหน้ากอง',
      rule: 'ระดับ 9 (รักษาการ)',
      type: 'ตำแหน่งบังคับบัญชา (รักษาการ)',
      description: 'พนักงานระดับ 9 ที่ได้รับมอบหมายให้ปฏิบัติหน้าที่รักษาการในตำแหน่งหัวหน้ากอง',
      color: 'bg-teal-500 text-white'
    },
    {
      level: 8,
      title: 'หัวหน้าแผนก',
      rule: 'ระดับ 8 หรือรักษาการระดับ 7',
      type: 'ตำแหน่งบังคับบัญชา (Supervisory)',
      description: 'ผู้บังคับบัญชาหน่วยงานระดับแผนก สั่งการพนักงานวิชาชีพและปฏิบัติการในแผนก',
      color: 'bg-slate-700 text-white'
    },
    {
      level: 7,
      title: 'รักษาการหัวหน้าแผนก / พนักงานชำนาญการพิเศษ',
      rule: 'ระดับ 7 (รักษาการ หรือ วิชาชีพ)',
      type: 'ตำแหน่งบังคับบัญชา (รักษาการ) หรือ ตำแหน่งวิชาชีพ',
      description: 'ปฏิบัติหน้าที่รักษาการหัวหน้าแผนก หรือผู้เชี่ยวชาญ/วิศวกร/นักวิชาการระดับชำนาญการพิเศษ',
      color: 'bg-slate-600 text-white'
    },
    {
      level: '4 - 6',
      title: 'พนักงานระดับวิชาชีพ / ชำนาญการ',
      rule: 'ตำแหน่งที่ไม่บังคับบัญชา',
      type: 'ตำแหน่งวิชาชีพ (Professional / General)',
      description: 'วิศวกร, นักทรัพยากรบุคคล, นักพัฒนาระบบ, เจ้าหน้าที่บัญชี, นิติกร ฯลฯ',
      color: 'bg-slate-400 text-white'
    },
    {
      level: '1 - 3',
      title: 'พนักงานระดับปฏิบัติการและสนับสนุน',
      rule: 'ตำแหน่งที่ไม่บังคับบัญชา',
      type: 'ตำแหน่งทั่วไป (Operational / Support)',
      description: 'ช่างเทคนิค, เจ้าหน้าที่ธุรการ, พนักงานขับรถ, พนักงานสนับสนุนทั่วไป',
      color: 'bg-slate-300 text-slate-800'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
            โครงสร้างสายอาชีพ
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            โครงสร้างตำแหน่งงานและระดับพนักงาน (ระดับ 1 - 14)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            เกณฑ์และมาตรฐานการกำหนดระดับตำแหน่งงานบังคับบัญชาและตำแหน่งวิชาชีพตามระเบียบ กฟผ.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>ระดับ 12 ขึ้นไป มีตำแหน่งผู้บังคับบัญชาทั้งหมด</span>
        </div>
      </div>

      {/* Level Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
              <tr>
                <th scope="col" className="px-5 py-4 w-28 text-center">ระดับงาน</th>
                <th scope="col" className="px-5 py-4">ชื่อตำแหน่งงานหลัก</th>
                <th scope="col" className="px-5 py-4">เกณฑ์การกำหนดระดับ (Rule)</th>
                <th scope="col" className="px-5 py-4">ประเภทตำแหน่ง</th>
                <th scope="col" className="px-5 py-4">ลักษณะหน้าที่ความรับผิดชอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {levels.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md font-mono font-bold text-xs ${item.color}`}>
                      ระดับ {item.level}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                    {item.title}
                  </td>
                  <td className="px-5 py-4 font-semibold text-blue-700">
                    {item.rule}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.type}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 leading-relaxed max-w-md">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
