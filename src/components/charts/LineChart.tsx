import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, isValid } from 'date-fns';

// Define a color palette that matches your UserDashboard
const CHART_COLORS = [
  '#4FD1C5', // Primary teal color
  '#38B2AC',
  '#319795',
  '#2C7A7B',
  '#285E61',
  '#234E52',
];

// Define the props interface
interface AdvancedLineChartProps {
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
    const formattedLabel = (() => {
      const date = new Date(label);
      return isValid(date) ? format(date, 'dd MMM yyyy HH:mm') : String(label);
    })();

    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: 'rgba(26, 42, 47, 0.8)',
          padding: '10px',
          border: `1px solid ${CHART_COLORS[0]}`,
          borderRadius: '5px',
          color: 'white',
        }}
      >
        <p>{formattedLabel}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            style={{
              color: CHART_COLORS[index % CHART_COLORS.length],
              margin: 0,
            }}
          >
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main AdvancedLineChart Component
const AdvancedLineChart: React.FC<AdvancedLineChartProps> = ({
  data,
  dataKeys,
  xAxisDataKey,
  xLabel = '',
  yLabel = '',
  height = 300,
}) => {
  // Ensure numeric values are properly formatted
  const formattedData = data.map((item) => {
    const newItem = { ...item };
    dataKeys.forEach((key) => {
      if (typeof newItem[key] === 'string') {
        if (parseFloat(newItem[key])) {
          newItem[key] = parseFloat(newItem[key]);
        }
      }
    });

    return newItem;
  });

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return isValid(date) ? format(date, 'dd MMM') : String(tickItem);
  };

  const getYDomain = () => {
    const allValues = formattedData
      .flatMap((item) => dataKeys.map((key) => Number(item[key])))
      .filter((value) => !isNaN(value));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.2;
    return [Math.max(0, minValue - padding), maxValue + padding];
  };

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: CHART_COLORS[0],
        }}
      >
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={height}>
      <LineChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='#2A3F44' />
        <XAxis
          dataKey={xAxisDataKey}
          tickFormatter={formatXAxis}
          axisLine={{ stroke: CHART_COLORS[0] }}
          tickLine={{ stroke: CHART_COLORS[0] }}
          tick={{ fill: '#8B9DA7', fontSize: 12 }}
          label={{
            value: xLabel,
            position: 'insideBottomRight',
            offset: -5,
            fill: CHART_COLORS[0],
          }}
        />
        <YAxis
          domain={getYDomain()}
          axisLine={{ stroke: CHART_COLORS[0] }}
          tickLine={{ stroke: CHART_COLORS[0] }}
          tick={{ fill: '#8B9DA7', fontSize: 12 }}
          label={{
            value: yLabel,
            angle: -90,
            position: 'insideBottomLeft',
            offset: -5,
            fill: CHART_COLORS[0],
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8B9DA7' }} />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type='monotone'
            dataKey={key}
            stroke={CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS[index % CHART_COLORS.length], r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS[0] }}
            animationDuration={1500}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdvancedLineChart;
