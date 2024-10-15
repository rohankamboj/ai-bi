// src/components/data-handling/ResponseViewer.tsx

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ResponseViewerProps {
  selectedDataSourceId: string;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  selectedDataSourceId,
}) => {
  const dataSources = useSelector(
    (state: RootState) => state.dataSource.dataSources
  );
  const dataSource = dataSources.find((ds) => ds.id === selectedDataSourceId);

  if (!dataSource) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a data source to view its data.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{dataSource.name}</h2>
      <div className="max-h-full overflow-auto border border-gray-700 rounded bg-gray-800">
        <SyntaxHighlighter
          language="json"
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'transparent',
          }}
        >
          {JSON.stringify(dataSource.data, null, 2)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default ResponseViewer;
