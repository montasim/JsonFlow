export interface JsonError {
  line: number;
  column: number;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: JsonError;
}

export function formatJson(json: string, indentation: number | string): string {
  const parsed = JSON.parse(json);
  if (indentation === "tab") {
    return JSON.stringify(parsed, null, "\t");
  }
  // Convert string indentation to number (e.g., "2" -> 2)
  const indent = typeof indentation === "string" ? parseInt(indentation, 10) : indentation;
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(json: string): string {
  const parsed = JSON.parse(json);
  return JSON.stringify(parsed);
}

export function validateJson(json: string): ValidationResult {
  if (!json.trim()) {
    return { valid: false, error: { line: 1, column: 1, message: "Empty input" } };
  }

  try {
    JSON.parse(json);
    return { valid: true };
  } catch (e) {
    const error = e as SyntaxError;
    const position = extractErrorPosition(error.message);
    const lineInfo = getLineInfo(json, position.index);
    
    return {
      valid: false,
      error: {
        line: lineInfo.line,
        column: lineInfo.column,
        message: cleanErrorMessage(error.message),
      },
    };
  }
}

function extractErrorPosition(message: string): { index: number } {
  const match = message.match(/position\s+(\d+)/i);
  if (match) {
    return { index: parseInt(match[1], 10) };
  }
  return { index: 0 };
}

function getLineInfo(json: string, position: number): { line: number; column: number } {
  const lines = json.substring(0, position).split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

function cleanErrorMessage(message: string): string {
  return message
    .replace(/position\s+\d+/i, "")
    .replace(/\s+at\s+position\s+\d+/i, "")
    .trim() || "Invalid JSON syntax";
}

export function getJsonStats(json: string): {
  depth: number;
  keyCount: number;
  size: number;
} {
  try {
    const parsed = JSON.parse(json);
    return {
      depth: calculateDepth(parsed),
      keyCount: countKeys(parsed),
      size: new Blob([json]).size,
    };
  } catch {
    return { depth: 0, keyCount: 0, size: json.length };
  }
}

function calculateDepth(obj: unknown, currentDepth = 0): number {
  if (obj === null || typeof obj !== "object") {
    return currentDepth;
  }

  if (Array.isArray(obj)) {
    return Math.max(0, ...obj.map((item) => calculateDepth(item, currentDepth + 1)));
  }

  return Math.max(0, ...Object.values(obj).map((value) => calculateDepth(value, currentDepth + 1)));
}

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== "object") {
    return 0;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((sum, item) => sum + countKeys(item), 0);
  }

  return Object.keys(obj).length + Object.values(obj).reduce((sum, value) => sum + countKeys(value), 0);
}
