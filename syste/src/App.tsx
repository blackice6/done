import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAppContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their specific dashboard if they try to access an unauthorized route
    switch(user.role) {
      case 'admin': return <Navigate to="/admin" replace />;
      case 'teacher': return <Navigate to="/teacher" replace />;
      case 'parent': return <Navigate to="/parent" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
        
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="parent" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
