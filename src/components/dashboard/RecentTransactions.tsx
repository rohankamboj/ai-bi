import React from 'react';
import { FaArrowUp, FaArrowDown, FaClock } from 'react-icons/fa';
import { TransactionData } from '../../data/dummyData';

interface RecentTransactionsProps {
  data: TransactionData[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ data }) => {
  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg flex flex-col h-[400px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">Recent Transactions</h2>
      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-4">
          {data.map((transaction, index) => (
            <li key={index} className="bg-[#243B53] p-4 rounded-lg hover:bg-[#2D4A6A] transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {transaction.type === 'buy' ? (
                    <FaArrowUp className="text-green-400 mr-2" />
                  ) : (
                    <FaArrowDown className="text-red-400 mr-2" />
                  )}
                  <span className="text-white font-medium">{transaction.symbol}</span>
                </div>
                <span className={`text-sm font-bold ${transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[#8B9DA7] text-sm">{transaction.shares} shares @ ${transaction.price.toFixed(2)}</p>
                  <p className="text-white font-medium">${(transaction.shares * transaction.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center text-[#8B9DA7] text-sm">
                  <FaClock className="mr-1" />
                  <span>{new Date(transaction.date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentTransactions;