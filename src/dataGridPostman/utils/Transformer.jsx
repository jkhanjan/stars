// utils/transformers.js
export function flattenObject(obj, parentKey = "", separator = ".") {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], newKey, separator));
      } else {
        acc[newKey] = obj[key];
      }
      return acc;
    }, {});
  }
  
  // For arrays of objects, flatten each item
  export function flattenData(data) {
    if (!Array.isArray(data)) return data;
    return data.map(item => flattenObject(item));
  }