// src/components/charts/AdvancedAreaChart.tsx

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { COLORS } from "../../constants/colors";
// Define the props interface
interface AdvancedAreaChartProps {
  data: Array<{ [key: string]: any }>;
  dataKeys: string[];
  xAxisDataKey: string;
  xLabel?: string;
  yLabel?: string;
  height?: number; // Optional: default height
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          color: "white",
        }}
      >
        <p>{`${format(new Date(label), "dd MMM yyyy HH:mm")}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color, margin: 0 }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main AdvancedAreaChart Component
const AdvancedAreaChart: React.FC<AdvancedAreaChartProps> = ({
  data,
  dataKeys,
  xAxisDataKey,
  xLabel = "",
  yLabel = "",
  height = 300, // Default height if not provided
}) => {
  // Function to format X-Axis labels
  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem), "dd MMM"); // e.g., "01 Jan"
  };

  // Function to determine Y-Axis domain with padding
  const getYDomain = () => {
    const allValues = data.flatMap((item) =>
      dataKeys.map((key) => Number(item[key]))
    );
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.2; // 20% padding
    return [Math.max(0, minValue - padding), maxValue + padding];
  };

  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                stopOpacity={0.3} // 30% opacity for lower intensity
              />
              <stop
                offset="95%"
                stopColor={COLORS[index % COLORS.length]}
                stopOpacity={0} // Fully transparent at the bottom
              />
            </linearGradient>
          ))}
        </defs>

        {/* Enhanced Cartesian Grid */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

        {/* X-Axis Configuration */}
        <XAxis
          dataKey={xAxisDataKey}
          tickFormatter={formatXAxis}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#666" }}
          label={
            xLabel
              ? {
                  value: xLabel,
                  position: "insideBottomRight",
                  offset: -5,
                  fontSize: 12,
                  fill: "#666", // Solid color for label
                }
              : undefined
          }
        />

        {/* Y-Axis Configuration */}
        <YAxis
          domain={getYDomain()}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#666" }}
          label={
            yLabel
              ? {
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                  fill: "#666", // Solid color for label
                }
              : undefined
          }
        />

        {/* Customized Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legend with Enhanced Styling */}
        <Legend wrapperStyle={{ fontSize: 12 }} />

        {/* Areas Rendering with Gradient Fills */}
        {dataKeys.map((key, index) => (
          <Area
            key={`area-${key}`}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            fillOpacity={1}
            fill={`url(#colorGradient-${key})`}
            animationDuration={1500} // Smooth animation
          >
            {/* Optionally, customize individual areas using Cell for additional interactivity */}
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={`url(#colorGradient-${key})`}
                // Example: Add hover effects or other interactivity here
              />
            ))}
          </Area>
        ))}

        {/* Optionally, you can add Lines on top of Areas */}
        {/* {dataKeys.map((key, index) => (
          <Line
            key={`line-${key}`}
            type="monotone"
            dataKey={key}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              stroke: COLORS[index % COLORS.length],
              strokeWidth: 2,
              fill: "#fff",
            }}
          />
        ))} */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AdvancedAreaChart;
