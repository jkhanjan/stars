import React from 'react';
import { Code, Zap, X, AlertCircle } from 'lucide-react';

const RequestBodyTab = ({
  body,
  method,
  jsonError,
  handleBodyChange,
  formatJson,
  minifyJson,
  clearBody
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          Request Body (JSON)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={formatJson}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50 bg-white"
            disabled={!body.trim()}
          >
            <Code className="w-4 h-4" />
            Format
          </button>
          <button
            onClick={minifyJson}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50 bg-white"
            disabled={!body.trim()}
          >
            <Zap className="w-4 h-4" />
            Minify
          </button>
          <button
            onClick={clearBody}
            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 bg-white"
            disabled={!body.trim()}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {jsonError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{jsonError}</span>
        </div>
      )}

      <textarea
        value={body}
        onChange={(e) => handleBodyChange(e.target.value)}
        placeholder='{\n  "key": "value",\n  "number": 123,\n  "boolean": true\n}'
        rows={12}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 font-mono text-sm bg-white ${
          jsonError
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />

      {!["POST", "PUT", "PATCH"].includes(method) && (
        <div className="text-sm text-gray-500 italic">
          Request body is only used for POST, PUT, and PATCH methods
        </div>
      )}
    </div>
  );
};

export default RequestBodyTab;