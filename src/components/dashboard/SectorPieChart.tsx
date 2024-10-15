import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { SectorItem } from '../../data/dummyData';

interface SectorPieChartProps {
  data: SectorItem[];
}

const COLORS = ['#4FD1C5', '#38B2AC', '#319795', '#2C7A7B', '#285E61', '#234E52'];

const SectorPieChart: React.FC<SectorPieChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#4FD1C5" className="text-lg font-bold">
          {payload.sector}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#4FD1C5" className="text-md">
          {`$${payload.value.toLocaleString()}`}
        </text>
        <text x={cx} y={cy} dy={45} textAnchor="middle" fill="#8B9DA7" className="text-sm">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">Sector Distribution</h2>
      <div className="flex-grow flex">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 flex flex-col justify-center">
          {data.map((entry, index) => (
            <div 
              key={`legend-${index}`} 
              className="flex items-center mb-2 cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div 
                className="w-4 h-4 mr-2 rounded-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-[#8B9DA7]">
                {entry.sector}: ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorPieChart;

