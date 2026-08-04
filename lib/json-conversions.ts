import yaml from "js-yaml";

export function jsonToYaml(json: string): string {
  const parsed = JSON.parse(json);
  return yaml.dump(parsed, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });
}

export function jsonToXml(json: string): string {
  const parsed = JSON.parse(json);
  return convertToXml(parsed, "root");
}

function convertToXml(obj: unknown, rootName: string, indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (obj === null) {
    return `${spaces}<${rootName} />`;
  }

  if (typeof obj !== "object") {
    return `${spaces}<${rootName}>${obj}</${rootName}>`;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return `${spaces}<${rootName} />`;
    }
    return obj
      .map((item) => convertToXml(item, rootName, indent))
      .join("\n");
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return `${spaces}<${rootName} />`;
  }

  const children = entries
    .map(([key, value]) => convertToXml(value, key, indent + 1))
    .join("\n");

  return `${spaces}<${rootName}>\n${children}\n${spaces}</${rootName}>`;
}

export function jsonToCsv(json: string): string {
  const parsed = JSON.parse(json);

  // Handle array of objects
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return "";
    }

    const headers = Object.keys(parsed[0]);
    const rows = parsed.map((obj) =>
      headers.map((header) => {
        const value = obj[header];
        if (value === null || value === undefined) {
          return "";
        }
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  }

  // Handle single object - convert to array-like CSV
  if (typeof parsed === "object" && parsed !== null) {
    const entries = Object.entries(parsed);
    return ["key,value", ...entries.map(([key, value]) => {
      const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${key}","${stringValue.replace(/"/g, '""')}"`;
      }
      return `${key},${stringValue}`;
    })].join("\n");
  }

  return "JSON must be an object or array of objects for CSV conversion";
}

export function jsonToPlainText(json: string): string {
  const parsed = JSON.parse(json);
  return stringifyValue(parsed);
}

function stringifyValue(value: unknown, indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (value === null) {
    return "null";
  }

  if (typeof value !== "object") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return value.map((item, index) => `${spaces}[${index}]\n${stringifyValue(item, indent + 1)}`).join("\n");
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return "{}";
  }

  return entries
    .map(([key, val]) => `${spaces}${key}: ${stringifyValue(val, indent + 1)}`)
    .join("\n");
}

export type ConversionType = "yaml" | "xml" | "csv" | "plaintext";

export function convertJson(json: string, type: ConversionType): string {
  switch (type) {
    case "yaml":
      return jsonToYaml(json);
    case "xml":
      return jsonToXml(json);
    case "csv":
      return jsonToCsv(json);
    case "plaintext":
      return jsonToPlainText(json);
    default:
      throw new Error(`Unknown conversion type: ${type}`);
  }
}
