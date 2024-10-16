// src/components/MainLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setActiveDashboardId, setIsSidebarCollapsed } from '../store/uiSlice';
import { addDashboard, deleteDashboard } from '../store/dashboardSlice';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();

  // Select necessary state from Redux
  const dashboards = useSelector(
    (state: RootState) => state.dashboard.dashboards
  );
  const activeDashboardId = useSelector(
    (state: RootState) => state.ui.activeDashboardId
  );
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed
  );

  // Handlers
  const handleSetActiveDashboardId = (id: string) => {
    dispatch(setActiveDashboardId(id));
  };

  const handleAddDashboard = (data: { name: string; id: string }) => {
    dispatch(addDashboard({ ...data }));
  };

  const handleDeleteDashboard = (id: string) => {
    dispatch(deleteDashboard(id));
  };

  const handleSetIsSidebarCollapsed = (collapsed: boolean) => {
    dispatch(setIsSidebarCollapsed(collapsed));
  };

  // Adjust main content margin based on sidebar collapsed state
  const sidebarWidth = isSidebarCollapsed ? '64px' : '256px';

  return (
    <div className='h-screen flex flex-col bg-gray-900 text-white'>
      <HeaderBar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar
          dashboards={dashboards}
          activeDashboardId={activeDashboardId}
          setActiveDashboardId={handleSetActiveDashboardId}
          addDashboard={handleAddDashboard}
          deleteDashboard={handleDeleteDashboard}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={handleSetIsSidebarCollapsed}
        />
        <main
          className='flex-1 p-4 overflow-y-auto bg-gray-800'
          style={{ marginLeft: sidebarWidth }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
