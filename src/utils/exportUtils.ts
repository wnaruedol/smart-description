import JSZip from 'jszip';
import { FunctionalDescription, JobDescription } from '../types';

export const generateFdDocumentHtml = (fd: FunctionalDescription): string => {
  return `
    <div style="font-family: 'Sarabun', sans-serif; padding: 32px; max-width: 800px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <div style="font-size: 13px; font-weight: 600; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
            การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.)
          </div>
          <h1 style="font-size: 20px; font-weight: 700; margin: 4px 0 0; color: #0f172a;">
            คำอธิบายหน้าที่และความรับผิดชอบของหน่วยงาน (Functional Description : FD)
          </h1>
          <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
            ${fd.orgPath}
          </div>
        </div>
        <div style="text-align: right; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 8px 16px;">
          <div style="font-size: 12px; color: #0369a1;">รหัสหน่วยงานย่อ</div>
          <div style="font-size: 18px; font-weight: 700; color: #0284c7;">${fd.shortName}</div>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 13px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div><span style="font-weight: 600; color: #475569;">ชื่อหน่วยงานเต็ม:</span> ${fd.name}</div>
          <div><span style="font-weight: 600; color: #475569;">รหัส SAP:</span> ${fd.code}</div>
          <div><span style="font-weight: 600; color: #475569;">คำสั่ง กฟผ.:</span> ${fd.orderNo}</div>
          <div><span style="font-weight: 600; color: #475569;">มีผลบังคับใช้:</span> ${fd.effectiveDate}</div>
          <div><span style="font-weight: 600; color: #475569;">สถานะ:</span> <span style="color: #16a34a; font-weight: 600;">● ${fd.status}</span></div>
          <div><span style="font-weight: 600; color: #475569;">สายการบังคับบัญชา:</span> ${fd.deputyName}</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 8px; margin-bottom: 12px;">
          1. วัตถุประสงค์ของหน่วยงาน
        </h2>
        <p style="text-indent: 2rem; text-align: justify; margin: 0; color: #334155; line-height: 1.8;">
          ${fd.objective}
        </p>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 8px; margin-bottom: 12px;">
          2. หน้าที่และความรับผิดชอบหลัก (${fd.responsibilities.length} ข้อ)
        </h2>
        <ul style="margin: 0; padding-left: 24px; color: #334155; line-height: 1.8;">
          ${fd.responsibilities.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-top: 48px; border-top: 1px dashed #cbd5e1; padding-top: 24px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
        <div>ระบบบริหารจัดการข้อมูลโครงสร้างองค์การ (SMART Description) เชื่อมโยง SAP</div>
        <div>วันที่พิมพ์ / ส่งออก: ${new Date().toLocaleDateString('th-TH')}</div>
      </div>
    </div>
  `;
};

