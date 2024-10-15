import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

interface QueryBuilderProps {
  data: any[];
  onQueryComplete: (result: any[]) => void;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({ data, onQueryComplete }) => {
  const [filterKey, setFilterKey] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [resultData, setResultData] = useState<any>(null);

  const handleApplyFilter = () => {
    if (data) {
      const filteredData = data.filter((item: any) =>
        item[filterKey]
          ? item[filterKey].toString().includes(filterValue)
          : false
      );
      setResultData(filteredData);
      onQueryComplete(filteredData);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="border p-2 mb-2 w-full text-black"
        placeholder="Filter Key"
        value={filterKey}
        onChange={(e) => setFilterKey(e.target.value)}
      />
      <input
        type="text"
        className="border p-2 mb-2 w-full text-black"
        placeholder="Filter Value"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded"
        onClick={handleApplyFilter}
      >
        Apply Filter
      </button>
      {resultData && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Filtered Data:</h3>
          <div className="max-h-64 overflow-auto border p-2 rounded bg-gray-50">
            <SyntaxHighlighter language="json" style={syntaxStyle}>
              {JSON.stringify(resultData.slice(0, 5), null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;
