// src/data/processedData.ts

import { pearlFarmingData } from "./pearlFarmingData";

// Process data for Line Chart: Depth over Time
export const lineChartData = pearlFarmingData
  .filter((record) => record.time !== null && record.depth !== null)
  .map((record) => ({
    time: record.time,
    depth: record.depth,
  }));

// Process data for Bar Chart: PBO over Longitude
export const barChartData = pearlFarmingData
  .filter((record) => record.longitude !== null && record.pbo !== null)
  .map((record) => ({
    longitude: record.longitude,
    pbo: record.pbo,
  }));

// Process data for Heatmap: ZOS over Latitude and Longitude
export const heatmapData = pearlFarmingData
  .filter((record) => record.latitude !== null && record.longitude !== null && record.zos !== null)
  .map((record) => ({
    x: record.longitude,
    y: record.latitude,
    value: record.zos,
  }));

// Process data for Radar Chart: Aggregate scores (e.g., average of selected metrics)
export const radarChartData = [
  {
    category: "IST",
    score:
      pearlFarmingData.reduce((acc, curr) => acc + (curr.ist || 0), 0) /
      pearlFarmingData.length,
  },
  {
    category: "MLotSt",
    score:
      pearlFarmingData.reduce((acc, curr) => acc + (curr.mlotst || 0), 0) /
      pearlFarmingData.length,
  },
  {
    category: "PBO",
    score:
      pearlFarmingData.reduce((acc, curr) => acc + (curr.pbo || 0), 0) /
      pearlFarmingData.length,
  },
  {
    category: "SIAge",
    score:
      pearlFarmingData.reduce((acc, curr) => acc + (curr.siage || 0), 0) /
      pearlFarmingData.length,
  },
  {
    category: "SIAlb",
    score:
      pearlFarmingData.reduce((acc, curr) => acc + (curr.sialb || 0), 0) /
      pearlFarmingData.length,
  },
  // Add more categories as needed
];

// Process data for Map: Extract coordinates and popup info
export interface MapMarker {
  id: number;
  position: [number, number];
  popupInfo: {
    depth: number;
    time: string;
    ist: number;
    mlotst: number;
    pbo: number;
    // Add more fields as needed
  };
}

export const mapMarkers: MapMarker[] = pearlFarmingData.map((record, index) => ({
  id: index,
  position: [record.latitude || 0, record.longitude || 0],
  popupInfo: {
    depth: record.depth || 0,
    time: record.time || "N/A",
    ist: record.ist || 0,
    mlotst: record.mlotst || 0,
    pbo: record.pbo || 0,
    // Add more fields as needed
  },
}));
