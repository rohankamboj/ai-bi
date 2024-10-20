// src/components/data-handling/connectors/DatabaseConnector.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDatasource } from '../../../store/dataSourceSlice';
import handleGetDatasets from '../../../api/get-bigquery-dataset';
import handleGetDatasetsTables from '../../../api/get-dataset-table';
import handleConnectDatabase from '../../../api/connect-db';

interface DatabaseConnectorProps {
  onSuccess: () => void;
}

const DatabaseConnector: React.FC<DatabaseConnectorProps> = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const [error, setError] = useState<string>('');

  const [datasets, setDatasets] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedDataTable, setSelectedDataTable] = useState<{
    id: string;
    table_name: string;
  }>({
    id: '',
    table_name: '',
  });

  const [datasetTable, setDatasetTable] = useState<
    { id: string; table_name: string }[]
  >([]);

  const getDatasets = async () => {
    const data = await handleGetDatasets();

    setDatasets(['select dataset', ...data.datasets]);
  };

  useEffect(() => {
    // get all datasets
    getDatasets();
  }, []);

  const getDatasetTables = async (dataset: string) => {
    const data = await handleGetDatasetsTables({ dataset });

    setDatasetTable([
      { id: 'select table', table_name: 'select table' },
      ...data.tables,
    ]);
  };

  useEffect(() => {
    if (selectedDataset) {
      getDatasetTables(selectedDataset);
    }
  }, [selectedDataset]);

  useEffect(() => {
    if (selectedDataTable) {
      console.log(selectedDataTable);
    }
  }, [selectedDataTable]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataset(e.target.value);
  };

  const handleSelectDataTableChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const table = datasetTable.find((table) => table.id === e.target.value);
    if (table) {
      setSelectedDataTable(table);
    }
  };

  const connectDatabase = async () => {
    // Simulate fetching data from a database
    try {
      // Here you would normally connect to the database using connectionDetails
      // For demonstration, we'll simulate data
      // const fetchedData = [
      //   { id: 1, name: 'Alice', role: 'Engineer' },
      //   { id: 2, name: 'Bob', role: 'Designer' },
      //   // more data...
      // ];

      const data = await handleConnectDatabase({
        tableId: selectedDataTable.id,
      });

      dispatch(
        addDatasource({
          id: data.db_connection_id,
          name: `Dataset = ${selectedDataset} - Table = ${selectedDataTable.table_name}`,
          data: data.data,
        })
      );

      // Notify parent component of success
      onSuccess();
    } catch (err) {
      console.error('Error connecting to database:', err);
      setError(
        'Failed to connect to the database. Please check the details and try again.'
      );
    }
  };

  return (
    <div className='mt-2 space-y-4'>
      <label className='block font-semibold mb-2 text-gray-200'>
        Database Connection Details:
      </label>

      <div>
        <label className='block font-semibold mb-2 text-gray-200'>
          Datasets:
        </label>

        <select onChange={handleSelectChange} className='w-full text-black'>
          {datasets.map((dataset) => (
            <option
              key={dataset}
              value={dataset}
              defaultValue={'select dataset'}
              className='text-black border border-gray-600 bg-gray-700  p-2 w-full rounded focus:outline-none '
            >
              {dataset}
            </option>
          ))}
        </select>
      </div>

      {datasetTable.length > 0 && (
        <div>
          <label className='block font-semibold mb-2 text-gray-200'>
            Tables:
          </label>

          <select
            onChange={handleSelectDataTableChange}
            className='w-full text-black'
          >
            {datasetTable.map((table) => (
              <option
                key={table.id}
                value={table.id}
                className='text-black border border-gray-600 bg-gray-700  p-2 w-full rounded focus:outline-none '
              >
                {table.table_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className='bg-blue-600 w-full hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200'
        onClick={connectDatabase}
      >
        Connect to Database
      </button>
      {error && <p className='text-red-400 mt-2'>{error}</p>}
    </div>
  );
};

export default DatabaseConnector;
