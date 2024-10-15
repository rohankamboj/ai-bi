// src/data/pearlFarmingData.ts

export interface PearlFarmingRecord {
  depth: number | null;
  latitude: number | null;
  longitude: number | null;
  time: string | null; // DATETIME in BigQuery corresponds to string in ISO format
  date: string | null; // DATE in BigQuery corresponds to string in 'YYYY-MM-DD' format
  so: number | null;
  thetao: number | null;
  uo: number | null;
  vo: number | null;
  ist: number | null;
  mlotst: number | null;
  pbo: number | null;
  siage: number | null;
  sialb: number | null;
  siconc: number | null;
  sisnthick: number | null;
  sithick: number | null;
  sivelo: number | null;
  sob: number | null;
  tob: number | null;
  usi: number | null;
  vsi: number | null;
  zos: number | null;
  geography: string | null; // GEOGRAPHY type as WKT string
}

export const pearlFarmingData: PearlFarmingRecord[] = [
  {
    depth: 0.5,
    latitude: -11.0,
    longitude: 95.0,
    time: "2024-08-16T12:00:00",
    date: "2024-08-16",
    so: 30.0,
    thetao: 15.0,
    uo: 5.0,
    vo: 5.0,
    ist: 0.0,
    mlotst: 25.0,
    pbo: 5000.0,
    siage: 0.0,
    sialb: 0.06,
    siconc: 0.0,
    sisnthick: 0.0,
    sithick: 0.0,
    sivelo: 0.0,
    sob: 34.7,
    tob: 0.75,
    usi: 0.0,
    vsi: 0.0,
    zos: 0.72,
    geography: "POINT (95 -11)",
  },
  {
    depth: 0.6,
    latitude: -11.2,
    longitude: 95.2,
    time: "2024-08-16T13:00:00",
    date: "2024-08-16",
    so: 32.0,
    thetao: 16.5,
    uo: 5.5,
    vo: 5.5,
    ist: 0.1,
    mlotst: 26.5,
    pbo: 5100.0,
    siage: 0.1,
    sialb: 0.065,
    siconc: 0.1,
    sisnthick: 0.05,
    sithick: 0.05,
    sivelo: 0.05,
    sob: 34.8,
    tob: 0.76,
    usi: 0.1,
    vsi: 0.1,
    zos: 0.73,
    geography: "POINT (95.2 -11.2)",
  },
  {
    depth: 0.55,
    latitude: -10.8,
    longitude: 95.4,
    time: "2024-08-16T14:00:00",
    date: "2024-08-16",
    so: 31.0,
    thetao: 15.5,
    uo: 5.2,
    vo: 5.2,
    ist: 0.05,
    mlotst: 25.5,
    pbo: 5050.0,
    siage: 0.05,
    sialb: 0.063,
    siconc: 0.05,
    sisnthick: 0.02,
    sithick: 0.02,
    sivelo: 0.02,
    sob: 34.75,
    tob: 0.755,
    usi: 0.05,
    vsi: 0.05,
    zos: 0.725,
    geography: "POINT (95.4 -10.8)",
  },
  {
    depth: 0.58,
    latitude: -11.1,
    longitude: 95.1,
    time: "2024-08-16T15:00:00",
    date: "2024-08-16",
    so: 33.0,
    thetao: 17.0,
    uo: 5.8,
    vo: 5.8,
    ist: 0.2,
    mlotst: 27.0,
    pbo: 5200.0,
    siage: 0.2,
    sialb: 0.07,
    siconc: 0.2,
    sisnthick: 0.07,
    sithick: 0.07,
    sivelo: 0.07,
    sob: 34.9,
    tob: 0.76,
    usi: 0.2,
    vsi: 0.2,
    zos: 0.74,
    geography: "POINT (95.1 -11.1)",
  },
  {
    depth: 0.52,
    latitude: -10.9,
    longitude: 95.3,
    time: "2024-08-16T16:00:00",
    date: "2024-08-16",
    so: 29.0,
    thetao: 14.5,
    uo: 4.8,
    vo: 4.8,
    ist: 0.0,
    mlotst: 24.5,
    pbo: 4950.0,
    siage: 0.0,
    sialb: 0.06,
    siconc: 0.0,
    sisnthick: 0.0,
    sithick: 0.0,
    sivelo: 0.0,
    sob: 34.65,
    tob: 0.74,
    usi: 0.0,
    vsi: 0.0,
    zos: 0.71,
    geography: "POINT (95.3 -10.9)",
  },
  // Add more records as needed
];
