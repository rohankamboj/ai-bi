import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import {
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaTimes,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import { getUsers, User } from "../../data/dummyData";
import UserSelector from "./UserSelector";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Portfolio from "./Portfolio";
import Watchlist from "./Watchlist";
import PnLLineChart from "./PnLLineChart";
import SectorPieChart from "./SectorPieChart";
import AssetAllocationChart from "./AssetAllocationChart";
import TopGainersLosers from "./TopGainersLosers";
import RecentTransactions from "./RecentTransactions";
import MarketSentimentIndicator from "./MarketSentimentIndicator";
import EconomicCalendar from "./EconomicCalendar";
import ChatbotIcon from "../common/ChatbotIcon";
import { Message } from "../chatbot/Chatbot";
import Chart from "../chatbot/Chart";
import ErrorBoundary from "../common/ErrorBoundry";

interface UserDashboardProps {
  isSidebarCollapsed: boolean;
  dashboardConfig: {
    name: string;
  };
  updateDashboard: (newConfig: any) => void;
  handleLogout: () => void;
}

interface PinnedMessage extends Message {
  editableTitle?: string;
  isEditing?: boolean;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  isSidebarCollapsed,
  dashboardConfig,
  updateDashboard,
  handleLogout,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string>(uuid());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        console.log(fetchedUsers);
        setUsers(fetchedUsers);
        if (fetchedUsers.length > 0) {
          setSelectedUserId(fetchedUsers[0].id);
          setSelectedUser(fetchedUsers[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const user = users.find((u) => u.id === selectedUserId);
    setSelectedUser(user || null);
  }, [selectedUserId, users]);

  useEffect(() => {
    const fetchNasdaqAlerts = async () => {
      try {
        const response = await fetch('https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=7OyGr60eC7dE4KMajn6BPK6rILni97xX');
        const data = await response.json();
        const alerts = data.slice(0, 5).map((stock: any) => `${stock.symbol}: ${stock.changesPercentage.toFixed(2)}%`);
        setNotifications(alerts);
        setHasNewNotifications(true);
      } catch (error) {
        console.error("Error fetching Nasdaq alerts:", error);
      }
    };

    fetchNasdaqAlerts();
    const interval = setInterval(fetchNasdaqAlerts, 1800000); // Fetch every 30 minutes

    return () => clearInterval(interval);
  }, []);

  const handlePinMessage = (message: Message) => {
    setPinnedMessages((prev) => [
      ...prev,
      {
        ...message,
        editableTitle: message.chartData?.title || "Pinned Chart",
        isEditing: false,
      },
    ]);
  };

  const handleUnpinMessage = (index: number) => {
    setPinnedMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditTitle = (index: number) => {
    setPinnedMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, isEditing: true } : msg))
    );
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    setPinnedMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, editableTitle: newTitle } : msg
      )
    );
  };

  const handleSaveTitle = (index: number) => {
    setPinnedMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, isEditing: false } : msg))
    );
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotifications(false);
  };

  const dashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#4FD1C5]"></div>
        </div>
      );
    }

    if (!selectedUser) {
      return (
        <div className="flex justify-center items-center h-screen text-[#4FD1C5]">
          No user data available
        </div>
      );
    }

    return (
      <>
        {/* Enhanced Header */}
        <header className="bg-[#1A2A2F] p-4 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#4FD1C5]">
                {dashboardConfig.name}
              </h1>
              <UserSelector
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={setSelectedUserId}
              />
            </div>
            <div className="flex items-center space-x-4 justify-center">
              <div className="relative mt-2">
                <button 
                  className={`text-[#8B9DA7] hover:text-[#4FD1C5] transition-colors ${hasNewNotifications ? 'animate-pulse' : ''}`}
                  onClick={toggleNotifications}
                >
                  <FaBell size={20} />
                  {hasNewNotifications && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1A2A2F] border border-[#4FD1C5] rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <h3 className="text-[#4FD1C5] font-bold mb-2">Nasdaq Alerts</h3>
                      {notifications.map((notification, index) => (
                        <div key={index} className="text-white mb-1">{notification}</div>
                      ))}
                      <p className="text-[#8B9DA7] text-sm mt-2">Top 5 gainers in the last 24 hours</p>
                    </div>
                  </div>
                )}
              </div>
              <button className="text-[#8B9DA7] hover:text-[#4FD1C5] transition-colors">
                <FaCog size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="bg-[#4FD1C5] text-[#1A2A2F] px-4 py-2 rounded-full hover:bg-[#3AB0A1] transition-colors flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-8">
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Analytics Dashboard
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-4">
              <AnalyticsDashboard data={selectedUser.portfolioData || []} />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Market Sentiment Indicator
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-4">
              <MarketSentimentIndicator />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Economic Calendar
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-4">
              <EconomicCalendar
                data={selectedUser.economicCalendarData || []}
              />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-8 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Portfolio
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-8">
              <Portfolio data={selectedUser.portfolioData || []} />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Watchlist
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-4">
              <Watchlist />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-8 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading PnL Line Chart
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-8">
              <PnLLineChart data={selectedUser.pnlLineData || []} />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 lg:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Sector Pie Chart
              </div>
            }
          >
            <div className="col-span-12 lg:col-span-4">
              <SectorPieChart data={selectedUser.sectorData || []} />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 md:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Asset Allocation Chart
              </div>
            }
          >
            <div className="col-span-12 md:col-span-4">
              <AssetAllocationChart
                data={selectedUser.assetAllocationData || []}
              />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 md:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Top Gainers/Losers
              </div>
            }
          >
            <div className="col-span-12 md:col-span-4">
              <TopGainersLosers />
            </div>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="col-span-12 md:col-span-4 bg-[#1A2A2F] p-4 rounded-lg">
                Error loading Recent Transactions
              </div>
            }
          >
            <div className="col-span-12 md:col-span-4">
              <RecentTransactions
                data={selectedUser.recentTransactionsData || []}
              />
            </div>
          </ErrorBoundary>
        </div>

        {/* Pinned Messages */}
        <div className="grid grid-cols-12 gap-8">
          {pinnedMessages.map((message, index) => (
            <div
              key={index}
              className={`col-span-12 ${
                index % 3 === 2 ? "lg:col-span-12" : "lg:col-span-6"
              } my-8`}
            >
              <div className="bg-[#1A2A2F] p-4 rounded-lg shadow-lg relative h-full">
                <div className="flex justify-between items-center mb-2">
                  {message.isEditing ? (
                    <input
                      type="text"
                      value={message.editableTitle}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      className="bg-[#2A3F44] text-white px-2 py-1 rounded"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-[#4FD1C5]">
                      {message.editableTitle}
                    </h3>
                  )}
                  <div>
                    {message.isEditing ? (
                      <button
                        onClick={() => handleSaveTitle(index)}
                        className="text-[#4FD1C5] hover:text-white transition-colors duration-200 mr-2"
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditTitle(index)}
                        className="text-[#4FD1C5] hover:text-white transition-colors duration-200 mr-2"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleUnpinMessage(index)}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label="Unpin chart"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                {message.chartData && message.chartData.showGraph === "TRUE" && (
                  <ErrorBoundary fallback={<div className="text-red-500">Error rendering chart</div>}>
                    <Chart
                      data={message.chartData.data}
                      type={message.chartData.graphType}
                      xAxis={message.chartData.xAxis}
                      yAxis={message.chartData.yAxis}
                    />
                  </ErrorBoundary>
                )}
              </div>
            </div>
          ))}
        </div>

        <ChatbotIcon 
          onPinMessage={handlePinMessage}
          chatSessionId={chatSessionId}
          setChatSessionId={setChatSessionId}
          selectedUser={selectedUser as User} // Type assertion here
        />
      </>
    );
  };

  return (
    <div
      className={`flex-grow transition-all duration-300 ease-in-out p-6 overflow-x-hidden min-h-screen ${
        isSidebarCollapsed ? "ml-16" : "ml-64"
      } bg-[#000D0F]`}
    >
      {dashboardContent()}
    </div>
  );
};

export default UserDashboard;