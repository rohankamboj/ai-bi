// src/components/Chatbot.tsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import parse from "html-react-parser"; // Import html-react-parser
import DOMPurify from "dompurify";
import {
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaDollarSign,
} from "react-icons/fa";
import { IoSend, IoMic, IoClose, IoRefresh } from "react-icons/io5";
import { RiRobot2Fill, RiUser3Fill } from "react-icons/ri";
import {
  MdContentCopy,
  MdOutlineThumbUp,
  MdOutlineThumbDown,
} from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Chatbot.css"; // Import the CSS file for the loading animation
import Chart from "./Chart";
import ErrorBoundary from "../common/ErrorBoundry";
import { Agent, User } from "../../store/userSlice";
import { v4 as uuidv4 } from 'uuid';

interface ChatbotResponse {
  data: {
    [key: string]: any[];
  };
  showTable: string;
  showGraph: string;
  graphType: string;
  xAxis: string;
  yAxis: string;
  response: string;
  title?: string;
}

export interface Message {
  sender: "user" | "bot";
  content: string; // HTML content for rendering
  plainText?: string; // Plain text content for copying
  liked?: boolean;
  isPinned?: boolean;
  chartData?: ChatbotResponse;
}

interface ChatbotProps {
  onClose: () => void;
  onPinMessage: (message: Message) => void;
  chatSessionId: string;
  setChatSessionId: (id: string) => void;
  assignedAgent: Agent;
  user: User;
}

const LOCAL_STORAGE_KEY = "chatbot_messages";

