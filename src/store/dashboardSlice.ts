import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layouts } from 'react-grid-layout';
import { v4 as uuidv4 } from 'uuid';

export interface Agent {
  id: string;
  name: string;
  // Add other agent properties as needed
}

export interface ChartConfig {
  type: string;
  title: string;
  data: any;
  dataKeys?: string[];
  xAxisDataKey?: string;
  xLabel?: string;
  yLabel?: string;
  valueLabel?: string;
  stacked?: boolean;
}

export interface DashboardConfig {
  id: string;
  name: string;
  agent: Agent | null;
  chartConfigs: { [key: string]: ChartConfig };
  layouts: Layouts;
  dynamicComponents: any[];
  lockedComponents: string[];
}

interface DashboardState {
  dashboards: DashboardConfig[];
  activeDashboardId: string;
  isSidebarCollapsed: boolean;
}

const initialState: DashboardState = {
  dashboards: [],
  activeDashboardId: '',
  isSidebarCollapsed: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboards: (state, action: PayloadAction<DashboardConfig[]>) => {
      state.dashboards = action.payload;
    },
    addDashboard: (state, action: PayloadAction<string>) => {
      const newDashboard: DashboardConfig = {
        id: uuidv4(),
        name: action.payload,
        agent: null,
        chartConfigs: {},
        layouts: {},
        dynamicComponents: [],
        lockedComponents: [],
      };
      state.dashboards.push(newDashboard);
    },
    updateDashboard: (state, action: PayloadAction<DashboardConfig>) => {
      const index = state.dashboards.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.dashboards[index] = action.payload;
      }
    },
    deleteDashboard: (state, action: PayloadAction<string>) => {
      state.dashboards = state.dashboards.filter(d => d.id !== action.payload);
    },
    assignAgentToDashboard: (state, action: PayloadAction<{ dashboardId: string; agent: Agent }>) => {
      const dashboard = state.dashboards.find(d => d.id === action.payload.dashboardId);
      if (dashboard) {
        dashboard.agent = action.payload.agent;
      }
    },
    setActiveDashboardId: (state, action: PayloadAction<string>) => {
      state.activeDashboardId = action.payload;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    loadDashboards: (state) => {
      const savedDashboards = localStorage.getItem('dashboards');
      if (savedDashboards) {
        state.dashboards = JSON.parse(savedDashboards);
      }
    },
  },
});

export const {
  setDashboards,
  addDashboard,
  updateDashboard,
  deleteDashboard,
  assignAgentToDashboard,
  setActiveDashboardId,
  setSidebarCollapsed,
  loadDashboards,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
