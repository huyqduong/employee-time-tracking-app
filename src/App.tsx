import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TaskManagement from './pages/TaskManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import JobLocationManagement from './pages/JobLocationManagement';
import TimesheetReview from './pages/TimesheetReview';
import TimeManagement from './pages/TimeManagement';
import TimesheetManagement from './pages/TimesheetManagement';
import ScheduleManagement from './pages/ScheduleManagement';

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
            path="job-locations"
            element={
              <ProtectedRoute requireAdmin>
                <JobLocationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="timesheet-review"
            element={
              <ProtectedRoute requireAdmin>
                <TimesheetReview />
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
          <Route
            path="schedule-management"
            element={
              <ProtectedRoute requireAdmin>
                <ScheduleManagement />
              </ProtectedRoute>
            }
          />

          {/* Task routes - different views for admin/employee */}
          <Route path="tasks" element={<TaskManagement />} />

          {/* Employee routes */}
          <Route
            path="time-management"
            element={
              <ProtectedRoute>
                <TimesheetManagement />
              </ProtectedRoute>
            }
          />

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
