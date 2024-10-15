// src/components/ChatbotIcon.tsx
import React, { useState } from "react";
import { FaComments, FaRobot } from "react-icons/fa";
import Modal from "./Modal";
import Chatbot from "../chatbot/Chatbot";
import { Message } from "../chatbot/Chatbot";
import { DashboardConfig } from "../../store/dashboardSlice";
import { User } from "../../store/userSlice";

interface ChatbotIconProps {
  onPinMessage: (message: Message) => void;
  dashboardConfig: DashboardConfig;
  onAssignAgent: () => void;
  user: User | null;
}

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ 
  onPinMessage, 
  dashboardConfig,
  onAssignAgent,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState("");

  return (
    <>
      <button
        onClick={() => {
          if (dashboardConfig.agent) {
            setIsOpen(true);
          } else {
            onAssignAgent();
          }
        }}
        className="fixed p-4 text-white bg-teal-600 rounded-full shadow-lg bottom-28 right-10 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
        aria-label="Open chatbot"
      >
        {dashboardConfig.agent ? <FaComments className="w-6 h-6" /> : <FaRobot className="w-6 h-6" />}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {dashboardConfig.agent && user && (
          <Chatbot 
            onClose={() => setIsOpen(false)} 
            onPinMessage={onPinMessage} 
            chatSessionId={chatSessionId}
            setChatSessionId={setChatSessionId}
            assignedAgent={dashboardConfig.agent}
            user={user}
          />
        )}
      </Modal>
    </>
  );
};

export default ChatbotIcon;
