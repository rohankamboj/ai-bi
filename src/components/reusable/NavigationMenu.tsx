
// src/components/NavigationMenu.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationMenu: React.FC = () => (
  <nav className="space-y-2">
    <NavLink to="/" className={({ isActive }) => `block ${isActive ? 'font-bold' : ''}`}>
      Home
    </NavLink>
    <NavLink to="/dashboard" className={({ isActive }) => `block ${isActive ? 'font-bold' : ''}`}>
      Dashboard
    </NavLink>
    <NavLink to="/data-handling" className={({ isActive }) => `block ${isActive ? 'font-bold' : ''}`}>
      Data Handling
    </NavLink>
    <NavLink to="/reports" className={({ isActive }) => `block ${isActive ? 'font-bold' : ''}`}>
      Reports
    </NavLink>
  </nav>
);

export default NavigationMenu;
