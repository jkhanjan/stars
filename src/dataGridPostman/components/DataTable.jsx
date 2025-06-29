import React from "react";

const DataTable = ({ visibleKeys, formatLabel, getFlattenedData, renderCellContent, generateColumnMap, flattenedData }) => {
  return (
    <div className="flex-1 overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Data Table</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visibleKeys.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {formatLabel(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFlattenedData().map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {visibleKeys.map((key) => (
                    <td key={key} className="px-4 py-3 text-sm text-gray-700">
                      {renderCellContent(item[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className="p-4 border-t border-gray-200">
          <h1 className="text-xl font-bold mb-4">Data Grid</h1>
          <DataGrid
            columnMap={generateColumnMap()}
            data={flattenedData}
            count={flattenedData.length}
          />
        </div> */}

    </div>
  );
};

export default DataTable;
