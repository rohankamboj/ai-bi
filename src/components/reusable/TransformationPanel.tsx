// src/components/TransformationPanel.tsx
import React from 'react';
import QueryBuilder from './data-handling/QueryBuilder';
import FormulaEditor from './data-handling/FormulaEditor';

const TransformationPanel: React.FC = () => (
  <div className="mt-4">
    <h2 className="font-semibold mb-2">Data Transformation</h2>
    <QueryBuilder />
    <FormulaEditor />
  </div>
);

export default TransformationPanel;