const Chatbot: React.FC<ChatbotProps> = ({
  onClose,
  onPinMessage,
  chatSessionId,
  setChatSessionId,
  assignedAgent,
  user,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check for browser support
  if (!browserSupportsSpeechRecognition) {
    console.error("Browser does not support speech recognition.");
  }

  // Updated suggested questions
  const suggestedQuestions = [
    {
      text: "What does my client pipeline look like?",
      icon: <FaChartLine className="text-[#4FD1C5]" />,
    },
    {
      text: "Who are my client's top contacts?",
      icon: <FaUsers className="text-[#4FD1C5]" />,
    },
    {
      text: "What is the stage of my client's real estate opportunity?",
      icon: <FaBuilding className="text-[#4FD1C5]" />,
    },
    {
      text: "What's the lifetime value of my client?",
      icon: <FaDollarSign className="text-[#4FD1C5]" />,
    },
  ];

  // Load messages from local storage when component mounts
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
      console.log("Loaded from localStorage:", storedMessages);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages) as Message[];
        setMessages(parsedMessages);
        console.log("Parsed messages:", parsedMessages);
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        console.log("Saving messages:", messages);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
        console.log("Saved to localStorage");
      }
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  }, [messages]);

  const [isLoading, setIsLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (
    e?: React.FormEvent | null,
    messageText?: string
  ) => {
    if (e) e.preventDefault();
    const message = messageText || inputValue;
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    if (!messageText) setInputValue("");
    setIsLoading(true);

    try {
      const sessionId = chatSessionId || uuidv4();
      if (!chatSessionId) {
        setChatSessionId(sessionId);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/${sessionId}`,
        {
          prompt: message,
          temperature: 0.1,
          index_name: assignedAgent.id,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.api_keys[0].key}`,
          },
        }
      );

      const data: ChatbotResponse = response.data;

      console.log("Bot response data:", data);

      // Construct the bot's response HTML
      const botResponseHTML = `
        ${data.response}
      `;

      const sanitizedHTML = DOMPurify.sanitize(botResponseHTML);

      setIsLoading(false);

      // Simulate typing effect
      let index = 0;
      const typingInterval = 20; // Adjust typing speed (ms per character)
      const interval = setInterval(() => {
        if (index < sanitizedHTML.length) {
          const currentContent = sanitizedHTML.slice(0, index + 1);
          setTypingMessage({
            sender: "bot",
            content: currentContent,
            plainText: getPlainText(currentContent),
          });
          index++;
        } else {
          // After typing effect is done, set the full content
          const finalMessage: Message = {
            sender: "bot",
            content: sanitizedHTML,
            plainText: getPlainText(sanitizedHTML),
            chartData: data,
          };

          // Add the complete message to messages
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages, finalMessage];
            console.log("Updated messages after bot response:", newMessages);
            return newMessages;
          });

          // Clear typingMessage and isTyping
          setTypingMessage(null);
          setIsTyping(false);
          clearInterval(interval);
        }
      }, typingInterval);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "**Sorry, something went wrong.**" },
      ]);
      setIsLoading(false);
      setTypingMessage(null);
    }
  };

  // Function to get plain text from HTML
  const getPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (questionText: string) => {
    handleSubmit(null, questionText);
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, typingMessage]);

  // Auto-send message after user stops speaking
  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      // Auto-send the message
      handleSubmit(null, transcript);
      resetTranscript();
    }
  }, [listening]);

  // Auto-fill input with transcript while user is speaking
  useEffect(() => {
    if (listening) {
      setInputValue(transcript);
    }
  }, [listening, transcript]);

  // Clear input when message is sent
  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      setInputValue("");
    }
  }, [listening]);

  // Handle like and dislike
  const handleLike = (index: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === index
          ? { ...msg, liked: msg.liked === true ? undefined : true }
          : msg
      )
    );
    toast.info("You liked this response.", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleDislike = (index: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === index
          ? { ...msg, liked: msg.liked === false ? undefined : false }
          : msg
      )
    );
    toast.info("You disliked this response.", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  // Add this function to handle pinning a message
  const handlePinMessage = (index: number) => {
    const messageToPin = messages[index];
    if (messageToPin.sender === "bot" && messageToPin.chartData) {
      onPinMessage(messageToPin);
      toast.success("Message pinned to dashboard!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const renderChart = (message: Message) => {
    if (!message.chartData || message.chartData.showGraph !== "TRUE") {
      return null;
    }

    const { data, graphType, xAxis, yAxis } = message.chartData;

    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      console.error("Invalid or missing data for chart");
      return <div className="text-red-500">Error: Invalid chart data</div>;
    }

    return (
      <ErrorBoundary
        fallback={<div className="text-red-500">Error rendering chart</div>}
      >
        <Chart data={data} type={graphType} xAxis={xAxis} yAxis={yAxis} />
      </ErrorBoundary>
    );
  };

  const renderContent = (content: string) => {
    // Sanitize the content first
    const sanitizedContent = DOMPurify.sanitize(content);

    // Custom markdown rendering using Tailwind CSS
    const customMarkdown = sanitizedContent
      .replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold text-[#4FD1C5]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em className="text-yellow-400">$1</em>')
      .replace(/^# (.*)/gm, '<h1 className="text-3xl font-bold text-purple-400 mt-4 mb-2">$1</h1>')
      .replace(/^## (.*)/gm, '<h2 className="text-2xl font-semibold text-purple-400 mt-3 mb-2">$1</h2>')
      .replace(/^### (.*)/gm, '<h3 className="text-xl font-medium text-purple-400 mt-2 mb-1">$1</h3>')
      .replace(/^(\d+)\. (.*)/gm, (match, number, text) => {
        const colors = ['blue-400', 'green-400', 'red-400', 'yellow-400', 'pink-400'];
        return `<div className="ml-4 my-1"><span className="text-${colors[(parseInt(number) - 1) % colors.length]} font-semibold">${number}.</span> ${text}</div>`;
      })
      .replace(/^- (.*)/gm, '<li className="ml-4 my-1 list-disc text-gray-300">$1</li>')
      .replace(/`([^`]+)`/g, '<code className="bg-gray-700 text-green-300 px-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p className="mb-4">')
      .replace(/\n/g, '<br />');

    return (
      <div className="max-w-2xl">
        <div className="overflow-hidden bg-transparent text-gray-300 self-start -mt-6">
          {parse(customMarkdown)}
        </div>
      </div>
    );
  };

  // Add this new function to clear the session
  const clearSession = () => {
    setMessages([]);
    setTypingMessage(null);
    setInputValue("");
    const newSessionId = uuidv4();
    setChatSessionId(newSessionId);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.info("Chat session cleared. Starting a new session.", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className="relative flex flex-col h-screen bg-[#000D0F]">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 bg-[#0D1B1E]">
        <h2 className="text-xl font-semibold text-[#4FD1C5]">AI Assistant</h2>
        <div className="flex items-center">
          {/* New Clear Session Button */}
          <button
            onClick={clearSession}
            className="mr-4 text-gray-300 hover:text-[#4FD1C5] transition-colors duration-200"
            aria-label="Clear session"
          >
            <IoRefresh className="w-6 h-6" />
          </button>
          {/* Existing Close Button */}
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-[#4FD1C5] transition-colors duration-200"
            aria-label="Close chatbot"
          >
            <IoClose className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#0D1B1E] custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="mt-10 text-center text-gray-300">
              <h2 className="mb-4 text-2xl font-semibold">
                Welcome to the Chatbot!
              </h2>
              <p className="mb-6">How can I assist you today?</p>
              <div className="flex flex-col items-center space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="flex items-center px-5 py-3 text-lg font-medium text-gray-300 bg-[#1A2A2F] rounded-full hover:bg-[#23383E] transition-colors duration-200 shadow-md w-full max-w-md"
                    onClick={() => handleSuggestedQuestion(question.text)}
                  >
                    <span className="mr-3 text-xl">{question.icon}</span>
                    {question.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className="flex items-start my-6">
              {/* Icon */}
              <div className="mr-4 mt-1 flex-shrink-0">
                {message.sender === "user" ? (
                  <RiUser3Fill className="text-gray-300 w-9 h-9" />
                ) : (
                  <RiRobot2Fill className="text-[#4FD1C5] w-9 h-9" />
                )}
              </div>
              {/* Message Content */}
              <div className="flex-1">
                <div
                  className={`relative px-6 py-4 rounded-2xl shadow-md ${
                    message.sender === "user"
                      ? "bg-[#1A2A2F] text-white"
                      : "bg-[#1E3A3D] text-white"
                  }`}
                >
                  {message.sender === "bot" ? (
                    <div className="prose prose-invert max-w-none">
                      {renderContent(message.content)}
                    </div>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
                {/* Action Buttons for Bot Messages */}
                {message.sender === "bot" && message.content && (
                  <div className="flex items-center mt-3 space-x-6 text-gray-300">
                    {/* Copy Button */}
                    <CopyToClipboard text={message.plainText || ""}>
                      <button
                        className="flex items-center space-x-2 hover:text-[#4FD1C5] transition-colors duration-200"
                        onClick={() =>
                          toast.success("Response copied to clipboard!", {
                            position: "top-center",
                            autoClose: 2000,
                          })
                        }
                        aria-label="Copy response"
                      >
                        <MdContentCopy className="w-5 h-5" />
                        <span className="text-sm">Copy</span>
                      </button>
                    </CopyToClipboard>

                    {/* Like Button */}
                    <button
                      className={`flex items-center space-x-2 hover:text-[#4FD1C5] transition-colors duration-200 ${
                        message.liked === true ? "text-green-400" : ""
                      }`}
                      onClick={() => handleLike(index)}
                      aria-label="Like response"
                    >
                      <MdOutlineThumbUp className="w-5 h-5" />
                      <span className="text-sm">Like</span>
                    </button>

                    {/* Dislike Button */}
                    <button
                      className={`flex items-center space-x-2 hover:text-[#4FD1C5] transition-colors duration-200 ${
                        message.liked === false ? "text-red-400" : ""
                      }`}
                      onClick={() => handleDislike(index)}
                      aria-label="Dislike response"
                    >
                      <MdOutlineThumbDown className="w-5 h-5" />
                      <span className="text-sm">Dislike</span>
                    </button>

                    {/* Pin Button */}
                    {message.chartData &&
                      message.chartData.showGraph === "TRUE" && (
                        <button
                          className={`flex items-center space-x-2 hover:text-[#4FD1C5] transition-colors duration-200 ${
                            message.isPinned ? "text-yellow-400" : ""
                          }`}
                          onClick={() => handlePinMessage(index)}
                          aria-label="Pin to dashboard"
                        >
                          <BsPinAngleFill className="w-5 h-5" />
                          <span className="text-sm">Pin</span>
                        </button>
                      )}
                  </div>
                )}
                {message.chartData &&
                  message.chartData.showGraph === "TRUE" && (
                    <ErrorBoundary
                      fallback={
                        <div className="text-red-500">
                          Error rendering chart
                        </div>
                      }
                    >
                      <div className="mt-2">{renderChart(message)}</div>
                    </ErrorBoundary>
                  )}
              </div>
            </div>
          ))}

          {/* Render loading animation or typing message */}
          {(isLoading || typingMessage) && (
            <div className="flex items-start my-6">
              <div className="mr-4 mt-1 flex-shrink-0">
                <RiRobot2Fill className="text-[#4FD1C5] w-9 h-9" />
              </div>
              <div className="flex-1">
                <div className="relative px-6 py-4 rounded-2xl bg-[#1E3A3D] text-white">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="dot-flashing ml-4"></div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {renderContent(typingMessage!.content)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0D1B1E]">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex items-center max-w-3xl mx-auto px-4"
        >
          <input
            type="text"
            className="flex-1 px-5 py-3 bg-[#1A2A2F] text-white placeholder-gray-400 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4FD1C5] shadow-inner"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || !!typingMessage}
          />

          {/* Microphone Button */}
          <button
            type="button"
            className={`p-3 ml-3 rounded-full ${
              listening ? "bg-[#4FD1C5] text-white" : "bg-[#1A2A2F] text-white"
            } hover:bg-[#23383E] focus:outline-none focus:ring-2 focus:ring-[#4FD1C5] transition-colors duration-200 shadow-md ${
              isLoading || !!typingMessage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (!isLoading && !typingMessage) {
                if (listening) {
                  SpeechRecognition.stopListening();
                } else {
                  SpeechRecognition.startListening({ continuous: true });
                }
              }
            }}
            disabled={isLoading || !!typingMessage}
            aria-label="Voice input"
          >
            <IoMic className="w-6 h-6" />
          </button>

          {/* Send Button with Icon */}
          <button
            type="submit"
            className="p-3 ml-3 text-white bg-[#4FD1C5] rounded-full hover:bg-[#38B2AC] focus:outline-none focus:ring-2 focus:ring-[#4FD1C5] disabled:opacity-50 transition-colors duration-200 shadow-md"
            disabled={isLoading || !!typingMessage}
            aria-label="Send message"
          >
            <IoSend className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Chatbot;