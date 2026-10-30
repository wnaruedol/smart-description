import JSZip from 'jszip';
import { FunctionalDescription, JobDescription } from '../types';

// Official EGAT Emblem SVG
export const EGAT_LOGO_SVG = `
  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
    <circle cx="50" cy="50" r="46" stroke="#d97706" stroke-width="3" fill="#fffdfa"/>
    <circle cx="50" cy="50" r="41" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
    <path d="M50 8 C53 18 61 22 66 25 C62 30 57 32 50 32 C43 32 38 30 34 25 C39 22 47 18 50 8Z" fill="#d97706"/>
    <path d="M53 20 L37 48 L48 48 L42 74 L63 42 L51 42 L58 20 Z" fill="#d97706" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M24 68 Q37 62 50 68 T76 68" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M28 75 Q39 70 50 75 T72 75" stroke="#1d4ed8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <text x="50" y="88" text-anchor="middle" font-size="8.5" font-family="'Sarabun', sans-serif" font-weight="700" fill="#0f172a">กฟผ.</text>
  </svg>
`;

// Helper: Determine reporting line abbreviation (สังกัด อทบ. ชฟพ. รวห.)
export const getFdAffiliation = (fd: FunctionalDescription, customAffiliation?: string): string => {
  if (customAffiliation) return customAffiliation;
  if (fd.affiliationText) return fd.affiliationText;

  // EGAT official short acronym mapping
  const acronyms: Record<string, string> = {
    'สายงานรองผู้ว่าการบริหาร': 'รวห.',
    'รองผู้ว่าการบริหาร': 'รวห.',
    'รองผู้ว่าการยุทธศาสตร์': 'รวย.',
    'รองผู้ว่าการระบบส่ง': 'รวส.',
    'รองผู้ว่าการผลิตไฟฟ้า': 'รวฟ.',
    'รองผู้ว่าการเชื้อเพลิง': 'รวช.',
    'รองผู้ว่าการพัฒนาโรงไฟฟ้าและพลังงานหมุนเวียน': 'รวพ.',
    'ผู้ช่วยผู้ว่าการพัฒนาองค์การ': 'ชฟพ.',
    'ผู้ช่วยผู้ว่าการเทคโนโลยี': 'ชหท.',
    'ผู้ช่วยผู้ว่าการกฎหมาย': 'ชหก.',
    'ผู้ช่วยผู้ว่าการจัดซื้อจัดจ้าง': 'ชหจ.',
    'ฝ่ายทรัพยากรบุคคลและพัฒนาองค์การ': 'อทบ.',
    'ฝ่ายเทคโนโลยีดิจิทัลและระบบสารสนเทศ': 'อดส.',
    'ฝ่ายยุทธศาสตร์องค์การ': 'อยอ.',
    'กองกลยุทธ์และพัฒนาองค์การ': 'กกพ-ห.',
    'กองบริหารงานบุคคล': 'กบส-ห.',
    'กองบริหารผลการปฏิบัติงานและความก้าวหน้าในสายอาชีพ': 'กบป-ห.',
    'แผนกโครงสร้างองค์การ': 'หคอ-ห.',
    'แผนกพัฒนาระบบและกระบวนการทำงาน': 'หพร-ห.',
    'แผนกงานบุคคลผู้บริหารระดับสูง': 'หบหส-ห.',
    'แผนกความก้าวหน้าในสายอาชีพและตำแหน่งงาน': 'หคต-ห.',
  };

  const parts: string[] = [];

  if (fd.levelType === 'section') {
    if (fd.divisionName && acronyms[fd.divisionName]) parts.push(acronyms[fd.divisionName]);
    if (fd.departmentName && acronyms[fd.departmentName]) parts.push(acronyms[fd.departmentName]);
    else parts.push('อทบ.');
    if (fd.assistantName && acronyms[fd.assistantName]) parts.push(acronyms[fd.assistantName]);
    else parts.push('ชฟพ.');
    if (fd.deputyName && acronyms[fd.deputyName]) parts.push(acronyms[fd.deputyName]);
    else parts.push('รวห.');
  } else if (fd.levelType === 'division') {
    if (fd.departmentName && acronyms[fd.departmentName]) parts.push(acronyms[fd.departmentName]);
    else parts.push('อทบ.');
    if (fd.assistantName && acronyms[fd.assistantName]) parts.push(acronyms[fd.assistantName]);
    else parts.push('ชฟพ.');
    if (fd.deputyName && acronyms[fd.deputyName]) parts.push(acronyms[fd.deputyName]);
    else parts.push('รวห.');
  } else if (fd.levelType === 'department') {
    if (fd.assistantName && acronyms[fd.assistantName]) parts.push(acronyms[fd.assistantName]);
    else parts.push('ชฟพ.');
    if (fd.deputyName && acronyms[fd.deputyName]) parts.push(acronyms[fd.deputyName]);
    else parts.push('รวห.');
  } else if (fd.levelType === 'assistant') {
    if (fd.deputyName && acronyms[fd.deputyName]) parts.push(acronyms[fd.deputyName]);
    else parts.push('รวห.');
  } else {
    parts.push('กฟผ.');
  }

  // Remove duplicates while preserving order
  const unique = parts.filter((val, i, arr) => arr.indexOf(val) === i);
  return `สังกัด ${unique.join(' ')}`;
};

