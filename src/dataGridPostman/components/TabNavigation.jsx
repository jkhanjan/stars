import { Settings, FileText, Code } from "lucide-react";

export default function TabNavigation({ activeTab, setActiveTab, getTabCount }) {
  const tabs = [
    { key: "params", label: "Params", icon: Settings },
    { key: "headers", label: "Headers", icon: FileText },
    { key: "body", label: "Body", icon: Code },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 bg-white ${
              activeTab === key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-700 hover:border-blue-300"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {getTabCount(key) > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5 ml-1">
                {getTabCount(key)}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
