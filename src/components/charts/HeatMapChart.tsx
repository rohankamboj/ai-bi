// src/components/charts/HeatMapChart.tsx

import React from "react";
import { ResponsiveHeatMapCanvas, ComputedCell } from "@nivo/heatmap";

interface HeatMapChartProps {
  data: Array<{ x: number; y: number; value: number }>;
  xLabel: string;
  yLabel: string;
  valueLabel: string;
}

const HeatMapChart: React.FC<HeatMapChartProps> = ({
  data,
  xLabel,
  yLabel,
  valueLabel,
}) => {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1A2A2F] p-6 rounded-lg">
        <p>No data available</p>
      </div>
    );
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const heatmapData = dayNames.map((day, yIndex) => ({
    id: day,
    data: Array.from({ length: 24 }, (_, xIndex) => {
      const dataPoint = data.find((d) => d.x === xIndex && d.y === yIndex);
      return {
        x: `${xIndex}:00`,
        y: dataPoint ? dataPoint.value : 0,
      };
    }),
  }));

  const getColor = (cell: Omit<ComputedCell<{ x: string; y: number }>, "opacity" | "borderColor" | "labelTextColor" | "color">): string => {
    const value = cell.value as number;
    const normalizedValue = Math.min(Math.max(value / 100, 0), 1);
    const r = Math.round(26 + normalizedValue * (79 - 26));
    const g = Math.round(42 + normalizedValue * (209 - 42));
    const b = Math.round(47 + normalizedValue * (197 - 47));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const legendData = [0, 25, 50, 75, 100].map((value) => ({
    color: getColor({ value } as any),
    label: `${value}%`,
  }));

  return (
    <div className="bg-[#1A2A2F] p-6 rounded-lg shadow-lg h-full flex flex-col">
      
      <div className="flex-grow" style={{ width: "100%", height: "100%", position: "relative" }}>
        <ResponsiveHeatMapCanvas
          data={heatmapData}
          margin={{ top: 60, right: 80, bottom: 80, left: 60 }}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: xLabel,
            legendPosition: "middle",
            legendOffset: -50,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: yLabel,
            legendPosition: "middle",
            legendOffset: -50,
          }}
          colors={getColor}
          cellOpacity={1}
          cellBorderWidth={3}
          cellBorderColor="#1A2A2F"
          enableLabels={false}
          hoverTarget="cell"
          cellHoverOthersOpacity={0.25}
          axisBottom={null}
          axisRight={null}
          minValue={0}
          maxValue={100}
          padding={0.2}
          theme={{
            background: "#1A2A2F",
            text: {
              fill: "#8B9DA7",
              fontSize: 12,
            },
            axis: {
              ticks: {
                line: {
                  stroke: "#8B9DA7",
                  strokeWidth: 1,
                },
                text: {
                  fill: "#8B9DA7",
                },
              },
              legend: {
                text: {
                  fill: "#8B9DA7",
                  fontSize: 14,
                },
              },
            },
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "30px",
          paddingTop: "20px",
        }}>
          {legendData.map(({ color, label }, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, backgroundColor: color, marginRight: 12 }} />
              <span className="text-[#8B9DA7] text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatMapChart;
