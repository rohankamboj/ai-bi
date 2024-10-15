// src/components/widgets/LineChartWidget.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartWidgetProps {
  widget: any;
}

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  // more data
];

const LineChartWidget: React.FC<LineChartWidgetProps> = () => (
  <div style={{ width: '100%', height: '100%' }}>
    <ResponsiveContainer>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartWidget;
