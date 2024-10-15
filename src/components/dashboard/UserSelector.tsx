import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { User } from '../../data/dummyData';

interface UserSelectorProps {
  users: User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, selectedUserId, onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedUser = users.find(user => user.id === selectedUserId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-[#233239] text-white px-4 py-2 rounded-lg flex items-center justify-between w-48 hover:bg-[#2C3E50] transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaUser className="text-[#4FD1C5] mr-2" />
          <span className="truncate">{selectedUser?.name}</span>
        </div>
        <FaChevronDown className={`ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-[#1A2A2F] ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {users.map((user) => (
              <button
                key={user.id}
                className={`block px-4 py-2 text-sm text-white w-full text-left hover:bg-[#233239] transition-colors duration-200 ${
                  user.id === selectedUserId ? 'bg-[#2C3E50] text-[#4FD1C5]' : ''
                }`}
                role="menuitem"
                onClick={() => {
                  onSelectUser(user.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  {user.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
