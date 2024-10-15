// src/store/index.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./userSlice";
import datasetsReducer from "./datasetsSlice";
import layoutReducer from "./layoutSlice";
import dataSourceReducer from "./dataSourceSlice";
import dataTransformationReducer from "./dataTransformationSlice";
import uiReducer from "./uiSlice";
import dashboardReducer from "./dashboardSlice";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { useDispatch } from "react-redux";

// Combine your reducers into a rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  datasets: datasetsReducer,
  layout: layoutReducer,
  dataSource: dataSourceReducer,
  dataTransformation: dataTransformationReducer,
  ui: uiReducer,
  dashboard: dashboardReducer,
  // Add other reducers here if needed
});

// Configure persistence settings
const persistConfig = {
  key: "root",
  storage,
  // Optionally, define which reducers you want to persist
  // whitelist: ["dashboard", "ui", "datasets", "layout", "dataSource", "dataTransformation"],
  // blacklist: ["user"], // For example, you might not want to persist user authentication state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Custom hook to use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Create a persistor to be used in the PersistGate
export const persistor = persistStore(store);

export default store;
