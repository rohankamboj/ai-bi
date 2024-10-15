// src/components/charts/RadarChart.tsx

import React, { useState } from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../../constants/colors"; // Adjust the path as necessary

interface RadarChartProps {
  data: { [key: string]: any }[]; // Handle multiple data keys
  dataKeys: string[];
  nameKey: string;
  xLabel?: string;
  yLabel?: string;
  height?: number; // Optional: default height
}

// Custom Tooltip Component using Tailwind CSS
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black bg-opacity-80 p-3 border border-gray-300 rounded-md text-white text-sm">
        <p className="font-semibold mb-1">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="mb-0.5" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main AdvancedRadarChart Component
const AdvancedRadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKeys,
  nameKey,
  xLabel = "",
  yLabel = "",
  height = "100%", // Default height if not provided
}) => {
  // Check if data is empty or undefined
  if (!data || data.length === 0 || !dataKeys || dataKeys.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center text-gray-600">
        <p>No data available for radar chart</p>
      </div>
    );
  }

  // State to manage active Radar (for hover effects)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // State to manage visibility of each Radar
  const [visibleRadars, setVisibleRadars] = useState<Record<string, boolean>>(
    dataKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  // Calculate min and max values from data for dynamic domain
  const allValues = data.flatMap((item) =>
    dataKeys.map((key) => Number(item[key]))
  );
  const minValue = Math.min(...allValues, 0); // Ensure at least 0
  const maxValue = Math.max(...allValues, 100); // Ensure at least 100

  // Function to handle mouse enter on Radar
  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  // Function to handle mouse leave from Radar
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Function to handle legend item click for toggling visibility
  const handleLegendClick = (data: any) => {
    const { value } = data;
    setVisibleRadars((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  return (
    <div className="relative w-full h-full">
      {/* Labels Positioned Outside the Chart */}
      {xLabel && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm">
          {xLabel}
        </div>
      )}
      {yLabel && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm">
          {yLabel}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="70%" // Reduced to provide more space for labels
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 40 }} // Increased bottom margin for xLabel
        >
          {/* Define Gradients for Each Data Key */}
          <defs>
            {dataKeys.map((key, index) => (
              <linearGradient
                key={`gradient-${key}`}
                id={`colorGradient-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0.6} // Increased opacity for better visibility
                />
                <stop
                  offset="95%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0.1} // Lower opacity for gradient effect
                />
              </linearGradient>
            ))}
          </defs>

          {/* Enhanced Polar Grid */}
          <PolarGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          {/* Polar Angle Axis Configuration */}
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fontSize: 12, fill: "#666" }}
            stroke="#666"
            tickLine={{ stroke: "#666", strokeWidth: 1 }}
          />

          {/* Polar Radius Axis Configuration */}
          <PolarRadiusAxis
            angle={30}
            domain={[minValue, maxValue]} // Dynamic domain based on data
            tick={{ fontSize: 12, fill: "#666" }}
            stroke="#666"
            tickLine={{ stroke: "#666", strokeWidth: 1 }}
          />

          {/* Customized Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Enhanced Legend with Click Interactivity */}
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 12, cursor: "pointer" }}
            onClick={handleLegendClick}
            payload={dataKeys.map((key, index) => ({
              id: key,
              type: "square",
              value: key,
              color: COLORS[index % COLORS.length],
            }))}
          />

          {/* Radar Rendering with Gradient Fills and Interactivity */}
          {dataKeys.map((key, index) =>
            visibleRadars[key] ? (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fill={`url(#colorGradient-${key})`}
                fillOpacity={
                  activeIndex === index || activeIndex === null ? 0.6 : 0.1
                }
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                isAnimationActive={true}
              />
            ) : null
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvancedRadarChart;
