import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearUser } from '../store/userSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { setIsSidebarCollapsed } from '../store/uiSlice';

const HeaderBar: React.FC = () => {
  const dispatch = useDispatch();
  const activeDashboardId = useSelector(
    (state: RootState) => state.ui.activeDashboardId
  );
  const dashboards = useSelector(
    (state: RootState) => state.dashboard.dashboards
  );
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed
  );
  const location = useLocation();

  const activeDashboard = dashboards.find((db) => db.id === activeDashboardId);

  const handleLogout = () => {
    dispatch(clearUser());
    // You might want to add navigation to login page here
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return activeDashboard ? activeDashboard.name : 'Dashboard';
      case '/integrations':
        return 'Integrations';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
      <div className='flex items-center'>
        <button
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          className='mr-4 text-xl transition-transform duration-300 ease-in-out transform hover:scale-110'
        >
          ☰
        </button>
        <h1
          className={`text-xl font-bold transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          {getPageTitle()}
        </h1>
      </div>
      <button
        onClick={handleLogout}
        className='flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors duration-300 ease-in-out'
      >
        <FaSignOutAlt className='mr-2' />
        Logout
      </button>
    </header>
  );
};

export default HeaderBar;
