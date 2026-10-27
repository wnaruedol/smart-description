import React, { useState } from 'react';
import { ORG_CHART_TREE } from '../data/mockData';
import { GitFork, ChevronDown, ChevronRight, User, Shield, Layers, Building, Info } from 'lucide-react';

interface OrgNode {
  id: string;
  name: string;
  code: string;
  shortName: string;
  level: number;
  levelTitle: string;
  headName: string;
  assistantHeadName?: string;
  children?: OrgNode[];
}

export const OrgChartView: React.FC = () => {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getLevelColor = (level: number) => {
    if (level === 14) return 'bg-amber-600 text-white border-amber-700';
    if (level === 13) return 'bg-blue-700 text-white border-blue-800';
    if (level === 12) return 'bg-indigo-700 text-white border-indigo-800';
    if (level === 10) return 'bg-teal-700 text-white border-teal-800';
    return 'bg-slate-700 text-white border-slate-800';
  };

  const renderNode = (node: OrgNode, depth = 0) => {
    const isCollapsed = !!collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="relative pl-6 my-2">
        {/* Branch line */}
        {depth > 0 && (
          <div className="absolute left-0 top-6 w-5 h-px bg-slate-300" />
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow max-w-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {hasChildren ? (
                <button
                  onClick={() => toggleNode(node.id)}
                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 mt-0.5 transition-colors cursor-pointer"
                  title={isCollapsed ? 'ขยาย' : 'ยุบ'}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <span className="w-6 h-6 flex items-center justify-center text-slate-400 mt-0.5">
                  •
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{node.name}</span>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200">
                    {node.shortName}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getLevelColor(node.level)}`}>
                    ระดับ {node.level}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>รหัส SAP: <strong className="font-mono text-slate-700">{node.code}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    ผู้บังคับบัญชา: {node.headName}
                  </span>
                </div>

                {node.assistantHeadName && (
                  <div className="text-xs text-slate-500 mt-1 pl-4 border-l-2 border-slate-200">
                    ผู้ช่วย: {node.assistantHeadName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && !isCollapsed && (
          <div className="border-l-2 border-slate-200 ml-2.5">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
            แผนภูมิโครงสร้าง
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            แผนภูมิโครงสายการบังคับบัญชา
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            แสดงสายการบังคับบัญชาตั้งแต่ระดับรองผู้ว่าการ ผู้ช่วยผู้ว่าการ ผู้อำนวยการฝ่าย หัวหน้ากอง จนถึงหัวหน้าแผนก
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>หมายเหตุ: บางหน่วยงานอาจขึ้นตรงข้ามระดับ เช่น ฝ่ายขึ้นตรงกับสายรอง</span>
        </div>
      </div>

      {/* Interactive Hierarchical Tree */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 text-xs text-slate-500">
          <span>คลิกที่ปุ่มลูกศรเพื่อยุบหรือขยายสายการบังคับบัญชา</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> ระดับ 14
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700 ml-2" /> ระดับ 13
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-700 ml-2" /> ระดับ 12
            <span className="w-2.5 h-2.5 rounded-full bg-teal-700 ml-2" /> ระดับ 10
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 ml-2" /> ระดับ 8
          </div>
        </div>

        <div className="overflow-x-auto">
          {renderNode(ORG_CHART_TREE)}
        </div>
      </div>
    </div>
  );
};
