
import { Plus, X } from "lucide-react";

export default function HeadersInput({ headers, addHeader, updateHeader, removeHeader }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700 bg-white">Headers</h3>
        <button
          onClick={addHeader}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50 bg-white"
        >
          <Plus className="w-4 h-4" />
          Add Header
        </button>
      </div>
      {headers.map((header, index) => (
        <div key={index} className="flex gap-2 ">
          <input
            type="text"
            value={header.key}
            onChange={(e) => updateHeader(index, "key", e.target.value)}
            placeholder="Header key"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <input
            type="text"
            value={header.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
            placeholder="Header value"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={() => removeHeader(index)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center bg-white"
            disabled={headers.length === 1}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
