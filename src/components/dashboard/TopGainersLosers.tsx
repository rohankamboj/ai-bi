import React, { useEffect, useState } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

const TopGainersLosers: React.FC = () => {
  const [topGainers, setTopGainers] = useState<
    Array<{ symbol: string; change: number }>
  >([]);
  const [topLosers, setTopLosers] = useState<
    Array<{ symbol: string; change: number }>
  >([]);

  useEffect(() => {
    const fetchTopGainersLosers = async () => {
      try {
        // Nasdaq 100 symbols
        const nasdaq100Symbols = [
          "AAPL",
          "MSFT",
          "AMZN",
          "GOOGL",
          "FB",
          "TSLA",
          "NVDA",
          "PYPL",
          "ADBE",
          "NFLX",
          "CMCSA",
          "CSCO",
          "PEP",
          "AVGO",
          "COST",
          "INTC",
          "TMUS",
          "TXN",
          "QCOM",
          "AMGN",
          // ... Add more Nasdaq 100 symbols as needed
        ];

        const quotes = await Promise.all(
          nasdaq100Symbols.map(async (symbol) => {
            const quoteResponse = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cqkg1r9r01qn35a9isj0cqkg1r9r01qn35a9isjg`
            );
            const quoteData = await quoteResponse.json();
            return { symbol: symbol, change: quoteData.dp };
          })
        );

        const sortedQuotes = quotes.sort((a, b) => b.change - a.change);
        setTopGainers(sortedQuotes.slice(0, 5));
        setTopLosers(sortedQuotes.slice(-5).reverse());
      } catch (error) {
        console.error("Error fetching top gainers and losers:", error);
      }
    };

    fetchTopGainersLosers();
    const interval = setInterval(fetchTopGainersLosers, 1800000); // Refresh every 30 minutes

    return () => clearInterval(interval);
  }, []);

  const renderList = (
    items: Array<{ symbol: string; change: number }>,
    isGainer: boolean
  ) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex justify-between items-center p-2 rounded bg-[#243B53] hover:bg-[#2D4A6A] transition-colors duration-200"
        >
          <span className="text-white font-medium">{item.symbol}</span>
          <span
            className={`flex items-center ${
              isGainer ? "text-green-400" : "text-red-400"
            }`}
          >
            {isGainer ? (
              <FaCaretUp className="mr-1" />
            ) : (
              <FaCaretDown className="mr-1" />
            )}
            <span className="font-bold">
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">
        Nasdaq 100 Top 5 Gainers & Losers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Top Gainers
          </h3>
          {renderList(topGainers, true)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-4">
            Top Losers
          </h3>
          {renderList(topLosers, false)}
        </div>
      </div>
    </div>
  );
};

export default TopGainersLosers;
