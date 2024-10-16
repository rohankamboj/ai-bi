import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import { RootState } from '../store';
import { setActiveDashboardId, setIsSidebarCollapsed } from '../store/uiSlice';
import { clearUser } from '../store/userSlice';
import {
  addDashboard,
  updateDashboard,
  deleteDashboard,
  DashboardConfig,
} from '../store/dashboardSlice';

const DashboardManager: React.FC = () => {
  const dispatch = useDispatch();
  const { activeDashboardId, isSidebarCollapsed } = useSelector(
    (state: RootState) => state.ui
  );
  const user = useSelector((state: RootState) => state.user.user);
  const { dashboards } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    if (dashboards.length > 0 && !activeDashboardId) {
      dispatch(setActiveDashboardId(dashboards[0].id));
    }
  }, [dashboards, activeDashboardId, dispatch]);

  const handleAddDashboard = ({ name, id }: { name: string; id: string }) => {
    dispatch(addDashboard({ name, id }));
  };

  const handleDeleteDashboard = (id: string) => {
    if (dashboards.length === 1) {
      alert('At least one dashboard must exist.');
      return;
    }
    dispatch(deleteDashboard(id));
    if (activeDashboardId === id && dashboards.length > 1) {
      const newActiveDashboard = dashboards.find((d) => d.id !== id);
      if (newActiveDashboard) {
        dispatch(setActiveDashboardId(newActiveDashboard.id));
      }
    }
  };

  const handleUpdateDashboard = (updatedDashboard: DashboardConfig) => {
    dispatch(updateDashboard(updatedDashboard));
  };

  const handleLogout = () => {
    dispatch(clearUser());
    // Navigate to login if needed
  };

  const activeDashboard = dashboards.find((db) => db.id === activeDashboardId);

  return (
    <div className='flex'>
      <Sidebar
        dashboards={dashboards}
        activeDashboardId={activeDashboardId}
        setActiveDashboardId={(id: string) =>
          dispatch(setActiveDashboardId(id))
        }
        addDashboard={handleAddDashboard}
        deleteDashboard={handleDeleteDashboard}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={(isCollapsed: boolean) =>
          dispatch(setIsSidebarCollapsed(isCollapsed))
        }
      />

      {activeDashboard ? <Dashboard /> : <p>No active dashboard found.</p>}
    </div>
  );
};

export default DashboardManager;
