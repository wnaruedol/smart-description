import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Building2, CheckCircle2, Layers, Shield, Sparkles } from 'lucide-react';

export const UnitCountView: React.FC = () => {
  const { fdList } = useAuth();

  // Tier counts
  const deputyCount = 3; // รองผู้ว่าการบริหาร, บัญชี, ยุทธศาสตร์
  const assistantCount = 8; // ชหท., ชหพ., ชหก., ชหจ., ชหบ., ชหง., ชหย., ชหว.
  const deptCount = fdList.filter(f => f.levelType === 'department').length + 5;
  const divCount = fdList.filter(f => f.levelType === 'division').length + 10;
  const secCount = fdList.filter(f => f.levelType === 'section').length + 25;
  const totalUnits = deputyCount + assistantCount + deptCount + divCount + secCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
            สถิติโครงสร้างองค์การ
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            จำนวนหน่วยงานและโครงสร้างองค์การ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            สรุปข้อมูลสถิติจำนวนหน่วยงานตามโครงสร้างสายการบังคับบัญชาที่เชื่อมโยงกับฐานข้อมูล SAP
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500">จำนวนหน่วยงานรวมทั้งสิ้น</span>
          <div className="text-2xl font-bold font-mono text-blue-700">{totalUnits} หน่วยงาน</div>
        </div>
      </div>

      {/* Grid of Counts by Tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Tier 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-amber-700 uppercase">ระดับ 14</div>
          <div className="text-lg font-bold text-slate-900 mt-1">สายงานรองผู้ว่าการ</div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-3">{deputyCount}</div>
          <div className="text-xs text-slate-500 mt-1">สายงานหลัก กฟผ.</div>
        </div>

        {/* Tier 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-blue-700 uppercase">ระดับ 13</div>
          <div className="text-lg font-bold text-slate-900 mt-1">ผู้ช่วยผู้ว่าการ</div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-3">{assistantCount}</div>
          <div className="text-xs text-slate-500 mt-1">สายผู้ช่วยผู้ว่าการ</div>
        </div>

        {/* Tier 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-indigo-700 uppercase">ระดับ 12</div>
          <div className="text-lg font-bold text-slate-900 mt-1">ฝ่าย (ผู้อำนวยการฝ่าย)</div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-3">{deptCount}</div>
          <div className="text-xs text-slate-500 mt-1">หน่วยงานระดับฝ่าย</div>
        </div>

        {/* Tier 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-teal-700 uppercase">ระดับ 10</div>
          <div className="text-lg font-bold text-slate-900 mt-1">กอง (หัวหน้ากอง)</div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-3">{divCount}</div>
          <div className="text-xs text-slate-500 mt-1">หน่วยงานระดับกอง</div>
        </div>

        {/* Tier 5 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-700 uppercase">ระดับ 8</div>
          <div className="text-lg font-bold text-slate-900 mt-1">แผนก (หัวหน้าแผนก)</div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-3">{secCount}</div>
          <div className="text-xs text-slate-500 mt-1">หน่วยงานระดับแผนก</div>
        </div>
      </div>

      {/* Breakdown by Lines */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          การกระจายตัวของหน่วยงานตาม 3 สายงานหลัก
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>สายงานรองผู้ว่าการบริหาร (รวห.)</span>
              <span className="font-mono">48% (4 ผู้ช่วยฯ / ฝ่าย อหพ., อดส. ฯลฯ)</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '48%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>สายงานรองผู้ว่าการบัญชีและการเงิน (รวบ.)</span>
              <span className="font-mono">26% (2 ผู้ช่วยฯ / ฝ่าย อบป., อภง. ฯลฯ)</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '26%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>สายงานรองผู้ว่าการยุทธศาสตร์ (รวย.)</span>
              <span className="font-mono">26% (2 ผู้ช่วยฯ / ฝ่าย อยอ., อสว. ฯลฯ)</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '26%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
