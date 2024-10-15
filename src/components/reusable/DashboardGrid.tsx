// src/components/DashboardGrid.tsx
import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateWidgetLayout } from '../../store/layoutSlice';
import WidgetRenderer from './WidgetRenderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid: React.FC = () => {
  const widgets = useSelector((state: RootState) => state.layout.widgets);
  const dispatch = useDispatch();

  const layouts = {
    lg: widgets.map(widget => ({
      i: widget.id,
      ...widget.layout,
    })),
  };

  const onLayoutChange = (layout: Layout[]) => {
    layout.forEach(item => {
      dispatch(updateWidgetLayout({ id: item.i, layout: item }));
    });
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      cols={{ lg: 12, md: 10, sm: 6 }}
      rowHeight={30}
      onLayoutChange={onLayoutChange}
    >
      {widgets.map(widget => (
        <div key={widget.id} className="bg-white shadow rounded">
          <WidgetRenderer widget={widget} />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DashboardGrid;
