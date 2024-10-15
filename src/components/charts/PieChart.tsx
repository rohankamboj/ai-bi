import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Define a color palette that matches your UserDashboard
const CHART_COLORS = [
  "#4FD1C5", // Primary teal color
  "#38B2AC",
  "#319795",
  "#2C7A7B",
  "#285E61",
  "#234E52",
];

interface AdvancedPieChartProps {
  data: Array<{ [key: string]: any }>;
  dataKey: string;
  nameKey: string;
  height?: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: 'rgba(26, 42, 47, 0.8)',
        padding: '10px',
        border: `1px solid ${CHART_COLORS[0]}`,
        borderRadius: '5px',
        color: 'white'
      }}>
        <p>{`${payload[0].name}: ${payload[0].value.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const AdvancedPieChart: React.FC<AdvancedPieChartProps> = ({
  data,
  dataKey,
  nameKey,
  height = 300
}) => {
  // Ensure numeric values are properly formatted
  const formattedData = data.map(item => ({
    ...item,
    [dataKey]: typeof item[dataKey] === 'string' ? parseFloat(item[dataKey]) : item[dataKey]
  }));

  // Calculate total for percentage
  const total = formattedData.reduce((sum, item) => sum + (item[dataKey] as number), 0);

  // Add percentage to each item
  const dataWithPercentage = formattedData.map(item => ({
    ...item,
    percentage: ((item[dataKey] as number) / total) * 100
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="percentage"
          nameKey={nameKey}
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="vertical" 
          align="right" 
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 12, color: "#8B9DA7" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AdvancedPieChart;
