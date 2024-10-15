import React from 'react';
import AdvancedBarChart from '../charts/BarChart';
import AdvancedLineChart from '../charts/LineChart';
import AdvancedPieChart from '../charts/PieChart';
import ErrorBoundary from '../common/ErrorBoundry';

interface ChartProps {
  data: { [key: string]: any[] };
  type: string;
  xAxis: string;
  yAxis: string;
}

const Chart: React.FC<ChartProps> = ({ data, type, xAxis, yAxis }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    console.error('Invalid chart data:', { data, type, xAxis, yAxis });
    return <div className="text-red-500">Insufficient data to render chart</div>;
  }

  const renderChart = () => {
    const commonProps = {
      data: Object.keys(data).length > 0 ? data[Object.keys(data)[0]].map((_, index) => {
        const item: { [key: string]: any } = {};
        Object.keys(data).forEach(key => {
          item[key] = data[key][index];
        });
        return item;
      }) : [],
      height: 300
    };

    switch (type.toLowerCase()) {
      case 'bar':
        return <AdvancedBarChart {...commonProps} dataKeys={[yAxis]} xAxisDataKey={xAxis} />;
      case 'line':
        return <AdvancedLineChart {...commonProps} dataKeys={[yAxis]} xAxisDataKey={xAxis} />;
      case 'pie':
        return <AdvancedPieChart {...commonProps} dataKey="value" nameKey="sector" />;
      default:
        return <div className="text-red-500">Unsupported chart type: {type}</div>;
    }
  };

  return (
    <ErrorBoundary fallback={<div className="text-red-500">Error rendering chart</div>}>
      {renderChart()}
    </ErrorBoundary>
  );
};

export default Chart;
