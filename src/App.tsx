import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TaskManagement from './pages/TaskManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import TimeTracking from './pages/TimeTracking';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Mock authentication check - replace with your actual auth logic
const isAuthenticated = () => {
  return localStorage.getItem('auth_token') !== null;
};

// Mock role check - replace with your actual role check logic
const isAdmin = () => {
  const userRole = localStorage.getItem('user_role');
  return userRole === 'admin';
};

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

// Protected Route wrapper
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Role-based dashboard component
const DashboardComponent = () => {
  return isAdmin() ? <AdminDashboard /> : <Dashboard />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - role-based */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardComponent />} />

          {/* Admin-only routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute requireAdmin>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Task routes - different views for admin/employee */}
          <Route path="tasks" element={<TaskManagement />} />

          {/* Employee-specific routes */}
          <Route path="time-tracking" element={<TimeTracking />} />

          {/* Common routes */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
