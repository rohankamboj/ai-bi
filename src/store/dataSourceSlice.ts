import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Datasource {
  id: string;
  name: string;
  data: any[];
}

interface DatasourceState {
  dataSources: Datasource[];
}

const initialState: DatasourceState = {
  dataSources: [],
};

const datasourceSlice = createSlice({
  name: 'datasource',
  initialState,
  reducers: {
    addDatasource: (state, action: PayloadAction<Datasource>) => {
      state.dataSources.push(action.payload);
    },
    updateDatasource: (state, action: PayloadAction<Datasource>) => {
      const index = state.dataSources.findIndex(ds => ds.id === action.payload.id);
      if (index !== -1) {
        state.dataSources[index] = action.payload;
      }
    },
    removeDatasource: (state, action: PayloadAction<string>) => {
      state.dataSources = state.dataSources.filter(ds => ds.id !== action.payload);
    },
    setDatasources: (state, action: PayloadAction<Datasource[]>) => {
      state.dataSources = action.payload;
    },
  },
});

export const { addDatasource, updateDatasource, removeDatasource, setDatasources } = datasourceSlice.actions;

export default datasourceSlice.reducer;
