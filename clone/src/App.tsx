import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import ReportCards from './components/ReportCards';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getDashboard = () => {
    if (activeTab === 'report-cards') {
      return <ReportCards />;
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard tab={activeTab} />;
      case 'teacher':
        return <TeacherDashboard tab={activeTab} />;
      case 'parent':
        return <ParentDashboard tab={activeTab} />;
      default:
        return <Login />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {getDashboard()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
