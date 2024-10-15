// src/components/WidgetPanel.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { addWidget } from '../../store/layoutSlice';

const WidgetPanel: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddWidget = (type: string) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      layout: { x: 0, y: Infinity, w: 4, h: 2 },
    };
    dispatch(addWidget(newWidget));
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Widgets</h2>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-2"
        onClick={() => handleAddWidget('LineChartWidget')}
      >
        Add Line Chart
      </button>
      {/* Other widget buttons */}
    </div>
  );
};

export default WidgetPanel;
