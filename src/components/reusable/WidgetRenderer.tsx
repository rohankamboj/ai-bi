// src/components/WidgetRenderer.tsx
import React from 'react';
import LineChartWidget from './widgets/LineChartWidget';
// import other widgets

interface WidgetProps {
  widget: any;
}

const WidgetRenderer: React.FC<WidgetProps> = ({ widget }) => {
  switch (widget.type) {
    case 'LineChartWidget':
      return <LineChartWidget widget={widget} />;
    // case 'BarChartWidget':
    //   return <BarChartWidget widget={widget} />;
    default:
      return <div>Unknown Widget Type</div>;
  }
};

export default WidgetRenderer;
