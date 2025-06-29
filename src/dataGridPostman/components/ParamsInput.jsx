// components/ParamsInput.jsx
import { Plus, X } from "lucide-react";

export default function ParamsInput({ params, addParam, updateParam, removeParam }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">URL Parameters</h3>
        <button
          onClick={addParam}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50 bg-white"
        >
          <Plus className="w-4 h-4" />
          Add Parameter
        </button>
      </div>
      {params.map((param, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={param.key}
            onChange={(e) => updateParam(index, "key", e.target.value)}
            placeholder="Parameter key"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <input
            type="text"
            value={param.value}
            onChange={(e) => updateParam(index, "value", e.target.value)}
            placeholder="Parameter value"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={() => removeParam(index)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center bg-white"
            disabled={params.length === 1}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
