import React, { useEffect, useState } from "react";
import { PortfolioItem } from "../../data/dummyData";
import {
  FaDollarSign,
  FaChartLine,
  FaPercent,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";

interface AnalyticsDashboardProps {
  data: PortfolioItem[];
}

interface PriceData {
  date: string;
  close: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const [showValues, setShowValues] = useState({
    totalValue: true,
    totalPnL: true,
    percentChange: true,
  });
  const [analyticsData, setAnalyticsData] = useState({
    totalValue: 0,
    totalPnL: 0,
    percentChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleValue = (key: keyof typeof showValues) => {
    setShowValues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchCurrentPrice = async (
    symbol: string
  ): Promise<{ current: number; previous: number }> => {
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // Set to the start of today
    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7); // Go back 7 days to ensure we get some market data

    const response = await axios.post(
      "https://ath-backend-dev-365030887593.us-central1.run.app/api/ticker/history",
      {
        symbol,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        interval: "1d",
      }
    );

    const priceData: PriceData[] = response.data.data;
    if (priceData.length < 2) {
      throw new Error(`Insufficient price data for ${symbol}`);
    }
    const current = priceData[priceData.length - 1].close;
    const previous = priceData[priceData.length - 2].close;

    return { current, previous };
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let totalValue = 0;
        let totalPnL = 0;
        let totalPreviousValue = 0;

        const promises = data.map((stock) => fetchCurrentPrice(stock.symbol));
        const results = await Promise.all(promises);

        results.forEach((result, index) => {
          const stock = data[index];
          const { current, previous } = result;
          const stockValue = stock.shares * current;
          const previousStockValue = stock.shares * previous;
          totalValue += stockValue;
          totalPnL += stockValue - stock.shares * stock.avgCost;
          totalPreviousValue += previousStockValue;
        });

        const percentChange = ((totalValue - totalPreviousValue) / totalPreviousValue) * 100;

        setAnalyticsData({
          totalValue,
          totalPnL,
          percentChange,
        });
      } catch (err) {
        setError("Failed to fetch analytics data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [data]);

  if (isLoading) return <div className="text-white">Loading analytics data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-[#1A2A2F] p-4 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold mb-4 text-[#4FD1C5]">
        Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <AnalyticsCard
          title="Total Portfolio Value"
          value={`$${analyticsData.totalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<FaDollarSign />}
          color="text-emerald-400"
          showValue={showValues.totalValue}
          onToggleValue={() => toggleValue("totalValue")}
        />
        <div className="grid grid-cols-2 gap-4">
          <AnalyticsCard
            title="Total PnL"
            value={`$${analyticsData.totalPnL.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<FaChartLine />}
            color={
              analyticsData.totalPnL >= 0 ? "text-green-400" : "text-red-400"
            }
            showValue={showValues.totalPnL}
            onToggleValue={() => toggleValue("totalPnL")}
          />
          <AnalyticsCard
            title="Percent Change"
            value={`${analyticsData.percentChange.toFixed(2)}%`}
            icon={<FaPercent />}
            color={
              analyticsData.percentChange >= 0 ? "text-green-400" : "text-red-400"
            }
            additionalIcon={
              analyticsData.percentChange >= 0 ? <FaArrowUp /> : <FaArrowDown />
            }
            showValue={showValues.percentChange}
            onToggleValue={() => toggleValue("percentChange")}
          />
        </div>
      </div>
    </div>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  additionalIcon?: React.ReactNode;
  className?: string;
  showValue: boolean;
  onToggleValue: () => void;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon,
  color,
  additionalIcon,
  className,
  showValue,
  onToggleValue,
}) => (
  <div
    className={`bg-[#1E2A3A] p-6 rounded-xl shadow-lg border border-[#2C3E50] transition-all duration-300 hover:shadow-xl hover:border-[#4FD1C5] ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div className="flex items-center space-x-2">
        {additionalIcon && (
          <div className={`text-2xl ${color}`}>{additionalIcon}</div>
        )}
        <button
          onClick={onToggleValue}
          className="text-[#8B9DA7] hover:text-[#4FD1C5] transition-colors"
        >
          {showValue ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
    <p className="text-[#8B9DA7] mb-2 text-sm font-medium truncate">{title}</p>
    <p className={`text-2xl font-bold ${color} truncate`}>
      {showValue ? value : "••••••"}
    </p>
  </div>
);

export default AnalyticsDashboard;