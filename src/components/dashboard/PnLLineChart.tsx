// src/components/PnLLineChart.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { PnLLineItem } from '../../data/dummyData';

interface PnLLineChartProps {
  data: PnLLineItem[];
}

const PnLLineChart: React.FC<PnLLineChartProps> = ({ data }) => {
  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">PnL Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
          <XAxis 
            dataKey="date" 
            stroke="#8B9DA7"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#8B9DA7"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#233239', border: 'none', borderRadius: '4px' }}
            labelStyle={{ color: '#8B9DA7' }}
            itemStyle={{ color: '#4FD1C5' }}
          />
          <Legend 
            wrapperStyle={{ color: '#8B9DA7', fontSize: '12px' }}
          />
          <Line 
            type="monotone" 
            dataKey="pnl" 
            name="PnL ($)" 
            stroke="#4FD1C5" 
            strokeWidth={2}
            dot={{ fill: '#4FD1C5', stroke: '#4FD1C5', strokeWidth: 2 }}
            activeDot={{ r: 8, fill: '#3AB0A1', stroke: '#4FD1C5', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PnLLineChart;
