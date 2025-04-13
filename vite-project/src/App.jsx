import React, { useContext, useEffect } from 'react';
import {Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './context/authContext';

function App() {
  const authContext = useContext(AuthContext);
  const { loadUser, isAuthenticated, user, loading } = authContext; // Include loading
  const navigate = useNavigate();
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log('useEffect in App.jsx - isAuthenticated:', isAuthenticated, 'user:', user, 'pathname:', window.location.pathname, 'loading:', loading);
    if (!loading) { // Only attempt redirection after loading is done
      if (isAuthenticated && user && user.role) {
        const targetPath = `/${user.role}`;
        console.log('Navigating to:', targetPath);
        navigate(targetPath);
      } else if (window.location.pathname === '/') {
        console.log('Navigating to /login');
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, navigate, loading]); // Include loading in dependencies

  return (
      <Routes>
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
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
  );
}

export default App;