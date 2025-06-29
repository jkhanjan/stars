export default function KeyValueTable({ entries }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-300 font-medium text-gray-700">
                Property
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-300 font-medium text-gray-700">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border-b border-gray-200 font-medium text-sm">
                  {key}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-sm">
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  