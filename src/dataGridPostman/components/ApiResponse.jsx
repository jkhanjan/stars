import { useState } from "react";
import { Code, Table, Copy, Check } from "lucide-react";

function check_if_nested(data) {
  if (!Array.isArray(data) || data.length === 0) return false;
  return Object.values(data[0]).some(
    (value) => typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

function flattenObject(obj, parentKey = "", separator = ".", skipPrefixes = []) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = parentKey ? `${parentKey}${separator}${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey, separator, skipPrefixes));
    } else {
      let cleanKey = newKey;
      for (const prefix of skipPrefixes) {
        if (cleanKey.startsWith(prefix + separator)) {
          cleanKey = cleanKey.slice(prefix.length + separator.length);
          break; 
        }
      }
      acc[cleanKey] = value;
    }

    return acc;
  }, {});
}

function flattenData(data, skipPrefixes = []) {
  if (!Array.isArray(data)) return data;
  return data.map((item) => flattenObject(item, "", ".", skipPrefixes));
}

export default function ApiResponse({
  response,
  responseView,
  setResponseView,
  copied,
  copyResponse,
  renderTableView,
}) {
  const [transformedData, setTransformedData] = useState(null);

  const handleTransform = () => {    
    if (!response) {
      return;
    }

    let dataToTransform = response.data || response;
    console.log('Data to transform:', dataToTransform);
    const skipPrefixes = ['data', 'response'];

    if (Array.isArray(dataToTransform)) {
      const flattened = flattenData(dataToTransform, skipPrefixes);
      console.log('Flattened data:', flattened);
      setTransformedData(flattened);
    } else if (typeof dataToTransform === 'object' && dataToTransform !== null) {
      const flattened = flattenObject(dataToTransform, "", ".", skipPrefixes);
      console.log('Flattened object:', flattened);
      setTransformedData([flattened]);
    } else {
      console.log('Data is not an object or array, cannot transform');
      setTransformedData(null);
    }
  };

  const displayData = transformedData || response?.data || response;

  if (!response) return null;

  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Response</h3>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setResponseView("json")}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 bg-white ${
                responseView === "json"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Code className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={() => setResponseView("table")}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 bg-white ${
                responseView === "table"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Table className="w-4 h-4" />
              Table
            </button>
          </div>

          <button
            onClick={copyResponse}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 bg-white"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Response Status */}
      <div className="mb-4 flex items-center gap-4">
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            response.status >= 200 && response.status < 300
              ? "bg-green-100 text-green-800"
              : response.status >= 400
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {response.status} {response.statusText}
        </span>
      </div>

      {/* Response Headers */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Response Headers</h4>
        <div className="bg-gray-50 p-3 rounded-md text-sm font-mono max-h-32 overflow-y-auto">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="text-blue-600">{key}:</span> {value}
            </div>
          ))}
        </div>
      </div>

      {/* Response Body */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Response Body</h4>
        {responseView === "json" ? (
          <pre className="bg-gray-50 p-4 rounded-md text-sm font-mono overflow-auto max-h-96 border">
            {typeof displayData === "string"
              ? displayData
              : JSON.stringify(displayData, null, 2)}
          </pre>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-auto border">
            {!Array.isArray(displayData) || check_if_nested(displayData) ? (
              <div className="text-center py-4">
                <p className="font-semibold">Cannot display data in table format</p>
                <p className="text-sm text-gray-600 mb-2">
                  {transformedData ? 'Data has been transformed with clean headers' : 'Data contains nested objects or is not an array'}
                </p>
                <button
                  onClick={handleTransform}
                  className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                >
                  {transformedData ? 'Transform Again' : 'Transform it'}
                </button>
              </div>
            ) : (
              renderTableView(displayData)
            )}
          </div>
        )}
      </div>
    </div>
  );
}