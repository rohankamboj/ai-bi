// src/components/data-handling/connectors/UploadDataSource.tsx

import React, { useState } from "react";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { addDatasource } from "../../../store/dataSourceSlice";

interface UploadDataSourceProps {
  onSuccess: () => void;
}

const UploadDataSource: React.FC<UploadDataSourceProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      Papa.parse(e.target.files[0], {
        header: true,
        complete: (results) => {
          setError("");

          dispatch(
            addDatasource({
              id: `ds-${Date.now()}`,
              name: e.target.files![0].name,
              data: results.data,
            })
          );

          // Notify parent component of success
          onSuccess();
        },
        error: (err) => {
          console.error("Error parsing CSV file:", err);
          setError("Failed to parse CSV file. Please check the file and try again.");
        },
      });
    }
  };

  return (
    <div className="mt-2 space-y-4">
      <label className="block font-semibold mb-2 text-gray-200">Upload CSV File:</label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">CSV files only</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
};

export default UploadDataSource;
