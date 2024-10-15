// src/pages/IntegrationsPage.tsx

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataSourceManager from "../components/reusable/data-handling/DataSourceManager";
import ResponseViewer from "../components/reusable/data-handling/ResponseViewer";
import QueryBuilder from "../components/reusable/data-handling/QueryBuilder";
import FormulaEditor from "../components/reusable/data-handling/FormulaEditor";
import { RootState } from "../store";
import {
  addDatasource,
  updateDatasource,
  Datasource,
} from "../store/dataSourceSlice";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ExpandableSection: React.FC<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, isExpanded, onToggle, children, icon }) => (
  <div className="border border-gray-700 rounded-lg overflow-hidden mb-4">
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

const DataExtractor: React.FC<{ selectedDataSourceId: string }> = ({
  selectedDataSourceId,
}) => {
  const dispatch = useDispatch();
  const [extractedData, setExtractedData] = useState<any>(null);
  const [newDatasourceName, setNewDatasourceName] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<"select" | "query" | "formula">(
    "select"
  );
  const dataSources = useSelector(
    (state: RootState) => state.dataSource.dataSources
  );
  const [error, setError] = useState<string | null>(null);

  const selectedDataSource = dataSources.find(
    (ds) => ds.id === selectedDataSourceId
  );

  const handleFieldSelection = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleExtractData = () => {
    if (selectedDataSource && selectedFields.length > 0) {
      const extracted = selectedDataSource.data.map((item: any) =>
        selectedFields.reduce((acc: any, field: string) => {
          if (item[field] !== undefined) {
            acc[field] = item[field];
          }
          return acc;
        }, {})
      );
      setExtractedData(extracted);
      setActiveStep("query");
    }
  };

  const handleQueryResult = (queryResult: any) => {
    setExtractedData(queryResult);
    setActiveStep("formula");
  };

  const handleFormulaResult = (formulaResult: any) => {
    setExtractedData(formulaResult);
  };

  const handleSaveNewDatasource = () => {
    if (!newDatasourceName || !extractedData) return;

    const newDatasource: Datasource = {
      id: `ds_${Date.now()}`,
      name: newDatasourceName,
      data: extractedData,
    };

    dispatch(addDatasource(newDatasource));
    setNewDatasourceName("");
    setExtractedData(null);
    setActiveStep("select");
  };

  const handleUpdateExistingDatasource = () => {
    if (!selectedDataSource || !extractedData) return;

    const updatedDatasource: Datasource = {
      ...selectedDataSource,
      data: extractedData,
    };

    dispatch(updateDatasource(updatedDatasource));
    setExtractedData(null);
    setActiveStep("select");
  };

  const handleNext = () => {
    setError(null);
    if (activeStep === "select") {
      if (selectedFields.length === 0) {
        setError("Please select at least one field before proceeding.");
        return;
      }
      handleExtractData();
    } else if (activeStep === "query") {
      setActiveStep("formula");
    }
  };

  const handleBack = () => {
    setError(null);
    if (activeStep === "query") {
      setActiveStep("select");
    } else if (activeStep === "formula") {
      setActiveStep("query");
    }
  };

  const handleReset = () => {
    setError(null);
    setSelectedFields([]);
    setExtractedData(null);
    setActiveStep("select");
    setNewDatasourceName("");
  };

  return (
    <div className="bg-gray-800 rounded-lg p-5">
      <h3 className="text-2xl font-bold mb-4 text-white">Data Extraction and Transformation</h3>
      
      <div className="flex space-x-6">
        <div className="w-2/3">
          <div className="mb-5">
            <div className="flex items-center mb-2">
              {['select', 'query', 'formula'].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activeStep === step ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && <div className={`flex-1 h-1 mx-2 ${
                    index < ['select', 'query', 'formula'].indexOf(activeStep) ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Select Fields</span>
              <span>Apply Query</span>
              <span>Apply Formula</span>
            </div>
          </div>

          {error && <div className="text-red-500 mb-3 p-2 bg-red-100 rounded text-sm">{error}</div>}

          <div className="bg-gray-700 rounded-lg p-4 mb-5">
            {activeStep === 'select' && selectedDataSource && (
              <div>
                <h4 className="font-semibold mb-2 text-base text-white">Step 1: Select Fields</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.keys(selectedDataSource.data[0] || {}).map(field => (
                    <button
                      key={field}
                      onClick={() => handleFieldSelection(field)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFields.includes(field) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 'query' && (
              <div>
                <h4 className="font-semibold mb-2 text-base text-white">Step 2: Apply Query (Optional)</h4>
                <QueryBuilder
                  data={extractedData}
                  onQueryComplete={handleQueryResult}
                />
              </div>
            )}

            {activeStep === 'formula' && (
              <div>
                <h4 className="font-semibold mb-2 text-base text-white">Step 3: Apply Formula (Optional)</h4>
                <FormulaEditor
                  data={extractedData}
                  onFormulaComplete={handleFormulaResult}
                />
                <div className="mt-3 flex space-x-3">
                  <input
                    type="text"
                    value={newDatasourceName}
                    onChange={(e) => setNewDatasourceName(e.target.value)}
                    placeholder="New Datasource Name"
                    className="flex-grow border p-2 rounded text-black text-sm"
                  />
                  <button
                    onClick={handleSaveNewDatasource}
                    className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600"
                    disabled={!newDatasourceName}
                  >
                    Save as New
                  </button>
                  <button
                    onClick={handleUpdateExistingDatasource}
                    className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600"
                    disabled={!selectedDataSource}
                  >
                    Update Existing
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
              disabled={activeStep === 'select'}
            >
              Back
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
            >
              Reset
            </button>
            <button
              onClick={handleNext}
              className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
              disabled={activeStep === 'formula'}
            >
              {activeStep === 'formula' ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

        <div className="w-1/3">
          <h4 className="font-semibold mb-2 text-base text-white">Preview:</h4>
          <div className="bg-gray-100 p-3 rounded overflow-hidden text-black text-sm h-80">
            <pre className="overflow-auto h-full">
              {extractedData ? JSON.stringify(extractedData.slice(0, 5), null, 2) : 'No data to preview'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationsPage: React.FC = () => {
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string>("dataViewer");

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex h-full">
        <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          <DataSourceManager
            selectedDataSourceId={selectedDataSourceId}
            setSelectedDataSourceId={setSelectedDataSourceId}
          />
        </div>
        <div className="w-3/4 p-4 overflow-y-auto bg-gray-900">
          <ExpandableSection
            title="Data Viewer"
            isExpanded={expandedSection === "dataViewer"}
            onToggle={() => toggleSection("dataViewer")}
            icon={<FaChevronDown className="text-blue-400" />}
          >
            <ResponseViewer selectedDataSourceId={selectedDataSourceId} />
          </ExpandableSection>
          
          <ExpandableSection
            title="Data Extraction and Transformation"
            isExpanded={expandedSection === "dataExtractor"}
            onToggle={() => toggleSection("dataExtractor")}
            icon={<FaChevronDown className="text-green-400" />}
          >
            <DataExtractor selectedDataSourceId={selectedDataSourceId} />
          </ExpandableSection>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;