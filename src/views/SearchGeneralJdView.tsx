import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobDescription } from '../types';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Printer, 
  Eye, 
  Users2, 
  CheckSquare, 
  Square, 
  Archive, 
  Briefcase 
} from 'lucide-react';
import { JdDetailModal } from '../components/JdDetailModal';
import { generateJdDocumentHtml, printDocument, downloadJdsAsZip } from '../utils/exportUtils';

export const SearchGeneralJdView: React.FC = () => {
  const { jdList } = useAuth();

  // General JDs
  const generalJds = useMemo(() => {
    return jdList.filter(j => !j.isSupervisory || j.targetCategory === 'general');
  }, [jdList]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalJd, setModalJd] = useState<JobDescription | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const filteredJds = useMemo(() => {
    return generalJds.filter(jd => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q ||
        jd.positionTitle.toLowerCase().includes(q) ||
        jd.shortCode.toLowerCase().includes(q) ||
        jd.unitName.toLowerCase().includes(q) ||
        jd.positionCode.toLowerCase().includes(q);

      const matchLevel = !selectedLevel || String(jd.levelNumber) === selectedLevel;
      return matchSearch && matchLevel;
    });
  }, [generalJds, searchTerm, selectedLevel]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredJds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJds.map(j => j.id));
    }
  };

  const handleDownloadSelectedZip = async () => {
    const selected = generalJds.filter(j => selectedIds.includes(j.id));
    if (selected.length === 0) return;

    try {
      setIsExportingZip(true);
      await downloadJdsAsZip(selected, `JD_General_Export_${selected.length}_items.zip`);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
            ค้นหาคำบรรยายลักษณะงาน (ระยะที่ 2)
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            ค้นหา JD วิชาชีพ / ทั่วไป (ตำแหน่งไม่บังคับบัญชา)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            สืบค้นข้อมูลลักษณะงานสำหรับพนักงานระดับปฏิบัติการ วิชาชีพ และชำนาญการ (ระดับ 1 - 8)
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleDownloadSelectedZip}
            disabled={isExportingZip}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <Archive className="w-4 h-4" />
            <span>
              {isExportingZip ? 'กำลังสร้าง ZIP...' : `ดาวน์โหลด ZIP (${selectedIds.length})`}
            </span>
          </button>
        )}
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด้วยชื่อตำแหน่ง เช่น วิศวกร, นักทรัพยากรบุคคล, นักพัฒนาระบบ..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="">ทุกระดับงาน (ระดับ 1-8)</option>
              <option value="6">ระดับ 6 (พนักงานชำนาญการ)</option>
              <option value="5">ระดับ 5 (พนักงานวิชาชีพ)</option>
              <option value="4">ระดับ 4 (พนักงานระดับต้น)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>พบ {filteredJds.length} ตำแหน่งงานวิชาชีพ/ทั่วไป</span>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรอง</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={handleSelectAll}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            {selectedIds.length === filteredJds.length && filteredJds.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>เลือกทั้งหมด ({filteredJds.length})</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredJds.map((jd) => (
            <div key={jd.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(jd.id)}
                  onChange={() => handleToggleSelect(jd.id)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 mt-1 cursor-pointer"
                />
                {/*<div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm md:text-base">{jd.positionTitle}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-sm">
                      {jd.jobLevelTitle}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{jd.orgPath}</div>
                  <div className="text-xs text-slate-600 line-clamp-1 mt-1">
                    <span className="font-semibold">วัตถุประสงค์: </span>{jd.positionObjective}
                  </div>
                </div>*/}
              </div>

              <div className="flex items-center gap-2 shrink-0 pl-7 md:pl-0">
                <button
                  onClick={() => setModalJd(jd)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>เปิดดู JD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <JdDetailModal
        jd={modalJd}
        isOpen={!!modalJd}
        onClose={() => setModalJd(null)}
      />
    </div>
  );
};
