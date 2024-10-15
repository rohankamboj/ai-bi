
// src/store/datasetsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index'; // Adjust the path according to your project structure
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for Dataset and Table
export interface Dataset {
  id: string;
  name: string;
}

export interface Table {
  id: string;
  name: string;
}

// Define the initial state
interface DatasetsState {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  tables: Table[];
  selectedTable: Table | null;
  loadingDatasets: boolean;
  loadingTables: boolean;
  errorDatasets: string | null;
  errorTables: string | null;
}

const initialState: DatasetsState = {
  datasets: [],
  selectedDataset: null,
  tables: [],
  selectedTable: null,
  loadingDatasets: false,
  loadingTables: false,
  errorDatasets: null,
  errorTables: null,
};

// Async thunk to fetch datasets
export const fetchDatasets = createAsyncThunk<
  Dataset[], // Return type of the fulfilled action
  void,      // Argument type (we're not passing any arguments here)
  { state: RootState } // ThunkAPI type
>('datasets/fetchDatasets', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.user.token; // Assuming token is stored in user slice
  const RAPID_AUTH_URL = import.meta.env.VITE_RAPID_AUTH_URL; // Replace with your actual API base URL

  try {
    const response = await axios.get(
      `${RAPID_AUTH_URL}/agents/datasets/get-datasets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data)

    // Map the response data to match the Dataset interface
    const datasets: Dataset[] = response.data.map((dataset: any) => ({
      id: uuidv4(),
      name: dataset,
    }));

    return datasets;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching datasets');
  }
});

// Async thunk to fetch tables for a selected dataset
export const fetchTables = createAsyncThunk<
  Table[],    // Return type of the fulfilled action
  string,     // Argument type (dataset name or ID)
  { state: RootState }
>('datasets/fetchTables', async (datasetName, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.user.token;
  const RAPID_AUTH_URL = import.meta.env.VITE_RAPID_AUTH_URL; // Replace with your actual API base URL

  try {
    const response = await axios.get(
      `${RAPID_AUTH_URL}/agents/datasets/get-tables/${datasetName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data)

    // Map the response data to match the Table interface
    const tables: Table[] = response.data.map((table: any) => ({
      id: table.id,
      name: table.table_name,
    }));

    return tables;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching tables');
  }
});

const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    setSelectedDataset(state, action: PayloadAction<Dataset | null>) {
      state.selectedDataset = action.payload;
      state.tables = [];
      state.selectedTable = null;
      state.errorTables = null;
    },
    setSelectedTable(state, action: PayloadAction<Table | null>) {
      state.selectedTable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Datasets
      .addCase(fetchDatasets.pending, (state) => {
        state.loadingDatasets = true;
        state.errorDatasets = null;
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.loadingDatasets = false;
        state.datasets = action.payload;
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.loadingDatasets = false;
        state.errorDatasets = action.payload as string;
      })
      // Fetch Tables
      .addCase(fetchTables.pending, (state) => {
        state.loadingTables = true;
        state.errorTables = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loadingTables = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loadingTables = false;
        state.errorTables = action.payload as string;
      });
  },
});

export const { setSelectedDataset, setSelectedTable } = datasetsSlice.actions;

export default datasetsSlice.reducer;
