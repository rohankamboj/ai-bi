// src/components/data-handling/DataSourceManager.tsx

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { removeDatasource } from "../../../store/dataSourceSlice";
import { FaChevronDown, FaChevronUp, FaTrash, FaDatabase, FaCloudUploadAlt, FaLink } from "react-icons/fa";
import { toast } from "react-toastify";
import APIConnector from "./APIConnector";
import UploadDataSource from "./UploadDataSource";
import DatabaseConnector from "./DatabaseConnector";

interface DataSourceManagerProps {
  selectedDataSourceId: string;
  setSelectedDataSourceId: (id: string) => void;
}

const DataSourceManager: React.FC<DataSourceManagerProps> = ({
  selectedDataSourceId,
  setSelectedDataSourceId,
}) => {
  const dispatch = useDispatch();
  const dataSources = useSelector(
    (state: RootState) => state.dataSource.dataSources
  );

  const [expandedSection, setExpandedSection] = useState<string>("");
  const [activeConnector, setActiveConnector] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? "" : section));
  };

  const handleDeleteDataSource = (id: string) => {
    dispatch(removeDatasource(id));
    if (selectedDataSourceId === id) {
      setSelectedDataSourceId("");
    }
  };

  const handleDataSourceAdded = () => {
    console.log("Data source added, attempting to show toast");
    toast.success("Data source added successfully!", {
      className: 'bg-[#1A2A2F] text-[#4FD1C5] border border-[#4FD1C5]',
      progressClassName: 'bg-[#4FD1C5]'
    });
    setActiveConnector(null);
  };

  const renderConnector = () => {
    switch (activeConnector) {
      case "api":
        return <APIConnector onSuccess={handleDataSourceAdded} />;
      case "upload":
        return <UploadDataSource onSuccess={handleDataSourceAdded} />;
      case "database":
        return <DatabaseConnector onSuccess={handleDataSourceAdded} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <ExpandableSection
        title="Data Sources"
        isExpanded={expandedSection === "dataSources"}
        onToggle={() => toggleSection("dataSources")}
        icon={<FaDatabase className="text-blue-400" />}
      >
        <ul className="space-y-2">
          {dataSources.map((ds) => (
            <DataSourceItem
              key={ds.id}
              dataSource={ds}
              isSelected={selectedDataSourceId === ds.id}
              onSelect={() => setSelectedDataSourceId(ds.id)}
              onDelete={() => handleDeleteDataSource(ds.id)}
            />
          ))}
          {dataSources.length === 0 && (
            <li className="text-gray-400">No data sources available.</li>
          )}
        </ul>
      </ExpandableSection>

      <ExpandableSection
        title="Add Data Source"
        isExpanded={expandedSection === "addDataSource"}
        onToggle={() => toggleSection("addDataSource")}
        icon={<FaCloudUploadAlt className="text-green-400" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <DataSourceButton
              title="API"
              icon={<FaLink className="text-purple-400" />}
              onClick={() => setActiveConnector("api")}
            />
            <DataSourceButton
              title="Upload"
              icon={<FaCloudUploadAlt className="text-orange-400" />}
              onClick={() => setActiveConnector("upload")}
            />
            <DataSourceButton
              title="Database"
              icon={<FaDatabase className="text-blue-400" />}
              onClick={() => setActiveConnector("database")}
            />
          </div>
          {renderConnector()}
        </div>
      </ExpandableSection>
    </div>
  );
};

const ExpandableSection: React.FC<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, isExpanded, onToggle, children, icon }) => (
  <div className="border border-gray-700 rounded-lg overflow-hidden">
    <div
      className="flex justify-between items-center cursor-pointer py-3 px-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
      onClick={onToggle}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {isExpanded ? (
        <FaChevronUp className="text-gray-400" />
      ) : (
        <FaChevronDown className="text-gray-400" />
      )}
    </div>
    {isExpanded && <div className="p-4 bg-gray-800">{children}</div>}
  </div>
);

const DataSourceItem: React.FC<{
  dataSource: { id: string; name: string };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ dataSource, isSelected, onSelect, onDelete }) => (
  <li
    className={`p-3 border border-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
      isSelected ? "bg-blue-600 border-blue-500" : "bg-gray-800"
    }`}
    onClick={onSelect}
  >
    <span className="truncate text-white">{dataSource.name}</span>
    <button
      className="text-red-400 hover:text-red-300 transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      <FaTrash />
    </button>
  </li>
);

const DataSourceButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, icon, onClick }) => (
  <button
    className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors duration-200"
    onClick={onClick}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <span className="text-sm font-medium text-white">{title}</span>
  </button>
);

export default DataSourceManager;