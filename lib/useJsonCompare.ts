import { useState, useCallback } from "react";
import {
  compareJson,
  type CompareResult,
  type CompareOptions,
} from "@/lib/json-compare";

export interface JsonCompareState {
  leftJson: string;
  rightJson: string;
  setLeftJson: (json: string) => void;
  setRightJson: (json: string) => void;
  result: CompareResult | null;
  isComparing: boolean;
  error: string | null;
  options: CompareOptions;
  setOptions: (options: Partial<CompareOptions>) => void;
  handleCompare: () => void;
  handleClear: () => void;
  handleFormatLeft: () => void;
  handleFormatRight: () => void;
  leftError: string | null;
  rightError: string | null;
}

export function useJsonCompare(): JsonCompareState {
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftError, setLeftError] = useState<string | null>(null);
  const [rightError, setRightError] = useState<string | null>(null);
  const [options, setOptionsState] = useState<CompareOptions>({
    ignoreKeyOrder: true,
    ignoreWhitespace: true,
    ignoreCase: false,
    compareArraysByValue: true,
    sortKeys: false,
  });

  const setOptions = useCallback((newOptions: Partial<CompareOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const validateJson = useCallback((json: string, side: "left" | "right"): string | null => {
    if (!json.trim()) {
      return `${side === "left" ? "Left" : "Right"} JSON is empty`;
    }
    try {
      JSON.parse(json);
      return null;
    } catch (e) {
      const err = e as SyntaxError;
      return `${side === "left" ? "Left" : "Right"} JSON is invalid: ${err.message}`;
    }
  }, []);

  const handleCompare = useCallback(() => {
    setError(null);
    setLeftError(null);
    setRightError(null);
    setResult(null);

    const leftErr = validateJson(leftJson, "left");
    const rightErr = validateJson(rightJson, "right");

    if (leftErr) {
      setLeftError(leftErr);
      return;
    }
    if (rightErr) {
      setRightError(rightErr);
      return;
    }

    setIsComparing(true);

    try {
      const compareResult = compareJson(leftJson, rightJson, options);
      setResult(compareResult);
    } catch (e) {
      const err = e as Error;
      setError(`Comparison failed: ${err.message}`);
    } finally {
      setIsComparing(false);
    }
  }, [leftJson, rightJson, options, validateJson]);

  const handleClear = useCallback(() => {
    setLeftJson("");
    setRightJson("");
    setResult(null);
    setError(null);
    setLeftError(null);
    setRightError(null);
  }, []);

  const handleFormatLeft = useCallback(() => {
    try {
      const parsed = JSON.parse(leftJson);
      setLeftJson(JSON.stringify(parsed, null, 2));
      setLeftError(null);
    } catch {
      // Keep error state
    }
  }, [leftJson]);

  const handleFormatRight = useCallback(() => {
    try {
      const parsed = JSON.parse(rightJson);
      setRightJson(JSON.stringify(parsed, null, 2));
      setRightError(null);
    } catch {
      // Keep error state
    }
  }, [rightJson]);

  return {
    leftJson,
    rightJson,
    setLeftJson,
    setRightJson,
    result,
    isComparing,
    error,
    options,
    setOptions,
    handleCompare,
    handleClear,
    handleFormatLeft,
    handleFormatRight,
    leftError,
    rightError,
  };
}
