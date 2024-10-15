// src/data/sampleData.ts
export const retentionData = [
  { name: "Jan", value: 85, target: 90 },
  { name: "Feb", value: 88, target: 90 },
  { name: "Mar", value: 87, target: 90 },
  { name: "Apr", value: 89, target: 90 },
  { name: "May", value: 91, target: 90 },
  { name: "Jun", value: 90, target: 90 },
];

export const averageTenureData = [
  { name: "2018", value: 3.2, industryAvg: 2.8 },
  { name: "2019", value: 3.5, industryAvg: 2.9 },
  { name: "2020", value: 3.8, industryAvg: 3.0 },
  { name: "2021", value: 4.0, industryAvg: 3.1 },
  { name: "2022", value: 4.2, industryAvg: 3.2 },
];

export const ftesData = [
  { name: "Engineering", value: 45 },
  { name: "Marketing", value: 15 },
  { name: "Sales", value: 30 },
  { name: "HR", value: 20 },
  { name: "Operations", value: 10 },
];

export const utilizationData = [
  { name: "Mon", value: 88, target: 90 },
  { name: "Tue", value: 92, target: 90 },
  { name: "Wed", value: 90, target: 90 },
  { name: "Thu", value: 91, target: 90 },
  { name: "Fri", value: 89, target: 90 },
];

export const trafficHeatmapData = Array.from({ length: 24 * 7 }, (_, i) => ({
  x: i % 24,
  y: Math.floor(i / 24),
  value: Math.floor(Math.random() * 100),
}));

export const cityPerformanceData = [
  { category: "Safety", score: 80 },
  { category: "Education", score: 75 },
  { category: "Healthcare", score: 85 },
  { category: "Infrastructure", score: 70 },
  { category: "Economy", score: 78 },
  { category: "Environment", score: 82 },
];
