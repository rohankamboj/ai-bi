// src/components/reusable/SplitScreen.tsx
import React from "react";

interface SplitScreenProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const SplitScreen: React.FC<SplitScreenProps> = ({ left, right }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 p-2">{left}</div>
      <div className="md:w-1/2 p-2">{right}</div>
    </div>
  );
};

export default SplitScreen;
