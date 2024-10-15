// src/components/charts/AdvancedBarChart.tsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, isValid } from "date-fns";

// Define a color palette that matches your UserDashboard
const CHART_COLORS = [
  "#4FD1C5", // Primary teal color
  "#38B2AC",
  "#319795",
  "#2C7A7B",
  "#285E61",
  "#234E52",
];

// Define the props interface
interface AdvancedBarChartProps {
  data: Array<{ [key: string]: any }>;
  dataKeys: string[];
  xAxisDataKey: string;
  xLabel?: string;
  yLabel?: string;
  stacked?: boolean;
  height?: number; // Optional: default height
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedLabel = (() => {
      const date = new Date(label);
      return isValid(date) ? format(date, "dd MMM yyyy HH:mm") : String(label);
    })();

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "rgba(26, 42, 47, 0.8)",
          padding: "10px",
          border: `1px solid ${CHART_COLORS[0]}`,
          borderRadius: "5px",
          color: "white",
        }}
      >
        <p>{formattedLabel}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: CHART_COLORS[index % CHART_COLORS.length], margin: 0 }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main AdvancedBarChart Component
const AdvancedBarChart: React.FC<AdvancedBarChartProps> = ({
  data,
  dataKeys,
  xAxisDataKey,
  xLabel = "",
  yLabel = "",
  stacked = false,
  height = 300,
}) => {
  // Ensure numeric values are properly formatted
  const formattedData = data.map(item => {
    const newItem = { ...item };
    dataKeys.forEach(key => {
      if (typeof newItem[key] === 'string') {
        newItem[key] = parseFloat(newItem[key]);
      }
    });
    return newItem;
  });

  const formatXAxis = (tickItem: string | number) => {
    const date = new Date(tickItem);
    if (isValid(date)) {
      return format(date, "dd MMM");
    }
    // Round to 2 decimal places if it's a number
    const num = Number(tickItem);
    return isNaN(num) ? String(tickItem) : num.toFixed(2);
  };

  const formatYAxis = (tickItem: number) => {
    return tickItem.toFixed(2);
  };

  const getYDomain = () => {
    const allValues = formattedData.flatMap((item) =>
      dataKeys.map((key) => Number(item[key]))
    ).filter(value => !isNaN(value));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.2;
    return [
      Number((Math.max(0, minValue - padding)).toFixed(2)),
      Number((maxValue + padding).toFixed(2))
    ];
  };

  if (!formattedData || formattedData.length === 0) {
    return (
      <div style={{ width: '100%', height: height, display: 'flex', justifyContent: 'center', alignItems: 'center', color: CHART_COLORS[0] }}>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3F44" />
        <XAxis
          dataKey={xAxisDataKey}
          tickFormatter={formatXAxis}
          axisLine={{ stroke: CHART_COLORS[0] }}
          tickLine={{ stroke: CHART_COLORS[0] }}
          tick={{ fill: "#8B9DA7", fontSize: 12 }}
          label={{ value: xLabel, position: "insideBottomRight", offset: -5, fill: CHART_COLORS[0] }}
        />
        <YAxis
          domain={getYDomain()}
          axisLine={{ stroke: CHART_COLORS[0] }}
          tickLine={{ stroke: CHART_COLORS[0] }}
          tick={{ fill: "#8B9DA7", fontSize: 12 }}
          label={{ value: yLabel, angle: -90, position: "insideBottomLeft", offset: -5, fill: CHART_COLORS[0] }}
          tickFormatter={formatYAxis}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#8B9DA7" }} />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={stacked ? "a" : undefined}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
            animationDuration={1500}
          >
            {formattedData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AdvancedBarChart;
