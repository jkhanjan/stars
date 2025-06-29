import React from 'react';
import { Loader2, Send } from 'lucide-react';

const RequestForm = ({
  method,
  setMethod,
  url,
  setUrl,
  handleClick,
  loading,
  methods
}) => {
  return (
    <div className="flex gap-3">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {methods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL (e.g., https://jsonplaceholder.typicode.com/posts)"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      <button
        onClick={handleClick}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default RequestForm;