import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, FunctionalDescription, JobDescription } from '../types';
import { MOCK_USER_PERSONAS, INITIAL_FD_LIST, INITIAL_JD_LIST } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;
  // FD Data State
  fdList: FunctionalDescription[];
  addFd: (fd: Omit<FunctionalDescription, 'id' | 'updatedAt'>) => void;
  updateFd: (id: string, updated: Partial<FunctionalDescription>) => void;
  deleteFd: (id: string) => void;
  // JD Data State
  jdList: JobDescription[];
  addJd: (jd: Omit<JobDescription, 'id' | 'updatedAt'>) => void;
  updateJd: (id: string, updated: Partial<JobDescription>) => void;
  deleteJd: (id: string) => void;
  // Permission checks
  canAccessSupervisoryJdSearch: boolean;
  filterAllowedSupervisoryJds: (jds: JobDescription[]) => JobDescription[];
  canManageFd: boolean;
  canManageJd: boolean;
  canAccessAdminMenu: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence in localStorage so demo changes persist nicely
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smart_desc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_USER_PERSONAS[1]; // Default to supervisory employee (หัวหน้ากอง)
  });

  const [fdList, setFdList] = useState<FunctionalDescription[]>(() => {
    const saved = localStorage.getItem('smart_desc_fds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FD_LIST;
  });

  const [jdList, setJdList] = useState<JobDescription[]>(() => {
    const saved = localStorage.getItem('smart_desc_jds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_JD_LIST;
  });

  useEffect(() => {
    localStorage.setItem('smart_desc_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('smart_desc_fds', JSON.stringify(fdList));
  }, [fdList]);

  useEffect(() => {
    localStorage.setItem('smart_desc_jds', JSON.stringify(jdList));
  }, [jdList]);

  const switchUser = (userId: string) => {
    const target = MOCK_USER_PERSONAS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const addFd = (newFd: Omit<FunctionalDescription, 'id' | 'updatedAt'>) => {
    const created: FunctionalDescription = {
      ...newFd,
      id: `fd-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setFdList(prev => [created, ...prev]);
  };

  const updateFd = (id: string, updated: Partial<FunctionalDescription>) => {
    setFdList(prev =>
      prev.map(fd =>
        fd.id === id
          ? { ...fd, ...updated, updatedAt: new Date().toISOString().split('T')[0] }
          : fd
      )
    );
  };

  const deleteFd = (id: string) => {
    setFdList(prev => prev.filter(fd => fd.id !== id));
  };

  const addJd = (newJd: Omit<JobDescription, 'id' | 'updatedAt'>) => {
    const created: JobDescription = {
      ...newJd,
      id: `jd-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setJdList(prev => [created, ...prev]);
  };

  const updateJd = (id: string, updated: Partial<JobDescription>) => {
    setJdList(prev =>
      prev.map(jd =>
        jd.id === id
          ? { ...jd, ...updated, updatedAt: new Date().toISOString().split('T')[0] }
          : jd
      )
    );
  };

  const deleteJd = (id: string) => {
    setJdList(prev => prev.filter(jd => jd.id !== id));
  };

  // RBAC permissions according to business rules
  const canAccessSupervisoryJdSearch = currentUser.role !== 'general_employee';

  const canManageFd = currentUser.role === 'admin_hr_fd';
  const canManageJd = currentUser.role === 'admin_hr_jd';
  const canAccessAdminMenu = currentUser.role === 'admin_hr_fd' || currentUser.role === 'admin_hr_jd';

  const filterAllowedSupervisoryJds = (jds: JobDescription[]): JobDescription[] => {
    // Only supervisory JDs
    const supervisoryJds = jds.filter(j => j.isSupervisory);

    switch (currentUser.role) {
      case 'general_employee':
        return [];

      case 'supervisory_employee': {
        // Can search only supervisory JDs of their own unit and units under their command
        const allowedUnits = currentUser.supervisedUnitIds || [currentUser.unitCode];
        return supervisoryJds.filter(j => allowedUnits.includes(j.unitCode));
      }

      case 'hrbp': {
        // Can search only division heads (หัวหน้ากอง) + section heads (หัวหน้าแผนก) in assigned units
        const assignedUnits = currentUser.hrbpAssignedDepIds || [];
        return supervisoryJds.filter(
          j =>
            assignedUnits.includes(j.unitCode) &&
            (j.levelNumber === 10 || j.levelNumber === 9 || j.levelNumber === 8 || j.levelNumber === 7)
        );
      }

      case 'executive_recruitment': {
        // Can search only their own position, and Assistant Director (ระดับ 11) up to Deputy Governor (ระดับ 14)
        return supervisoryJds.filter(
          j => j.id === currentUser.myJdId || j.levelNumber >= 11
        );
      }

      case 'admin_hr_fd':
      case 'admin_hr_jd':
        // Admins can see all
        return supervisoryJds;

      default:
        return [];
    }
  };

  const getAccessScopeDescription = (): string => {
    switch (currentUser.role) {
      case 'general_employee':
        return 'ไม่มีสิทธิ์เข้าถึง JD ตำแหน่งบังคับบัญชา (อนุญาตเฉพาะพนักงานบังคับบัญชาขึ้นไปและ HR)';
      case 'supervisory_employee':
        return `สิทธิ์เข้าถึง: เฉพาะตำแหน่งบังคับบัญชาของหน่วยงานตนเอง (${currentUser.unitShortName}) และหน่วยงานภายใต้สังกัด (${currentUser.supervisedUnitIds?.join(', ') || currentUser.unitCode})`;
      case 'hrbp':
        return `สิทธิ์เข้าถึง HRBP: ตำแหน่งหัวหน้ากอง (ระดับ 10) และหัวหน้าแผนก (ระดับ 8) ในหน่วยงานที่ดูแล (${currentUser.hrbpAssignedDepIds?.length || 0} หน่วยงาน)`;
      case 'executive_recruitment':
        return 'สิทธิ์เข้าถึงทีมสรรหาผู้บริหารระดับสูง: ตำแหน่งของตนเอง และตำแหน่งผู้ช่วยผู้อำนวยการฝ่ายขึ้นไปทั้งหมด (ระดับ 11 - 14)';
      case 'admin_hr_fd':
        return 'สิทธิ์ผู้ดูแลระบบ HR-FD: เข้าถึง FD/JD ทั้งหมด (มีสิทธิ์ เพิ่ม/แก้ไข/ลบ FD)';
      case 'admin_hr_jd':
        return 'สิทธิ์ผู้ดูแลระบบ HR-JD: เข้าถึง FD/JD ทั้งหมด (มีสิทธิ์ เพิ่ม/แก้ไข/ลบ JD)';
      default:
        return '';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers: MOCK_USER_PERSONAS,
        switchUser,
        fdList,
        addFd,
        updateFd,
        deleteFd,
        jdList,
        addJd,
        updateJd,
        deleteJd,
        canAccessSupervisoryJdSearch,
        filterAllowedSupervisoryJds,
        canManageFd,
        canManageJd,
        canAccessAdminMenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
