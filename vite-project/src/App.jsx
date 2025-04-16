import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import TasksPage from './pages/tasks/TasksPage'; // Import the new TasksPage
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './context/authContext';
import Home from './pages/Home';
import GlobalStyles from './context/GlobalStyles'; // Import GlobalStyles

function App() {
  const authContext = useContext(AuthContext);
  const { loadUser, isAuthenticated, user, loading } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log('useEffect in App.jsx - isAuthenticated:', isAuthenticated, 'user:', user, 'pathname:', window.location.pathname, 'loading:', loading);
    if (!loading) {
      if (isAuthenticated && user && user.role) {
        const targetPath = `/${user.role}`;
        console.log('Navigating to:', targetPath);
        navigate(targetPath);
      }
    }
  }, [isAuthenticated, user, navigate, loading]);

  return (
    <>
      <GlobalStyles /> {/* Add GlobalStyles component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/manager"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/client"
          element={
            <PrivateRoute allowedRoles={['client']}>
              <ClientDashboard />
            </PrivateRoute>
          }
        />
        {/* Add TasksPage route accessible to all roles */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute allowedRoles={['manager', 'employee', 'client']}>
              <TasksPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;