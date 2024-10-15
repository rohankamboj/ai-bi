// src/components/data-handling/connectors/DatabaseConnector.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDatasource } from "../../../store/dataSourceSlice";

interface DatabaseConnectorProps {
  onSuccess: () => void;
}

const DatabaseConnector: React.FC<DatabaseConnectorProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [connectionDetails, setConnectionDetails] = useState({
    host: "",
    port: "",
    database: "",
    user: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectionDetails({
      ...connectionDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleConnectDatabase = () => {
    // Simulate fetching data from a database
    try {
      // Here you would normally connect to the database using connectionDetails
      // For demonstration, we'll simulate data
      const fetchedData = [
        { id: 1, name: "Alice", role: "Engineer" },
        { id: 2, name: "Bob", role: "Designer" },
        // more data...
      ];

      dispatch(
        addDatasource({
          id: `ds-${Date.now()}`,
          name: `Database Data - ${connectionDetails.database}`,
          data: fetchedData,
        })
      );

      // Notify parent component of success
      onSuccess();
    } catch (err) {
      console.error("Error connecting to database:", err);
      setError("Failed to connect to the database. Please check the details and try again.");
    }
  };

  return (
    <div className="mt-2 space-y-4">
      <label className="block font-semibold mb-2 text-gray-200">Database Connection Details:</label>
      <input
        type="text"
        name="host"
        value={connectionDetails.host}
        onChange={handleInputChange}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Host"
      />
      <input
        type="text"
        name="port"
        value={connectionDetails.port}
        onChange={handleInputChange}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Port"
      />
      <input
        type="text"
        name="database"
        value={connectionDetails.database}
        onChange={handleInputChange}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Database Name"
      />
      <input
        type="text"
        name="user"
        value={connectionDetails.user}
        onChange={handleInputChange}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="User"
      />
      <input
        type="password"
        name="password"
        value={connectionDetails.password}
        onChange={handleInputChange}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Password"
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
        onClick={handleConnectDatabase}
      >
        Connect to Database
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
};

export default DatabaseConnector;
