import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Eye, EyeOff, Expand, Minimize, Download, Copy } from "lucide-react";
import ColumnControls from "./ColumnControls";
import DataTable from "./DataTable";

export default function ResponseTable({ data = [], allKeys = [], onConfigChange }) {
  const flattenObject = (obj, prefix = '') => {
    let flattened = {};
    
    for (let key in obj) {
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
      } else {
        flattened[prefix + key] = obj[key];
      }
    }
    
    return flattened;
  };

  // Get all possible keys from flattened data
  const getAllFlattenedKeys = (dataArray) => {
    const keySet = new Set();
    
    dataArray.forEach(item => {
      const flattened = flattenObject(item);
      Object.keys(flattened).forEach(key => keySet.add(key));
    });
    
    return Array.from(keySet).sort();
  };

  // Create hierarchical structure for sidebar
  const createHierarchicalStructure = (keys) => {
    const hierarchy = {};
    
    keys.forEach(key => {
      const parts = key.split('.');
      let current = hierarchy;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            children: {},
            isLeaf: index === parts.length - 1,
            fullKey: key
          };
        }
        current = current[part].children;
      });
    });
    
    return hierarchy;
  };

  const generateColumnMap = () => {
    const flattenedData = getFlattenedData();
    
    return getVisibleKeys().map(key => ({
      field: key,
      label: formatLabel(key),
      isSortable: true,
      cell: (props) => (
        <div className="text-sm py-1">
          {renderCellContent(props.dataItem[key])}
        </div>
      )
    }));
  };

  const flattenedKeys = getAllFlattenedKeys(data);
  const hierarchicalStructure = createHierarchicalStructure(flattenedKeys);

  const [visibleColumns, setVisibleColumns] = useState(
    flattenedKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const [expandedParents, setExpandedParents] = useState({});
  const [showJsonConfig, setShowJsonConfig] = useState(false);

  // Generate configuration JSON
  const generateConfigJSON = () => {
    const config = {
      timestamp: new Date().toISOString(),
      totalColumns: flattenedKeys.length,
      visibleColumns: Object.keys(visibleColumns).filter(key => visibleColumns[key]),
      hiddenColumns: Object.keys(visibleColumns).filter(key => !visibleColumns[key]),
      columnVisibility: visibleColumns,
      // expandedSections: expandedParents,
      // hierarchy: hierarchicalStructure
    };
    
    return JSON.stringify(config, null, 2);
  };

  // Trigger callback when configuration changes
  useEffect(() => {
    if (onConfigChange) {
      const config = {
        timestamp: new Date().toISOString(),
        totalColumns: flattenedKeys.length,
        visibleColumns: Object.keys(visibleColumns).filter(key => visibleColumns[key]),
        hiddenColumns: Object.keys(visibleColumns).filter(key => !visibleColumns[key]),
        columnVisibility: visibleColumns,
        expandedSections: expandedParents,
        hierarchy: hierarchicalStructure
      };
      onConfigChange(config);
    }
  }, [visibleColumns, expandedParents, onConfigChange]);

  const formatLabel = (key) => {
    const parts = key.split('.');
    return parts[parts.length - 1]
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderCellContent = (value) => {
    if (value === null || value === undefined) return <span className="text-gray-400">—</span>;

    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        return (
          <div className="text-xs space-y-1">
            {value.map((item, index) => (
              <div key={index} className="p-2">
                {Object.entries(item).map(([key, val]) => (
                  <div key={key} className="flex justify-between gap-16">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="">
                      {val === null || val === undefined ? "—" : 
                       typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
      return <span className="text-gray-700">{value.join(", ")}</span>;
    }

    if (typeof value === "object") {
      return (
        <div className="text-xs space-y-1">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="font-medium text-gray-700">{key}:</span>
              <span className="text-gray-600">
                {val === null || val === undefined ? "—" : 
                 typeof val === "object" ? JSON.stringify(val) : String(val)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-700">{String(value)}</span>;
  };

  const getFlattenedData = () => {
    return data.map(item => flattenObject(item));
  };

  const getVisibleKeys = () => {
    return flattenedKeys.filter(key => visibleColumns[key]);
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleParent = (parentKey) => {
    const childKeys = flattenedKeys.filter(key => key.startsWith(parentKey + '.'));
    const allChildrenVisible = childKeys.every(key => visibleColumns[key]);
    
    const newState = !allChildrenVisible;
    setVisibleColumns(prev => {
      const updated = { ...prev };
      childKeys.forEach(key => {
        updated[key] = newState;
      });
      return updated;
    });
  };

  const toggleExpandParent = (parentKey) => {
    setExpandedParents(prev => ({
      ...prev,
      [parentKey]: !prev[parentKey]
    }));
  };

  const toggleAll = (show) => {
    setVisibleColumns(
      flattenedKeys.reduce((acc, key) => ({ ...acc, [key]: show }), {})
    );
  };

  const toggleExpandAll = (expand) => {
    const allParentKeys = Object.keys(hierarchicalStructure);
    const newExpandedState = allParentKeys.reduce((acc, key) => {
      acc[key] = expand;
      return acc;
    }, {});
    setExpandedParents(newExpandedState);
  };

  const copyConfigToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateConfigJSON());
      alert('Configuration copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const renderHierarchicalItem = (key, item, level = 0, parentPath = '') => {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;
    const hasChildren = Object.keys(item.children).length > 0;
    const isExpanded = expandedParents[currentPath];
    
    if (item.isLeaf) {
      return (
        <div 
          key={item.fullKey} 
          className={`flex items-center justify-between gap-2 py-1 hover:bg-gray-100 rounded ${level > 0 ? 'ml-6' : ''}`}
        >
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-700">
              {formatLabel(key)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleColumn(item.fullKey)}
            className={`p-1 rounded-md ${visibleColumns[item.fullKey] ? 'text-blue-500' : 'text-gray-400'}`}
            aria-pressed={visibleColumns[item.fullKey]}
            title={visibleColumns[item.fullKey] ? "Hide column" : "Show column"}
          >
            {visibleColumns[item.fullKey] ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      );
    }

    if (hasChildren) {
      const childKeys = flattenedKeys.filter(k => k.startsWith(currentPath + '.'));
      const allChildrenVisible = childKeys.every(k => visibleColumns[k]);
      const someChildrenVisible = childKeys.some(k => visibleColumns[k]);
      
      return (
        <div key={currentPath} className={level > 0 ? 'ml-4' : ''}>
          <div className="flex items-center justify-between gap-2 py-1 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => toggleExpandParent(currentPath)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 bg-white"
                aria-label={isExpanded ? "Collapse section" : "Expand section"}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <span className="text-sm font-medium text-gray-800">
                {formatLabel(key)}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => toggleParent(currentPath)}
                className={`p-1 bg-white rounded-md ${allChildrenVisible ? 'text-blue-500' : someChildrenVisible ? 'text-blue-300' : 'text-gray-400'}`}
                aria-pressed={allChildrenVisible}
                title={allChildrenVisible ? "Hide all" : "Show all"}
              >
                {allChildrenVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>
          
          {isExpanded && (
            <div className="ml-2 pl-4 border-l-2 border-gray-200">
              {Object.entries(item.children).map(([childKey, childItem]) =>
                renderHierarchicalItem(childKey, childItem, level + 1, currentPath)
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const visibleKeys = getVisibleKeys();
  const flattenedData = getFlattenedData();
  const allParentKeys = Object.keys(hierarchicalStructure);
  const allExpanded = allParentKeys.every(key => expandedParents[key]);

  return (
    <div className="flex gap-6">
      {/* Sidebar - Column Controls */}
      <ColumnControls
        toggleAll={toggleAll}
        toggleExpandAll={toggleExpandAll}
        allExpanded={allExpanded}
        showJsonConfig={showJsonConfig}
        setShowJsonConfig={setShowJsonConfig}
        copyConfigToClipboard={copyConfigToClipboard}
        hierarchicalStructure={hierarchicalStructure}
        renderHierarchicalItem={renderHierarchicalItem}
        visibleKeys={visibleKeys}
        flattenedKeys={flattenedKeys}
        generateConfigJSON={generateConfigJSON}
      />

      {/* Main Content */}
      <DataTable
        visibleKeys={visibleKeys}
        formatLabel={formatLabel}
        getFlattenedData={getFlattenedData}
        renderCellContent={renderCellContent}
        generateColumnMap={generateColumnMap}
        flattenedData={flattenedData}
      />
    </div>
  );
}