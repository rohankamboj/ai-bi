// src/components/Sidebar.tsx
import React, { useState } from 'react';
import {
  FaPlus,
  FaBars,
  FaCog,
  FaBell,
  FaTrash,
  FaTimes,
  FaChartBar,
  FaHome,
  FaChartPie,
  FaDatabase,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  dashboards: DashboardConfig[];
  activeDashboardId: string;
  setActiveDashboardId: (id: string) => void;
  addDashboard: (name: string) => void;
  deleteDashboard: (id: string) => void;
  isCollapsed: boolean; // Receive collapse state
  setIsCollapsed: (collapsed: boolean) => void; // Receive state updater
}

interface DashboardConfig {
  id: string;
  name: string;
  chartConfigs: { [key: string]: any };
  layouts: any;
  dynamicComponents: any[];
  lockedComponents: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  dashboards,
  activeDashboardId,
  setActiveDashboardId,
  addDashboard,
  deleteDashboard,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [isAddDashboardModalOpen, setIsAddDashboardModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  const handleAddDashboard = () => {
    if (newDashboardName.trim() === '') return;
    addDashboard(newDashboardName.trim());
    setNewDashboardName('');
    setIsAddDashboardModalOpen(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full ${
          isCollapsed ? 'w-16' : 'w-64'
        } bg-[#000D0F] flex flex-col transition-all duration-300`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {/* Sidebar Header */}
        <div className='flex items-center justify-center p-4 border-b border-gray-800'>
          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 p-4'>
            <span className='text-white text-2xl'>a</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className='flex-grow p-2 overflow-y-auto'>
          <nav className='space-y-2'>
            <div
              className={`text-gray-500 uppercase tracking-wider text-xs mb-2 ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
              Navigation
            </div>

            {/* Home Link */}
            <NavLink
              to='/'
              end
              className={`flex items-center px-2 py-2 rounded hover:bg-[#FFFFFF17] ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <FaHome size={20} className='flex-shrink-0 text-gray-400' />
              {!isCollapsed && (
                <span className='ml-2 text-gray-100 flex-grow'>Dashboard</span>
              )}
            </NavLink>

            {/* Data Handling Link */}
            <NavLink
              to='/integrations'
              className={`flex items-center px-2 py-2 rounded hover:bg-[#FFFFFF17] ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <FaDatabase size={20} className='flex-shrink-0 text-gray-400' />
              {!isCollapsed && (
                <span className='ml-2 text-gray-100 flex-grow'>
                  Integrations
                </span>
              )}
            </NavLink>

            {/* Reports Link */}
            {/* <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded hover:bg-[#FFFFFF17] ${
                  isCollapsed ? "justify-center" : "justify-start"
                } ${isActive ? "bg-[#FFFFFF24]" : ""}`
              }
            >
              <FaChartPie size={20} className="flex-shrink-0 text-gray-400" />
              {!isCollapsed && (
                <span className="ml-2 text-gray-100 flex-grow">Reports</span>
              )}
            </NavLink> */}

            {/* Divider */}
            <div className='border-t border-gray-800 my-2'></div>

            {/* Dashboards Section */}
            <div
              className={`text-gray-500 uppercase tracking-wider text-xs mb-2 ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
              Dashboards
            </div>

            {/* Add Dashboard Button */}
            <div
              className={`flex items-center justify-center py-2 ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
              <button
                onClick={() => setIsAddDashboardModalOpen(true)}
                className='flex items-center justify-start px-4 py-2 bg-[#FFFFFF17] text-gray-300 rounded-md hover:bg-[#FFFFFF24] transition-colors w-full'
                title='Add Dashboard'
              >
                <FaPlus className='mr-2' />
                <span>Add Dashboard</span>
              </button>
            </div>

            {/* Dashboards List */}
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className={`flex items-center px-2 py-2 rounded hover:bg-[#FFFFFF17] ${
                  activeDashboardId === dashboard.id
                    ? 'bg-[#FFFFFF24]'
                    : 'bg-transparent'
                } cursor-pointer`}
                onClick={() => setActiveDashboardId(dashboard.id)}
              >
                <FaBars size={20} className='flex-shrink-0 text-gray-400' />
                {!isCollapsed && (
                  <span className='ml-2 text-gray-100 flex-grow'>
                    {dashboard.name}
                  </span>
                )}
                {!isCollapsed && (
                  <FaTrash
                    size={16}
                    className='text-gray-400 hover:text-red-500 ml-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDashboard(dashboard.id);
                    }}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className='p-2 border-t border-gray-800'>
          <nav className='space-y-2'>
            <div
              className={`text-gray-500 uppercase tracking-wider text-xs mb-2 ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
              More
            </div>

            <a
              href='#'
              className={`flex items-center px-2 py-3 rounded hover:bg-[#FFFFFF17] text-gray-400 ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <FaBell size={20} className='flex-shrink-0' />
              {!isCollapsed && <span className='ml-2'>Notifications</span>}
            </a>
            <a
              href='#'
              className={`flex items-center px-2 py-3 rounded hover:bg-[#FFFFFF17] text-gray-400 ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <FaCog size={20} className='flex-shrink-0' />
              {!isCollapsed && <span className='ml-2'>Settings</span>}
            </a>
          </nav>
        </div>
      </div>

      {/* Add Dashboard Modal */}
      {isAddDashboardModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-[#1A2A2F] rounded-lg p-6 w-80 border border-[#4FD1C5]'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-[#4FD1C5]'>
                Add New Dashboard
              </h2>
              <FaTimes
                className='text-gray-400 hover:text-[#4FD1C5] cursor-pointer'
                onClick={() => setIsAddDashboardModalOpen(false)}
              />
            </div>
            <div className='relative mb-4'>
              <FaChartBar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                className='w-full p-2 pl-10 border border-[#4FD1C5] rounded-md bg-[#000D0F] text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]'
                placeholder='Dashboard Name'
                required
              />
            </div>
            <div className='flex justify-end space-x-2'>
              <button
                onClick={handleAddDashboard}
                className='px-4 py-2 bg-[#4FD1C5] text-white rounded-md hover:bg-[#3AB0A1] transition-colors flex items-center'
                disabled={!newDashboardName.trim()}
              >
                <FaPlus className='mr-2' /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
