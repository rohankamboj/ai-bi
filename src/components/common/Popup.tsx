// src/components/common/Popup.tsx
import React from "react";
import ReactDOM from "react-dom";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-[#000D0F] rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#4FD1C5]">
          <h2 className="text-xl font-semibold text-[#4FD1C5]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#4FD1C5] hover:text-[#3AB0A1]"
          >
            &times;
          </button>
        </div>
        {/* Body */}
        <div className="p-4 overflow-y-auto flex-grow text-white">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Popup;