// Helper: Determine Title Line 2 (e.g. "1. กองกลยุทธ์และพัฒนาองค์การ" or "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์การ")
export const getFdDisplayTitle = (fd: FunctionalDescription, customSeq?: string): string => {
  if (customSeq !== undefined) {
    return customSeq ? `${customSeq} ${fd.name}` : fd.name;
  }
  if (fd.unitSequenceNumber) {
    return `${fd.unitSequenceNumber} ${fd.name}`;
  }
  if (fd.shortName === 'กกพ-ห.') return `1. ${fd.name}`;
  if (fd.shortName === 'กบส-ห.') return `2. ${fd.name}`;
  if (fd.shortName === 'กบป-ห.') return `3. ${fd.name}`;
  if (fd.shortName === 'หคอ-ห.') return `1. ${fd.name}`;
  if (fd.shortName === 'หพร-ห.') return `2. ${fd.name}`;
  return fd.name;
};

export interface GenerateFdOptions {
  includeObjective?: boolean;
  sequenceNumber?: string;
  affiliationText?: string;
}

export const generateFdDocumentHtml = (
  fd: FunctionalDescription, 
  options?: GenerateFdOptions
): string => {
  const affiliation = getFdAffiliation(fd, options?.affiliationText);
  const displayTitle = getFdDisplayTitle(fd, options?.sequenceNumber);
  
  // Check if we should include Job Purpose
  const showPurpose = options?.includeObjective !== undefined
    ? options.includeObjective && Boolean(fd.objective && fd.objective.trim())
    : false; // default standard layout is pure Functional Roles unless explicitly requested

  // Check if unit is Assistant Governor (ผู้ช่วยผู้ว่าการ) or Deputy Governor (รองผู้ว่าการ)
  const isExecutive = fd.levelType === 'deputy' || 
                      fd.levelType === 'assistant' || 
                      fd.name.includes('ผู้ช่วยผู้ว่าการ') || 
                      fd.name.includes('รองผู้ว่าการ');
  const headerBgColor = isExecutive ? '#0681BF' : '#EAA414';
  const headerTextColor = isExecutive ? '#ffffff' : '#000000';

  return `
    <div class="fd-document-wrapper" style="font-family: 'Sarabun', sans-serif; color: #000; line-height: 1.5; background: #ffffff;">
      <div class="fd-page" style="position: relative; width: 100%; max-width: 1060px; min-height: 640px; margin: 0 auto; padding: 30px 42px 28px 42px; box-sizing: border-box; background: #ffffff; border: 1px solid #cbd5e1; box-shadow: 0 4px 14px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;">
        
        <!-- ลายน้ำกำกับเอกสาร (Watermark) วางพาดในแนวทแยงมุมจากมุมล่างซ้ายขึ้นไปทางขวาบน ซ้อนอยู่ด้านหลังข้อความเนื้อหา -->
        <div style="position: absolute; top: 52%; left: 50%; transform: translate(-50%, -50%) rotate(-23deg); font-size: 32px; font-weight: 700; color: rgba(148, 163, 184, 0.17); white-space: nowrap; pointer-events: none; z-index: 0; user-select: none; letter-spacing: 2px;">
          เป็นเอกสารที่ใช้เพื่อการปฏิบัติงานภายใน กฟผ. เท่านั้น
        </div>

        <!-- เนื้อหาเอกสาร (Content Layer) -->
        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; width: 100%;">
          
          <!-- ส่วนหัวเอกสาร (Header Row) -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px;">
            <!-- ส่วนหัวเอกสารฝั่งซ้าย (Top Left Header & Title): โลโก้ กฟผ. + หัวข้อเอกสาร 2 บรรทัด -->
            <div style="display: flex; align-items: center; gap: 16px;">
              <div>
                ${EGAT_LOGO_SVG}
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 700; color: #000000; letter-spacing: 0.2px;">
                  หน้าที่ความรับผิดชอบหน่วยงาน
                </div>
                <div style="font-size: 19px; font-weight: 800; color: #000000; margin-top: 3px; letter-spacing: -0.2px;">
                  ${displayTitle}
                </div>
              </div>
            </div>

            <!-- ส่วนมุมขวาบน (Top Right Header): ตัวอักษรสีน้ำเงินระบุสายการบังคับบัญชาหรือสังกัดย่อ ชิดขอบบนขวา -->
            <div style="text-align: right; font-size: 14px; font-weight: 700; color: #1d4ed8; padding-top: 6px; white-space: nowrap;">
              ${affiliation}
            </div>
          </div>

          ${showPurpose ? `
            <!-- กรณีมีข้อมูล วัตถุประสงค์หน่วยงาน ด้วย: กรอบที่ 1 วัตถุประสงค์หน่วยงาน (Job Purpose) -->
            <div style="border: 1.5px solid #000000; background: #ffffff; margin-bottom: 16px; box-sizing: border-box;">
              <!-- แถบหัวข้อของกรอบ (Header Bar): พื้นหลังสีตามระดับหน่วยงาน ตัวอักษรหนา -->
              <div style="background: ${headerBgColor}; border-bottom: 1.5px solid #000000; padding: 7px 16px; font-size: 13.5px; font-weight: 700; color: ${headerTextColor};">
                วัตถุประสงค์หน่วยงาน (Job Purpose)
              </div>
              <div style="padding: 12px 20px; font-size: 13px; line-height: 1.7; text-indent: 2rem; text-align: justify; color: #000000;">
                ${fd.objective}
              </div>
            </div>

            <!-- กรอบที่ 2 ความรับผิดชอบหลัก (Functional Roles and Responsibilities) -->
            <div style="border: 1.5px solid #000000; background: #ffffff; box-sizing: border-box;">
              <!-- แถบหัวข้อของกรอบ (Header Bar): พื้นหลังสีตามระดับหน่วยงาน ตัวอักษรหนา -->
              <div style="background: ${headerBgColor}; border-bottom: 1.5px solid #000000; padding: 7px 16px; font-size: 13.5px; font-weight: 700; color: ${headerTextColor};">
                ความรับผิดชอบหลัก (Functional Roles and Responsibilities)
              </div>
              <div style="padding: 12px 20px 14px 26px;">
                <ul style="margin: 0; padding-left: 20px; list-style-type: disc; color: #000000; font-size: 13px; line-height: 1.75;">
                  ${fd.responsibilities.map(r => `<li style="margin-bottom: 7px; text-align: justify; padding-left: 4px;">${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          ` : `
            <!-- กรอบเนื้อหาความรับผิดชอบหลัก (Main Content Container): กรอบสี่เหลี่ยมเส้นขอบสีดำขนาดใหญ่เต็มความกว้าง -->
            <div style="border: 1.5px solid #000000; background: #ffffff; box-sizing: border-box;">
              <!-- แถบหัวข้อของกรอบ (Header Bar): พื้นหลังสีตามระดับหน่วยงาน (#0681BF สำหรับผู้ช่วย/รองฯ, #EAA414 สำหรับทั่วไป) -->
              <div style="background: ${headerBgColor}; border-bottom: 1.5px solid #000000; padding: 8px 18px; font-size: 14px; font-weight: 700; color: ${headerTextColor}; letter-spacing: 0.2px;">
                ความรับผิดชอบหลัก (Functional Roles and Responsibilities)
              </div>
              
              <!-- พื้นที่เนื้อหารายการ (Bullet List): พื้นหลังกล่องสีขาว แสดงรายละเอียดหน้าที่ความรับผิดชอบงานในรูปแบบรายการหัวข้อย่อย -->
              <div style="padding: 16px 24px 18px 30px;">
                <ul style="margin: 0; padding-left: 20px; list-style-type: disc; color: #000000; font-size: 13.5px; line-height: 1.85;">
                  ${fd.responsibilities.map(r => `<li style="margin-bottom: 9px; text-align: justify; padding-left: 6px;">${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          `}
        </div>

        <!-- ท้ายกระดาษ (Footer) -->
        <div style="position: relative; z-index: 1; margin-top: 24px; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #475569; border-top: 1px solid #e2e8f0;">
          <div>รหัส SAP: ${fd.code} | คำสั่ง: ${fd.orderNo} | วันที่มีผลบังคับใช้: ${fd.effectiveDate}</div>
          <div style="font-style: italic;">เป็นเอกสารที่ใช้เพื่อการปฏิบัติงานภายใน กฟผ. เท่านั้น</div>
        </div>

      </div>
    </div>
  `;
};

export const generateJdDocumentHtml = (jd: JobDescription): string => {
  // Split duties between Page 1 and Page 2
  const totalDuties = jd.duties.length;
  let page1Duties: typeof jd.duties = [];
  let page2Duties: typeof jd.duties = [];

  if (totalDuties <= 1) {
    page1Duties = jd.duties;
    page2Duties = [];
  } else if (totalDuties === 2) {
    page1Duties = jd.duties.slice(0, 1);
    page2Duties = jd.duties.slice(1);
  } else {
    // 3 or more duties
    const splitIndex = Math.ceil(totalDuties / 2);
    page1Duties = jd.duties.slice(0, splitIndex);
    page2Duties = jd.duties.slice(splitIndex);
  }

  // Official EGAT Emblem SVG
  const egatLogoSvg = `
    <div style="text-align: center; margin-bottom: 4px;">
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
        <circle cx="50" cy="50" r="46" stroke="#d97706" stroke-width="3" fill="#fffdfa"/>
        <circle cx="50" cy="50" r="41" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
        <path d="M50 8 C53 18 61 22 66 25 C62 30 57 32 50 32 C43 32 38 30 34 25 C39 22 47 18 50 8Z" fill="#d97706"/>
        <path d="M53 20 L37 48 L48 48 L42 74 L63 42 L51 42 L58 20 Z" fill="#d97706" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M24 68 Q37 62 50 68 T76 68" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M28 75 Q39 70 50 75 T72 75" stroke="#1d4ed8" stroke-width="2" fill="none" stroke-linecap="round"/>
        <text x="50" y="88" text-anchor="middle" font-size="8.5" font-family="'Sarabun', sans-serif" font-weight="700" fill="#0f172a">กฟผ.</text>
      </svg>
    </div>
  `;

  const subordinatesList = jd.directSubordinates && jd.directSubordinates.length > 0
    ? `<ul style="margin: 3px 0 0 0; padding-left: 18px; line-height: 1.45;">${jd.directSubordinates.map(s => `<li>${s}</li>`).join('')}</ul>`
    : '<span style="color: #64748b;">- ไม่มี -</span>';

  // Render Table 3 columns helper
  const renderDutiesTable = (dutiesList: typeof jd.duties) => `
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 13px; color: #000;">
      <thead>
        <tr style="background: #f8fafc; text-align: center; font-weight: 700;">
          <th style="border: 1px solid #000; padding: 6px 8px; width: 26%;">หัวข้องาน</th>
          <th style="border: 1px solid #000; padding: 6px 8px; width: 44%;">หน้าที่ความรับผิดชอบ</th>
          <th style="border: 1px solid #000; padding: 6px 8px; width: 30%;">ผลลัพธ์ที่คาดหวัง</th>
        </tr>
      </thead>
      <tbody>
        ${dutiesList.length > 0 ? dutiesList.map(duty => `
          <tr style="vertical-align: top;">
            <td style="border: 1px solid #000; padding: 6px 8px; font-weight: 600;">
              ${duty.taskGroup}
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px;">
              <ul style="margin: 0; padding-left: 18px; line-height: 1.5;">
                ${duty.responsibilities.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </td>
            <td style="border: 1px solid #000; padding: 6px 8px;">
              <ul style="margin: 0; padding-left: 18px; line-height: 1.5;">
                ${duty.expectedOutcomes.map(o => `<li>${o}</li>`).join('')}
              </ul>
            </td>
          </tr>
        `).join('') : `
          <tr>
            <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: center; color: #64748b;">(ไม่มีรายการหน้าที่ความรับผิดชอบเพิ่มเติม)</td>
          </tr>
        `}
      </tbody>
    </table>
  `;

  return `
    <div class="jd-document-wrapper" style="font-family: 'Sarabun', sans-serif; color: #000; line-height: 1.5;">
      <!-- ================= หน้าที่ 1 ================= -->
      <div class="jd-page" style="width: 100%; max-width: 800px; min-height: 1050px; margin: 0 auto 30px auto; padding: 36px 40px 24px 40px; box-sizing: border-box; background: #ffffff; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; break-after: page;">
        <div>
          <!-- ส่วนหัวเอกสาร (Header) -->
          <div style="text-align: center; margin-bottom: 16px;">
            ${egatLogoSvg}
            <h1 style="font-size: 17px; font-weight: 700; margin: 6px 0 0 0; color: #000; letter-spacing: 0.3px;">
              คำบรรยายลักษณะงาน (Job Description)
            </h1>
          </div>

          <!-- ส่วนที่ 1: ตารางข้อมูลพื้นฐานของตำแหน่งงาน (กรอบตารางเส้นขอบสีดำ) -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 13px; color: #000; margin-bottom: 14px;">
            <tbody>
              <!-- แถวที่ 1: แสดง "ชื่อตำแหน่งงาน" ผสานเซลล์เต็มความกว้าง -->
              <tr>
                <td colspan="2" style="border: 1px solid #000; padding: 6px 10px; font-size: 13.5px;">
                  <strong style="color: #000;">ชื่อตำแหน่งงาน:</strong> ${jd.positionTitle}
                </td>
              </tr>
              <!-- แถวที่ 2: แบ่ง 2 คอลัมน์ ด้านซ้ายระบุ "สายงาน/ผู้ช่วยผู้ว่าการ/ฝ่าย" และด้านขวาระบุ "ผู้บังคับบัญชาโดยตรง" -->
              <tr>
                <td style="border: 1px solid #000; padding: 6px 10px; width: 50%; vertical-align: top;">
                  <strong>สายงาน/ผู้ช่วยผู้ว่าการ/ฝ่าย:</strong><br />
                  <span style="display: block; margin-top: 2px;">${jd.departmentLine}</span>
                </td>
                <td style="border: 1px solid #000; padding: 6px 10px; width: 50%; vertical-align: top;">
                  <strong>ผู้บังคับบัญชาโดยตรง:</strong><br />
                  <span style="display: block; margin-top: 2px;">${jd.directSupervisor}</span>
                </td>
              </tr>
              <!-- แถวที่ 3: แบ่ง 2 คอลัมน์ ด้านซ้ายระบุ "ระดับงาน (Job band)" และด้านขวาระบุ "ตำแหน่งงานภายใต้การบังคับบัญชาโดยตรง" -->
              <tr>
                <td style="border: 1px solid #000; padding: 6px 10px; width: 50%; vertical-align: top;">
                  <strong>ระดับงาน (Job band):</strong><br />
                  <span style="display: block; margin-top: 2px;">${jd.jobLevelTitle}</span>
                </td>
                <td style="border: 1px solid #000; padding: 6px 10px; width: 50%; vertical-align: top;">
                  <strong>ตำแหน่งงานภายใต้การบังคับบัญชาโดยตรง:</strong>
                  ${subordinatesList}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ส่วนที่ 2: วัตถุประสงค์ของตำแหน่งงาน -->
          <div style="margin-bottom: 14px;">
            <div style="font-size: 13.5px; font-weight: 700; margin-bottom: 6px; color: #000; text-align: left;">
              วัตถุประสงค์ของตำแหน่งงาน
            </div>
            <div style="border: 1px solid #000; padding: 9px 12px; text-indent: 2rem; text-align: justify; font-size: 13px; line-height: 1.65; color: #000;">
              ${jd.positionObjective}
            </div>
          </div>

          <!-- ส่วนที่ 3: ตารางหน้าที่ความรับผิดชอบ (ตอนที่ 1) -->
          <div style="margin-bottom: 14px;">
            <div style="font-size: 13.5px; font-weight: 700; margin-bottom: 6px; color: #000; text-align: left;">
              หน้าที่ความรับผิดชอบ
            </div>
            ${renderDutiesTable(page1Duties)}
          </div>
        </div>

        <!-- ส่วนท้ายกระดาษ (Footer หน้าที่ 1) -->
        <div style="margin-top: 20px; padding-top: 10px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #334155; border-top: 1px solid #cbd5e1;">
          <div style="flex: 1;"></div>
          <div style="flex: 2; text-align: center; font-style: italic;">
            เป็นเอกสารที่ใช้เพื่อการปฏิบัติงานภายใน กฟผ. เท่านั้น
          </div>
          <div style="flex: 1; text-align: right; font-weight: 700;">
            1
          </div>
        </div>
      </div>

      <!-- ================= หน้าที่ 2 ================= -->
      <div class="jd-page" style="width: 100%; max-width: 800px; min-height: 1050px; margin: 0 auto; padding: 36px 40px 24px 40px; box-sizing: border-box; background: #ffffff; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: space-between; page-break-after: avoid; break-after: avoid;">
        <div>
          <!-- ส่วนหัวเอกสาร (Header หน้าที่ 2 แสดงโลโก้ กฟผ. ซ้ำ) -->
          <div style="text-align: center; margin-bottom: 16px;">
            ${egatLogoSvg}
          </div>

          <!-- ส่วนที่ 3: ตารางหน้าที่ความรับผิดชอบ (ตอนที่ 2 / ต่อจากหน้าแรก) -->
          <div style="margin-bottom: 18px;">
            <div style="font-size: 13.5px; font-weight: 700; margin-bottom: 6px; color: #000; text-align: left;">
              หน้าที่ความรับผิดชอบ (ต่อ)
            </div>
            ${renderDutiesTable(page2Duties)}
          </div>

          <!-- ส่วนที่ 4: คุณสมบัติเฉพาะตำแหน่ง (ตารางเส้นขอบสีดำ 4 แถว) -->
          <div style="margin-bottom: 18px;">
            <div style="font-size: 13.5px; font-weight: 700; margin-bottom: 6px; color: #000; text-align: left;">
              คุณสมบัติเฉพาะตำแหน่ง
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 13px; color: #000;">
              <tbody>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; width: 24%; font-weight: 700; vertical-align: top; background: #f8fafc;">
                    คุณสมบัติพื้นฐาน
                  </td>
                  <td style="border: 1px solid #000; padding: 8px 12px; width: 76%; vertical-align: top; line-height: 1.5;">
                    ${jd.qualifications.basicQualifications}
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-weight: 700; vertical-align: top; background: #f8fafc;">
                    ระดับการศึกษา
                  </td>
                  <td style="border: 1px solid #000; padding: 8px 12px; vertical-align: top; line-height: 1.5;">
                    ${jd.qualifications.educationLevel}
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-weight: 700; vertical-align: top; background: #f8fafc;">
                    คุณวุฒิ
                  </td>
                  <td style="border: 1px solid #000; padding: 8px 12px; vertical-align: top; line-height: 1.5;">
                    ${jd.qualifications.fieldsOfStudy}
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 8px 12px; font-weight: 700; vertical-align: top; background: #f8fafc;">
                    ประสบการณ์ทำงาน
                  </td>
                  <td style="border: 1px solid #000; padding: 8px 12px; vertical-align: top; line-height: 1.5;">
                    ${jd.qualifications.workExperience}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ส่วนท้ายกระดาษ (Footer หน้าที่ 2) -->
        <div style="margin-top: 20px; padding-top: 10px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #334155; border-top: 1px solid #cbd5e1;">
          <div style="flex: 1;"></div>
          <div style="flex: 2; text-align: center; font-style: italic;">
            เป็นเอกสารที่ใช้เพื่อการปฏิบัติงานภายใน กฟผ. เท่านั้น
          </div>
          <div style="flex: 1; text-align: right; font-weight: 700;">
            2
          </div>
        </div>
      </div>
    </div>
  `;
};

// Print / PDF action helper
export const printDocument = (
  htmlContent: string, 
  title: string, 
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (printWindow) {
    const isLandscape = orientation === 'landscape';
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="th">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page { 
              size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; 
              margin: ${isLandscape ? '10mm 12mm' : '10mm 14mm'}; 
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { 
              font-family: 'Sarabun', sans-serif; 
              margin: 0; 
              padding: 0; 
              background: #fff; 
            }
            .jd-page { 
              border: none !important; 
              box-shadow: none !important; 
              margin: 0 !important; 
              padding: 0 0 8mm 0 !important; 
              max-width: 100% !important; 
              min-height: 275mm !important; 
              page-break-after: always !important; 
              break-after: page !important;
            }
            .jd-page:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .fd-page {
              border: none !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              max-width: 100% !important;
              min-height: auto !important;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

// Bulk Download ZIP generator using JSZip
export const downloadFdsAsZip = async (
  fds: FunctionalDescription[], 
  zipName = 'FD_Documents.zip',
  options?: GenerateFdOptions
) => {
  const zip = new JSZip();
  const folder = zip.folder('FD_Functional_Descriptions');

  fds.forEach(fd => {
    const fileName = `${fd.code}_${fd.shortName.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}_FD.html`;
    const content = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>FD - ${fd.name} (${fd.shortName})</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 landscape; margin: 10mm 12mm; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 24px 0; background: #f1f5f9; }
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
        ${generateFdDocumentHtml(fd, options)}
      </body>
      </html>
    `;
    folder?.file(fileName, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = zipName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadJdsAsZip = async (jds: JobDescription[], zipName = 'JD_Documents.zip') => {
  const zip = new JSZip();
  const folder = zip.folder('JD_Job_Descriptions');

  jds.forEach(jd => {
    const fileName = `${jd.unitCode}_${jd.shortCode.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}_JD.html`;
    const content = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>JD - ${jd.positionTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 10mm 14mm; }
          body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 24px 0; background: #f1f5f9; }
          @media print {
            body { background: #fff; padding: 0; }
            .jd-page { 
              border: none !important; 
              box-shadow: none !important; 
              margin: 0 !important; 
              padding: 0 0 8mm 0 !important; 
              max-width: 100% !important; 
              min-height: 275mm !important; 
              page-break-after: always !important; 
              break-after: page !important;
            }
            .jd-page:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
          }
        </style>
      </head>
      <body>
        ${generateJdDocumentHtml(jd)}
      </body>
      </html>
    `;
    folder?.file(fileName, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = zipName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
