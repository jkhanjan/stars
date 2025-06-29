import React from "react";
import { Eye, Minimize, Expand, Copy, Download } from "lucide-react";

const ColumnControls = ({
  toggleAll,
  toggleExpandAll,
  allExpanded,
  showJsonConfig,
  setShowJsonConfig,
  copyConfigToClipboard,
  hierarchicalStructure,
  renderHierarchicalItem,
  visibleKeys,
  flattenedKeys,
  generateConfigJSON,
}) => {
  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-sm h-fit sticky top-4">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Column Visibility</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => toggleAll(true)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Eye size={14} /> Show All
          </button>
          <button
            onClick={() => toggleExpandAll(!allExpanded)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            {allExpanded ? <Minimize size={14} /> : <Expand size={14} />}
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 pt-2 border-t border-gray-100">
          <button
            onClick={() => setShowJsonConfig(!showJsonConfig)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
          >
            {showJsonConfig ? "Hide" : "Show"} Config
          </button>
          <button
            onClick={copyConfigToClipboard}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
          >
            <Copy size={14} /> Copy JSON
          </button>
        </div>
      </div>

      <div className="p-2">
        <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {Object.entries(hierarchicalStructure).map(([key, item]) =>
            renderHierarchicalItem(key, item)
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          Showing {visibleKeys.length} of {flattenedKeys.length} columns
        </p>
      </div>

      {showJsonConfig && (
        <div className="border-t border-gray-200">
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Current Configuration</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40 border">
              {generateConfigJSON()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnControls;
