// src/components/Portfolio.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PortfolioItem } from "../../data/dummyData";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface PortfolioProps {
  data: PortfolioItem[];
}

interface StockPrice {
  symbol: string;
  close: number;
  date: string;
}

type SortKey = "symbol" | "shares" | "avgCost" | "currentPrice" | "totalValue" | "pnl" | "percentChange";
type SortOrder = "asc" | "desc";

const Portfolio: React.FC<PortfolioProps> = ({ data }) => {
  const [stockPrices, setStockPrices] = useState<{
    [key: string]: { current: number; previous: number };
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const fetchStockPrices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endDate = new Date();
        endDate.setHours(0, 0, 0, 0); // Set to the start of today
        let startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7); // Go back 7 days to ensure we get some market data

        const promises = data.map((item) =>
          axios.post(
            "https://ath-backend-dev-365030887593.us-central1.run.app/api/ticker/history",
            {
              symbol: item.symbol,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              interval: "1d",
            }
          )
        );

        const responses = await Promise.all(promises);
        const prices: { [key: string]: { current: number; previous: number } } = {};
        responses.forEach((response, index) => {
          const stockData = response.data.data as StockPrice[];
          if (stockData.length >= 2) {
            prices[data[index].symbol] = {
              current: stockData[stockData.length - 1].close,
              previous: stockData[stockData.length - 2].close,
            };
          }
        });

        setStockPrices(prices);
      } catch (err) {
        setError("Failed to fetch stock prices");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockPrices();
  }, [data]);

  const calculateTotalValue = (item: PortfolioItem) => {
    const currentPrice = stockPrices[item.symbol]?.current || item.avgCost;
    return item.shares * currentPrice;
  };

  const calculatePnL = (item: PortfolioItem) => {
    const currentPrice = stockPrices[item.symbol]?.current || item.avgCost;
    return (currentPrice - item.avgCost) * item.shares;
  };

  const calculatePercentChange = (item: PortfolioItem) => {
    const currentPrice = stockPrices[item.symbol]?.current;
    const previousPrice = stockPrices[item.symbol]?.previous;
    if (!currentPrice || !previousPrice) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  };

  const calculateTotalPercentChange = () => {
    const totalPreviousValue = data.reduce((total, item) => {
      const previousPrice = stockPrices[item.symbol]?.previous || item.avgCost;
      return total + (previousPrice * item.shares);
    }, 0);

    const totalCurrentValue = data.reduce((total, item) => {
      const currentPrice = stockPrices[item.symbol]?.current || item.avgCost;
      return total + (currentPrice * item.shares);
    }, 0);

    return ((totalCurrentValue - totalPreviousValue) / totalPreviousValue) * 100;
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue, bValue;
    switch (sortKey) {
      case "symbol":
        return sortOrder === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      case "shares":
        return sortOrder === "asc" ? a.shares - b.shares : b.shares - a.shares;
      case "avgCost":
        return sortOrder === "asc" ? a.avgCost - b.avgCost : b.avgCost - a.avgCost;
      case "currentPrice":
        aValue = stockPrices[a.symbol]?.current || a.avgCost;
        bValue = stockPrices[b.symbol]?.current || b.avgCost;
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      case "totalValue":
        aValue = calculateTotalValue(a);
        bValue = calculateTotalValue(b);
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      case "pnl":
        aValue = calculatePnL(a);
        bValue = calculatePnL(b);
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      case "percentChange":
        aValue = calculatePercentChange(a);
        bValue = calculatePercentChange(b);
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      default:
        return 0;
    }
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (columnKey !== sortKey) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (isLoading) return <div className="text-white">Loading portfolio data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const totalPortfolioValue = sortedData.reduce((total, item) => total + calculateTotalValue(item), 0);
  const totalPnL = sortedData.reduce((total, item) => total + calculatePnL(item), 0);
  const totalPercentChange = calculateTotalPercentChange();

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">Portfolio</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#8B9DA7]">
          <thead className="text-xs uppercase bg-[#2C3E50] text-[#4FD1C5]">
            <tr>
              {[
                { key: "symbol", label: "Symbol" },
                { key: "shares", label: "Shares" },
                { key: "avgCost", label: "Buy Price" },
                { key: "currentPrice", label: "Current Price" },
                { key: "totalValue", label: "Total Value" },
                { key: "pnl", label: "P/L" },
                { key: "percentChange", label: "% Change" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center">
                    {label}
                    <span className="ml-1">
                      <SortIcon columnKey={key as SortKey} />
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.symbol} className="border-b border-[#2C3E50]">
                <td className="px-6 py-4 font-medium text-white">{item.symbol}</td>
                <td className="px-6 py-4">{item.shares}</td>
                <td className="px-6 py-4">${item.avgCost.toFixed(2)}</td>
                <td className="px-6 py-4">
                  ${(stockPrices[item.symbol]?.current || item.avgCost).toFixed(2)}
                </td>
                <td className="px-6 py-4">${calculateTotalValue(item).toFixed(2)}</td>
                <td className={`px-6 py-4 ${calculatePnL(item) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${calculatePnL(item).toFixed(2)}
                </td>
                <td className={`px-6 py-4 ${calculatePercentChange(item) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {calculatePercentChange(item).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#2C3E50] font-bold">
              <td className="px-6 py-4 text-white">Total</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">${totalPortfolioValue.toFixed(2)}</td>
              <td className="px-6 py-4">${totalPnL.toFixed(2)}</td>
              <td className="px-6 py-4">{totalPercentChange.toFixed(2)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;