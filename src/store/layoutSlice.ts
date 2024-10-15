// src/store/layoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Widget {
  id: string;
  type: string;
  layout: { x: number; y: number; w: number; h: number };
}

interface LayoutState {
  widgets: Widget[];
}

const initialState: LayoutState = {
  widgets: [],
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.widgets.push(action.payload);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter(widget => widget.id !== action.payload);
    },
    updateWidgetLayout: (state, action: PayloadAction<{ id: string; layout: any }>) => {
      const widget = state.widgets.find(w => w.id === action.payload.id);
      if (widget) {
        widget.layout = action.payload.layout;
      }
    },
  },
});

export const { addWidget, removeWidget, updateWidgetLayout } = layoutSlice.actions;
export default layoutSlice.reducer;
