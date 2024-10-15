import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FormulaEditorProps {
  data: any[];
  onFormulaComplete: (result: any[]) => void;
}

const FormulaEditor: React.FC<FormulaEditorProps> = ({ data, onFormulaComplete }) => {
  const [fieldName, setFieldName] = useState<string>(""); // Initialize with an empty string
  const [operation, setOperation] = useState<string>("add");
  const [operand, setOperand] = useState<number>(0);
  const [resultData, setResultData] = useState<any>(null);

  const handleApplyFormula = () => {
    if (data) {
      const transformedData = data.map((item: any) => {
        const value = parseFloat(item[fieldName]);
        if (!isNaN(value)) {
          let newValue;
          switch (operation) {
            case "add":
              newValue = value + operand;
              break;
            case "subtract":
              newValue = value - operand;
              break;
            case "multiply":
              newValue = value * operand;
              break;
            case "divide":
              newValue = value / operand;
              break;
            default:
              newValue = value;
          }
          return { ...item, [fieldName]: newValue };
        }
        return item;
      });
      setResultData(transformedData);
      onFormulaComplete(transformedData);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="border p-2 mb-2 w-full text-black"
        placeholder="Field Name"
        value={fieldName}
        onChange={(e) => setFieldName(e.target.value)}
      />
      <select
        className="border p-2 mb-2 w-full text-black"
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="add">Add</option>
        <option value="subtract">Subtract</option>
        <option value="multiply">Multiply</option>
        <option value="divide">Divide</option>
      </select>
      <input
        type="number"
        className="border p-2 mb-2 w-full text-black"
        placeholder="Operand"
        value={operand}
        onChange={(e) => setOperand(parseFloat(e.target.value))}
      />
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded"
        onClick={handleApplyFormula}
      >
        Apply Formula
      </button>
      {resultData && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Transformed Data:</h3>
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

export default FormulaEditor;
