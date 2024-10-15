// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardManager from './components/DashboardManager';
import DashboardPage from './pages/DashboardPage';
import IntegrationsPage from './pages/IntegrationsPage';
// import ReportsPage from './pages/ReportsPage';
import LoginComponent from './components/auth/LoginComponent';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/MainLayout';
import NotFound from './components/common/NotFound';
import UserDashboard from './components/dashboard/UserDashboard';

const App: React.FC = () => (
  <div className='App'>
    <Routes>
      <Route path='/login' element={<LoginComponent />} />
      {/* Protected Routes */}
      <Route path='/' element={<Navigate to='/dashboard' replace />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardManager />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/integrations'
        element={
          <ProtectedRoute>
            <MainLayout>
              <IntegrationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Global 404 Route */}
      <Route path='*' element={<NotFound />} />
    </Routes>
    <ToastContainer />
  </div>
);

export default App;
