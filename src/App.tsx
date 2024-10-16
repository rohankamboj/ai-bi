// src/App.tsx

import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardManager from './components/DashboardManager';
import IntegrationsPage from './pages/IntegrationsPage';
// import ReportsPage from './pages/ReportsPage';
import { useSelector } from 'react-redux';
import LoginComponent from './components/auth/LoginComponent';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './components/common/NotFound';
import MainLayout from './components/MainLayout';
import { RootState } from './store';

const App: React.FC = () => {
  const navigate = useNavigate();

  const { activeDashboardId } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (activeDashboardId) {
      navigate(`/dashboard/${activeDashboardId}`);
    }
  }, [activeDashboardId]);

  return (
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
          path='/dashboard/:dashboard_id'
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
};

export default App;
