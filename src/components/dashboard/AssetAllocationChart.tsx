import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { AssetAllocationData } from '../../data/dummyData';

interface AssetAllocationChartProps {
  data: AssetAllocationData;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
  const chartData = data.children?.map(item => ({
    id: item.name,
    label: item.name,
    value: item.value
  })) || [];

  const formatPercentage = (value: number) => value.toFixed(2);

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-[#4FD1C5]">Asset Allocation</h2>
      <div className="flex-grow" style={{ height: '280px' }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 20, right: 60, bottom: 60, left: 60 }}
          innerRadius={0.5}
          padAngle={1.5}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#8B9DA7"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLinkLabel={d => `${d.id} (${formatPercentage(d.value)}%)`}
          arcLinkLabelsOffset={1}
          arcLinkLabelsDiagonalLength={12}
          arcLinkLabelsStraightLength={12}
          arcLinkLabelsTextOffset={2}
          arcLinkLabelsTextSize={11}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          enableArcLabels={false}
          motionConfig="slow"
          transitionMode="pushIn"
          tooltip={({ datum }) => (
            <div style={{
              background: '#ffffff',
              padding: '9px 12px',
              border: '1px solid #ccc',
              color: '#333',
            }}>
              <strong>{datum.id}</strong>: {formatPercentage(datum.value)}%
            </div>
          )}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            { match: { id: 'Stocks' }, id: 'dots' },
            { match: { id: 'Bonds' }, id: 'lines' },
          ]}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 10,
              itemWidth: 80,
              itemHeight: 18,
              itemTextColor: '#8B9DA7',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 14,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#4FD1C5'
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default AssetAllocationChart;
