import React, { useState } from "react";
import {
  AlertCircle,
} from "lucide-react";
import ApiResponse from "./components/ApiResponse";
import RequestBodyTab from "./components/BodyInput";
import RequestForm from "./components/RequestForm";
import HeadersInput from "./components/HeaderInput";
import ParamsInput from "./components/ParamsInput";
import ResponseTable from "./components/ResponseTable";
import TabNavigation from "./components/TabNavigation";
import KeyValueTable from "./components/KeyValueTable";
import { makeApiCall } from "./utils/ApiCaller";


const ApiTester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [responseView, setResponseView] = useState("json");
  const [activeTab, setActiveTab] = useState("params");
  const [jsonError, setJsonError] = useState("");

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, i) => i !== index));
    }
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const removeParam = (index) => {
    if (params.length > 1) {
      setParams(params.filter((_, i) => i !== index));
    }
  };

  const validateAndFormatJson = (jsonString) => {
    if (!jsonString.trim()) {
      setJsonError("");
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      setJsonError("");
      return JSON.stringify(parsed, null, 2);
    } catch (err) {
      setJsonError(`Invalid JSON: ${err.message}`);
      return null;
    }
  };

  const formatJson = () => {
    const formatted = validateAndFormatJson(body);
    if (formatted !== null) {
      setBody(formatted);
    }
  };

  const minifyJson = () => {
    if (!body.trim()) return;

    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed));
      setJsonError("");
    } catch (err) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  };

  const clearBody = () => {
    setBody("");
    setJsonError("");
  };

  const buildUrlWithParams = () => {
    if (!url.trim()) return "";

    const validParams = params.filter((p) => p.key.trim() && p.value.trim());
    if (validParams.length === 0) return url;

    try {
      const urlObj = new URL(url);
      validParams.forEach((param) => {
        urlObj.searchParams.set(param.key, param.value);
      });
      return urlObj.toString();
    } catch (err) {
      return url;
    }
  };

  const copyResponse = async () => {
    if (response) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const renderTableView = (data) => {
    if (!data || typeof data !== "object") {
      return (
        <div className="text-gray-500 p-4">
          Data is not suitable for table view
        </div>
      );
    }

    // Handle array of objects
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <div className="text-gray-500 p-4">Empty array</div>;
      }

      // Get all unique keys from all objects
      const allKeys = [
        ...new Set(
          data.flatMap((item) =>
            typeof item === "object" && item !== null ? Object.keys(item) : []
          )
        ),
      ];

      if (allKeys.length === 0) {
        return (
          <div className="text-gray-500 p-4">
            Array contains no objects suitable for table view
          </div>
        );
      }

      return (
        data.length > 0 && 
        
        <ResponseTable data={data} allKeys={allKeys} />
      );
    }

    // Handle single object
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return <div className="text-gray-500 p-4">Empty object</div>;
    }

    return (
        <KeyValueTable entries={entries} />
    );
  };

  const handleClick = () => {
    makeApiCall({
      url,
      method,
      headers,
      body,
      buildUrlWithParams,
      validateAndFormatJson,
      setLoading,
      setError,
      setResponse,
    });
  };

  const handleBodyChange = (value) => {
    setBody(value);
    if (value.trim()) {
      validateAndFormatJson(value);
    } else {
      setJsonError("");
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "params":
        return params.filter((p) => p.key.trim() || p.value.trim()).length;
      case "headers":
        return headers.filter((h) => h.key.trim() || h.value.trim()).length;
      case "body":
        return body.trim() ? 1 : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">API Tester</h2>

      {/* Request Section */}
      <div className="space-y-4 mb-6">
        {/* Method and URL */}
        <RequestForm
            method={method}
            setMethod={setMethod}
            url={url}
            setUrl={setUrl}
            handleClick={handleClick}
            loading={loading}
            methods={methods}
            />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} getTabCount={getTabCount} />

        {/* Tab Content */}
        <div className="mt-4">
          {/* Parameters Tab */}
          {activeTab === "params" && (
            <ParamsInput
                params={params}
                addParam={addParam}
                updateParam={updateParam}
                removeParam={removeParam}
            />
            )}

          {/* Headers Tab */}
          {activeTab === "headers" && (
            <HeadersInput
                headers={headers}
                addHeader={addHeader}
                updateHeader={updateHeader}
                removeHeader={removeHeader}
            />
            )}

        {activeTab === "body" && (
        <RequestBodyTab
            body={body}
            method={method}
            jsonError={jsonError}
            handleBodyChange={handleBodyChange}
            formatJson={formatJson}
            minifyJson={minifyJson}
            clearBody={clearBody}
        />
        )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Response Section */}
      <ApiResponse
        response={response}
        responseView={responseView}
        setResponseView={setResponseView}
        copied={copied}
        copyResponse={copyResponse}
        renderTableView={renderTableView}
        />
    </div>
  );
};

export default ApiTester;
