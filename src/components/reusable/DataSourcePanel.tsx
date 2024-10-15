// src/components/DataSourcePanel.tsx
import React from 'react';
import UploadDataSource from './data-handling/UploadDataSource';
import APIConnector from './data-handling/APIConnector';
import DatabaseConnector from './data-handling/DatabaseConnector';

const DataSourcePanel: React.FC = () => (
  <div>
    <h2 className="font-semibold mb-2">Data Sources</h2>
    <UploadDataSource />
    <APIConnector />
    <DatabaseConnector />
  </div>
);

export default DataSourcePanel;
