import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-5xl font-bold mb-4 animate-fade-in">Page Not Found</h1>
      <p className="text-lg mb-6 animate-fade-in">Sorry, the page you are looking for does not exist.</p>
      <button
        onClick={goToDashboard}
        className="bg-[#4FD1C5] text-white px-4 py-2 rounded hover:bg-[#38B2AC] animate-bounce"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
