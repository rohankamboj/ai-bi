// src/components/data-handling/connectors/APIConnector.tsx

import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addDatasource } from "../../../store/dataSourceSlice";

interface APIConnectorProps {
  onSuccess: () => void;
}

const APIConnector: React.FC<APIConnectorProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [apiUrl, setApiUrl] = useState<string>(
    "https://jsonplaceholder.typicode.com/posts"
  );
  const [error, setError] = useState<string>("");

  const handleFetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setError("");

      dispatch(
        addDatasource({
          id: `ds-${Date.now()}`,
          name: `API Data - ${apiUrl}`,
          data: response.data,
        })
      );

      // Notify parent component of success
      onSuccess();
    } catch (err) {
      console.error("Error fetching data from API:", err);
      setError("Failed to fetch data. Please check the API URL and try again.");
    }
  };

  return (
    <div className="mt-2 space-y-4">
      <label className="block font-semibold mb-2 text-gray-200">API URL:</label>
      <input
        type="text"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter API URL"
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
        onClick={handleFetchData}
      >
        Fetch Data
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
};

export default APIConnector;
