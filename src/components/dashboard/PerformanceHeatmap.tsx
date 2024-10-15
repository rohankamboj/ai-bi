import React, { useMemo } from 'react';
import HeatMapChart from '../charts/HeatMapChart';
import { PerformanceData } from '../../data/dummyData';

interface PerformanceHeatmapProps {
  data: PerformanceData[];
}

const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({ data }) => {
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const dayMap = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
    const monthMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4 };
    return data.map(item => ({
      x: monthMap[item.month as keyof typeof monthMap],
      y: dayMap[item.day as keyof typeof dayMap] - 1, // Subtract 1 to make it 0-indexed
      value: Math.round((item.value + 0.05) * 1000) // Convert from -5% to 5% to 0 to 100
    }));
  }, [data]);

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-2xl font-bold mb-6 text-[#4FD1C5]">Performance Heatmap</h2>
      <div className="flex-grow" style={{ width: "100%", height: "400px", position: "relative" }}>
        <HeatMapChart
          data={formattedData}
          xLabel="Month"
          yLabel="Day"
          valueLabel="Performance"
        />
      </div>
    </div>
  );
};

export default PerformanceHeatmap;
