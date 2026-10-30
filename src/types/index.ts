export type UserRole = 
  | 'general_employee'           // พนักงานทั่วไป (ไม่มีตำแหน่งบังคับบัญชา)
  | 'supervisory_employee'       // พนักงานที่มีตำแหน่งบังคับบัญชา (หัวหน้าแผนกขึ้นไป)
  | 'hrbp'                       // HRBP (กบส-ห.)
  | 'executive_recruitment'      // ทีมสรรหาผู้บริหารระดับสูง (หบหส-ห.)
  | 'admin_hr_fd'                // แอดมิน HR-FD (หคอ-ห.)
  | 'admin_hr_jd';               // แอดมิน HR-JD (หคอ-ห.)

export interface UserProfile {
  id: string;
  name: string;
  employeeId: string;
  role: UserRole;
  roleTitle: string;
  positionTitle: string;
  positionLevel: number;
  unitCode: string;
  unitShortName: string;
  unitFullName: string;
  divisionShortName?: string;
  departmentShortName?: string;
  assistantShortName?: string;
  deputyShortName?: string;
  supervisedUnitIds?: string[];
  hrbpAssignedDepIds?: string[];
  avatarUrl?: string;
  myFdId?: string;
  myJdId?: string;
}

export interface FunctionalDescription {
  id: string;
  code: string;               // e.g. S100240
  shortName: string;          // e.g. กกพ-ห.
  name: string;               // e.g. กองกลยุทธ์และพัฒนาองค์การ
  levelType: 'deputy' | 'assistant' | 'department' | 'division' | 'section';
  deputyName: string;         // สายงานรองผู้ว่าการ
  assistantName?: string;     // ผู้ช่วยผู้ว่าการ
  departmentName?: string;    // ฝ่าย
  divisionName?: string;      // กอง
  sectionName?: string;       // แผนก
  parentId?: string;
  orgPath: string;            // เช่น รองผู้ว่าการบริหาร > ผู้ช่วยผู้ว่าการพัฒนาองค์การ > ฝ่ายทรัพยากรบุคคลและพัฒนาองค์การ > กองกลยุทธ์และพัฒนาองค์การ
  objective: string;          // วัตถุประสงค์หน่วยงาน (paragraph)
  responsibilities: string[]; // ความรับผิดชอบหลัก (bullets)
  orderNo: string;            // เลขที่คำสั่ง กฟผ.
  effectiveDate: string;      // วันที่มีผลบังคับใช้
  status: 'ใช้งาน' | 'ร่าง' | 'ยกเลิก';
  itemCount: number;
  updatedAt: string;
  unitSequenceNumber?: string; // e.g. "1."
  affiliationText?: string;    // e.g. "สังกัด อทบ. ชฟพ. รวห."
}

export interface JdDutyItem {
  id: string;
  taskGroup: string;          // หัวข้องาน
  responsibilities: string[]; // หน้าที่ความรับผิดชอบ (bullets)
  expectedOutcomes: string[]; // ผลลัพธ์ที่คาดหวัง (bullets)
}

export interface JdQualifications {
  basicQualifications: string; // คุณสมบัติพื้นฐาน ปัจจุบันดำรงตำแหน่ง...
  educationLevel: string;      // ระดับการศึกษา
  fieldsOfStudy: string;       // คุณวุฒิ / สาขาวิชา
  workExperience: string;      // ประสบการณ์ทำงาน
}

export interface JobDescription {
  id: string;
  fdId: string;                // อ้างอิง FD
  positionTitle: string;       // เช่น หัวหน้ากองกลยุทธ์และพัฒนาองค์การ (กกพ-ห.)
  positionCode: string;        // เช่น JD-S100240-01
  shortCode: string;           // กกพ-ห.
  orgPath: string;             // สายรอง > ผู้ช่วย > ฝ่าย > กอง > แผนก
  departmentLine: string;      // สายงาน/ผู้ช่วยผู้ว่าการ/ฝ่าย
  jobLevelTitle: string;       // เช่น หัวหน้ากอง หรือ หัวหน้าแผนก
  levelNumber: number;         // 7, 8, 9, 10, 11, 12, 13, 14
  isSupervisory: boolean;      // ตำแหน่งบังคับบัญชา
  directSupervisor: string;    // ผู้บังคับบัญชาโดยตรง
  directSubordinates: string[];// ตำแหน่งงานภายใต้การบังคับบัญชาโดยตรง
  unitCode: string;            // รหัส SAP Sxxxxxx
  unitName: string;            // ชื่อหน่วยงาน
  orderNo: string;             // เลขที่คำสั่ง กฟผ. ที่ ค.xxx/25xx
  effectiveDate: string;       // วันที่มีผลบังคับใช้
  status: 'ใช้งาน' | 'ร่าง' | 'ยกเลิก';
  positionObjective: string;   // วัตถุประสงค์ของตำแหน่งงาน (paragraph)
  duties: JdDutyItem[];        // หน้าที่ความรับผิดชอบ (ตาราง 3 คอลัมน์)
  qualifications: JdQualifications; // คุณสมบัติเฉพาะตำแหน่ง (กรอบ 4 ข้อ)
  updatedAt: string;
  targetCategory?: 'supervisory' | 'general';
}

export type ActiveMenu = 
  | 'home'
  | 'org-chart'
  | 'unit-count'
  | 'search-fd'
  | 'job-structure'
  | 'search-general-jd'
  | 'search-supervisory-jd'
  | 'manage-data';
