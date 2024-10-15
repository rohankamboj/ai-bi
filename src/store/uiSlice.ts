// src/store/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeDashboardId: string;
  isSidebarCollapsed: boolean;
}

const initialState: UIState = {
  activeDashboardId: 'default-dashboard',
  isSidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveDashboardId: (state, action: PayloadAction<string>) => {
      state.activeDashboardId = action.payload;
    },
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { setActiveDashboardId, setIsSidebarCollapsed } = uiSlice.actions;

export default uiSlice.reducer;
