import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowUp, FaArrowDown, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface WatchlistItem {
  symbol: string;
  currentPrice: number | null;
  priceChange: number | null;
  percentChange: number | null;
  loading: boolean;
}

const fetchHistoricalPrice = async (symbol: string): Promise<{ price: number; change: number; percentChange: number }> => {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0); // Set to the start of today
  let startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7); // Go back 7 days to ensure we get some market data

  try {
    const response = await axios.post('https://ath-backend-dev-365030887593.us-central1.run.app/api/ticker/history', {
      symbol,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      interval: '1d'
    });

    const priceData = response.data.data;
    if (!priceData || priceData.length < 2) {
      throw new Error(`Insufficient price data available for ${symbol}`);
    }

    // Get the last two available data points
    const currentPrice = priceData[priceData.length - 1].close;
    const previousPrice = priceData[priceData.length - 2].close;
    const change = currentPrice - previousPrice;
    const percentChange = (change / previousPrice) * 100;

    return { price: currentPrice, change, percentChange };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
};

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { symbol: 'AAPL', currentPrice: null, priceChange: null, percentChange: null, loading: true },
    { symbol: 'GOOGL', currentPrice: null, priceChange: null, percentChange: null, loading: true }
  ]);
  const [newSymbol, setNewSymbol] = useState('');

  const saveWatchlist = useCallback((list: WatchlistItem[]) => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(list));
      console.log('Watchlist saved to localStorage:', list);
    } catch (error) {
      console.error('Error saving watchlist to localStorage:', error);
      toast.error('Failed to save watchlist to storage');
    }
  }, []);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const savedWatchlist = localStorage.getItem('watchlist');
        console.log('Saved watchlist from localStorage:', savedWatchlist);
        if (savedWatchlist) {
          const parsedWatchlist = JSON.parse(savedWatchlist) as WatchlistItem[];
          console.log('Parsed watchlist:', parsedWatchlist);
          setWatchlist(parsedWatchlist);
        }
        // Refresh data for all items (including default ones if no saved watchlist)
        watchlist.forEach((item: WatchlistItem) => {
          refreshItemData(item.symbol);
        });
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
        toast.error('Failed to load watchlist from storage');
      }
    };

    loadWatchlist();
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      saveWatchlist(watchlist);
    }
  }, [watchlist, saveWatchlist]);

  const refreshItemData = async (symbol: string) => {
    try {
      const { price, change, percentChange } = await fetchHistoricalPrice(symbol);
      setWatchlist(prevList => {
        const newList = prevList.map(item =>
          item.symbol === symbol
            ? { ...item, currentPrice: price, priceChange: change, percentChange, loading: false }
            : item
        );
        saveWatchlist(newList);
        return newList;
      });
    } catch (error) {
      console.error(`Error refreshing data for ${symbol}:`, error);
      setWatchlist(prevList => {
        const newList = prevList.map(item =>
          item.symbol === symbol
            ? { ...item, loading: false }
            : item
        );
        saveWatchlist(newList);
        return newList;
      });
    }
  };

  const handleAddSymbol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol) return;

    const symbol = newSymbol.toUpperCase();
    
    // Check if symbol already exists in the watchlist
    if (watchlist.some(item => item.symbol === symbol)) {
      toast.warning(`${symbol} is already in your watchlist`);
      setNewSymbol('');
      return;
    }

    // Add the symbol to the UI immediately
    const newItem = { symbol, currentPrice: null, priceChange: null, percentChange: null, loading: true };
    setWatchlist(prevList => {
      const newList = [...prevList, newItem];
      saveWatchlist(newList);
      return newList;
    });
    
    // Clear the input
    setNewSymbol('');

    try {
      const { price, change, percentChange } = await fetchHistoricalPrice(symbol);
      setWatchlist(prevList => {
        const newList = prevList.map(item =>
          item.symbol === symbol
            ? { ...item, currentPrice: price, priceChange: change, percentChange, loading: false }
            : item
        );
        saveWatchlist(newList);
        return newList;
      });
      toast.success(`Added ${symbol} to watchlist`);
    } catch (error) {
      console.error('Error adding symbol:', error);
      toast.error(`Failed to fetch data for ${symbol}. It will be displayed without price information.`);
      setWatchlist(prevList => {
        const newList = prevList.map(item =>
          item.symbol === symbol
            ? { ...item, loading: false }
            : item
        );
        saveWatchlist(newList);
        return newList;
      });
    }
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    setWatchlist(prevList => {
      const newList = prevList.filter(item => item.symbol !== symbolToRemove);
      saveWatchlist(newList);
      return newList;
    });
    toast.info(`Removed ${symbolToRemove} from watchlist`);
  };

  console.log('Current watchlist state:', watchlist);

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-[408px] overflow-y-auto flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">Portfolio Pulse</h2>
      
      <form onSubmit={handleAddSymbol} className="mb-4 flex">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Enter symbol (e.g., AAPL)"
          className="flex-grow p-2 bg-[#233239] text-white rounded-l"
        />
        <button
          type="submit"
          className="bg-[#4FD1C5] text-[#1A2A2F] px-4 py-2 rounded-r hover:bg-[#3AB0A1] transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add
        </button>
      </form>

      {watchlist.length === 0 ? (
        <p className="text-[#4FD1C5] text-center">No stocks in watchlist</p>
      ) : (
        <ul className="space-y-4 overflow-y-auto">
          {watchlist.map((item) => (
            <li key={item.symbol} className="bg-[#233239] p-4 rounded-lg hover:bg-[#2C3E50] transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[#4FD1C5] font-bold text-lg">{item.symbol}</span>
                <button
                  onClick={() => handleRemoveSymbol(item.symbol)}
                  className="text-[#8B9DA7] hover:text-red-500 transition-colors duration-200"
                >
                  <FaTimes />
                </button>
              </div>
              {item.loading ? (
                <div className="mt-2 text-white">Loading...</div>
              ) : item.currentPrice === null ? (
                <div className="mt-2 text-white">Price data unavailable</div>
              ) : (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white font-semibold text-lg">${item.currentPrice.toFixed(2)}</span>
                  <div className={`flex items-center ${item.priceChange! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.priceChange! >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    <span>${Math.abs(item.priceChange!).toFixed(2)} ({Math.abs(item.percentChange!).toFixed(2)}%)</span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;