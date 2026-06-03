import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import ClassManagement from './components/ClassManagement';
import AssessmentManagement from './components/AssessmentManagement';
import FeeManagement from './components/FeeManagement';
import ReportCards from './components/ReportCards';
import AuditLogs from './components/AuditLogs';
import Settings from './components/Settings';
import { Menu } from 'lucide-react';
import type { Page } from './types';

function AppContent() {
  const { isAuthenticated, currentUser } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Login />;

  const pageTitle: Record<Page, string> = {
    dashboard: 'Dashboard',
    students: 'Students',
    teachers: 'Teachers',
    classes: 'Classes',
    assessments: 'Assessments',
    fees: 'Fees & Payments',
    reports: 'Report Cards',
    audit: 'Audit Logs',
    settings: 'Settings',
  };

  // Role-based page filtering
  const renderPage = () => {
    if (currentUser?.role === 'parent') {
      // Parents see limited view
      if (activePage === 'dashboard' || activePage === 'fees' || activePage === 'audit' || activePage === 'teachers' || activePage === 'classes' || activePage === 'settings') {
        return <Dashboard />;
      }
    }
    if (currentUser?.role === 'teacher') {
      if (activePage === 'audit' || activePage === 'settings' || activePage === 'fees' || activePage === 'teachers' || activePage === 'classes') {
        return <Dashboard />;
      }
    }

    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'students': return <StudentManagement />;
      case 'teachers': return <TeacherManagement />;
      case 'classes': return <ClassManagement />;
      case 'assessments': return <AssessmentManagement />;
      case 'fees': return <FeeManagement />;
      case 'reports': return <ReportCards />;
      case 'audit': return <AuditLogs />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{pageTitle[activePage]}</h2>
            <p className="text-xs text-gray-500">GoldenKey Elite — AI-Powered School Management</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