export const generateJdDocumentHtml = (jd: JobDescription): string => {
  return `
    <div style="font-family: 'Sarabun', sans-serif; padding: 32px; max-width: 860px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <div style="font-size: 13px; font-weight: 600; color: #0284c7; text-transform: uppercase;">
            การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.)
          </div>
          <h1 style="font-size: 20px; font-weight: 700; margin: 4px 0 0; color: #0f172a;">
            คำบรรยายลักษณะงาน (Job Description : JD)
          </h1>
          <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
            ${jd.orgPath}
          </div>
        </div>
        <div style="text-align: right; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 8px 16px;">
          <div style="font-size: 12px; color: #0369a1;">รหัสตำแหน่งย่อ</div>
          <div style="font-size: 18px; font-weight: 700; color: #0284c7;">${jd.shortCode}</div>
        </div>
      </div>

      <!-- Part 1: Position General Information -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
          ส่วนที่ 1 ข้อมูลทั่วไปของตำแหน่งงาน
        </h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 13px; padding: 0 4px;">
          <div><span style="font-weight: 600; color: #475569;">ชื่อตำแหน่งงาน:</span> ${jd.positionTitle}</div>
          <div><span style="font-weight: 600; color: #475569;">รหัสตำแหน่ง:</span> ${jd.positionCode}</div>
          <div><span style="font-weight: 600; color: #475569;">สายงาน/ฝ่าย:</span> ${jd.departmentLine}</div>
          <div><span style="font-weight: 600; color: #475569;">ระดับงาน:</span> ${jd.jobLevelTitle}</div>
          <div><span style="font-weight: 600; color: #475569;">รหัสหน่วยงาน:</span> ${jd.unitCode}</div>
          <div><span style="font-weight: 600; color: #475569;">เลขที่คำสั่ง กฟผ.:</span> ${jd.orderNo}</div>
          <div><span style="font-weight: 600; color: #475569;">วันที่มีผลบังคับใช้:</span> ${jd.effectiveDate}</div>
          <div><span style="font-weight: 600; color: #475569;">สถานะ:</span> <span style="color: #16a34a; font-weight: 600;">● ${jd.status}</span></div>
          <div style="grid-column: span 2;"><span style="font-weight: 600; color: #475569;">ผู้บังคับบัญชาโดยตรง:</span> ${jd.directSupervisor}</div>
          <div style="grid-column: span 2;">
            <span style="font-weight: 600; color: #475569;">ตำแหน่งงานภายใต้การบังคับบัญชาโดยตรง:</span>
            ${jd.directSubordinates.length > 0 
              ? `<ul style="margin: 4px 0 0; padding-left: 20px;">${jd.directSubordinates.map(s => `<li>${s}</li>`).join('')}</ul>` 
              : '<span style="color: #64748b; margin-left: 8px;">ไม่มี (ตำแหน่งไม่บังคับบัญชา)</span>'}
          </div>
        </div>
      </div>

      <!-- Part 2: Position Objective -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
          ส่วนที่ 2 วัตถุประสงค์ของตำแหน่งงาน (Position Purpose)
        </h2>
        <p style="text-indent: 2rem; text-align: justify; margin: 0; color: #334155; line-height: 1.8; font-size: 13px; padding: 0 4px;">
          ${jd.positionObjective}
        </p>
      </div>

      <!-- Part 3: Duties and Responsibilities (3 Columns Table) -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
          ส่วนที่ 3 หน้าที่ความรับผิดชอบและผลลัพธ์ที่คาดหวัง (Key Accountabilities & Expected Outcomes)
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px;">
          <thead>
            <tr style="background: #e2e8f0; color: #1e293b; text-align: left;">
              <th style="padding: 10px; border: 1px solid #cbd5e1; width: 28%;">หัวข้องาน</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; width: 42%;">หน้าที่ความรับผิดชอบ</th>
              <th style="padding: 10px; border: 1px solid #cbd5e1; width: 30%;">ผลลัพธ์ที่คาดหวัง</th>
            </tr>
          </thead>
          <tbody>
            ${jd.duties.map((duty, idx) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; vertical-align: top;">
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600; color: #0f172a;">
                  ${duty.taskGroup}
                </td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; color: #334155;">
                  <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
                    ${duty.responsibilities.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; color: #334155;">
                  <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
                    ${duty.expectedOutcomes.map(o => `<li>${o}</li>`).join('')}
                  </ul>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Part 4: Specific Qualifications (Rectangular Box with 4 Items) -->
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
          ส่วนที่ 4 คุณสมบัติเฉพาะตำแหน่ง (Job Specifications)
        </h2>
        <div style="border: 2px solid #cbd5e1; border-radius: 8px; padding: 16px; background: #ffffff;">
          <div style="margin-bottom: 12px; font-size: 13px;">
            <div style="font-weight: 700; color: #0284c7; margin-bottom: 4px;">1. คุณสมบัติพื้นฐาน</div>
            <div style="color: #334155; padding-left: 12px;">${jd.qualifications.basicQualifications}</div>
          </div>
          <div style="margin-bottom: 12px; font-size: 13px;">
            <div style="font-weight: 700; color: #0284c7; margin-bottom: 4px;">2. ระดับการศึกษา</div>
            <div style="color: #334155; padding-left: 12px;">${jd.qualifications.educationLevel}</div>
          </div>
          <div style="margin-bottom: 12px; font-size: 13px;">
            <div style="font-weight: 700; color: #0284c7; margin-bottom: 4px;">3. คุณวุฒิ / สาขาวิชา</div>
            <div style="color: #334155; padding-left: 12px;">${jd.qualifications.fieldsOfStudy}</div>
          </div>
          <div style="font-size: 13px;">
            <div style="font-weight: 700; color: #0284c7; margin-bottom: 4px;">4. ประสบการณ์ทำงาน</div>
            <div style="color: #334155; padding-left: 12px;">${jd.qualifications.workExperience}</div>
          </div>
        </div>
      </div>

      <!-- Footer Sign-off -->
      <div style="margin-top: 48px; border-top: 1px dashed #cbd5e1; padding-top: 24px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
        <div>ระบบ SMART Description (EGAT HR) เชื่อมโยงฐานข้อมูล SAP แบบเรียลไทม์</div>
        <div>วันที่พิมพ์ / ส่งออก: ${new Date().toLocaleDateString('th-TH')}</div>
      </div>
    </div>
  `;
};

// Print / PDF action helper
export const printDocument = (htmlContent: string, title: string) => {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 0; background: #fff; }
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
export const downloadFdsAsZip = async (fds: FunctionalDescription[], zipName = 'FD_Documents.zip') => {
  const zip = new JSZip();
  const folder = zip.folder('FD_Functional_Descriptions');

  fds.forEach(fd => {
    const fileName = `${fd.code}_${fd.shortName.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}_FD.html`;
    const content = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>${fd.name} (${fd.shortName})</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; }
        </style>
      </head>
      <body>
        ${generateFdDocumentHtml(fd)}
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
        <title>${jd.positionTitle}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; }
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
