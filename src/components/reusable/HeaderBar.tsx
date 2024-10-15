// src/components/HeaderBar.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const HeaderBar: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <header className="bg-blue-600 text-white flex justify-between items-center p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user && <span>Welcome, {user.username}</span>}
    </header>
  );
};

export default HeaderBar;
