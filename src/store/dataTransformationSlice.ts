// src/store/dataTransformationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransformedData {
  id: string;
  name: string;
  data: any[];
}

interface DataTransformationState {
  transformedData: TransformedData[];
}

const initialState: DataTransformationState = {
  transformedData: [],
};

const dataTransformationSlice = createSlice({
  name: 'dataTransformation',
  initialState,
  reducers: {
    setTransformedData: (state, action: PayloadAction<TransformedData>) => {
      state.transformedData.push(action.payload);
    },
    removeTransformedData: (state, action: PayloadAction<string>) => {
      state.transformedData = state.transformedData.filter(td => td.id !== action.payload);
    },
  },
});

export const { setTransformedData, removeTransformedData } = dataTransformationSlice.actions;
export default dataTransformationSlice.reducer;
