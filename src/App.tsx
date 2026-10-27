import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActiveMenu } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { HomeView } from './views/HomeView';
import { SearchFdView } from './views/SearchFdView';
import { SearchJdView } from './views/SearchJdView';
import { ManageDataView } from './views/ManageDataView';
import { OrgChartView } from './views/OrgChartView';
import { UnitCountView } from './views/UnitCountView';
import { JobStructureView } from './views/JobStructureView';
import { SearchGeneralJdView } from './views/SearchGeneralJdView';
import { Menu, X } from 'lucide-react';

function AppContent() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('home');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSelectMenu = (menu: ActiveMenu) => {
    setActiveMenu(menu);
    setIsMobileSidebarOpen(false);
  };

  const renderCurrentView = () => {
    switch (activeMenu) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleSelectMenu}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          />
        );
      case 'search-fd':
        return <SearchFdView />;
      case 'search-supervisory-jd':
        return <SearchJdView />;
      case 'manage-data':
        return <ManageDataView />;
      case 'org-chart':
        return <OrgChartView />;
      case 'unit-count':
        return <UnitCountView />;
      case 'job-structure':
        return <JobStructureView />;
      case 'search-general-jd':
        return <SearchGeneralJdView />;
      default:
        return (
          <HomeView
            onNavigate={handleSelectMenu}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar activeMenu={activeMenu} onSelectMenu={handleSelectMenu} />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-72 bg-white h-full shadow-2xl">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-3 p-1.5 text-slate-400 hover:text-slate-700 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar activeMenu={activeMenu} onSelectMenu={handleSelectMenu} />
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <div className="relative flex items-center">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden ml-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="เปิดเมนู"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <Header
              activeMenu={activeMenu}
              onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            />
          </div>
        </div>

        {/* Viewport Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Role Switcher / Login Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
