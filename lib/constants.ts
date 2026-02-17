export const DEFAULT_INDENTATION = 2;

export const INDENTATION_OPTIONS = [
  { value: 2, label: "2 spaces" },
  { value: 4, label: "4 spaces" },
  { value: 8, label: "8 spaces" },
  { value: "tab", label: "Tab" },
] as const;

export type IndentationValue = 2 | 4 | 8 | "tab";

export const STORAGE_KEYS = {
  LAST_INPUT: "jsonflow:lastInput",
  THEME: "jsonflow:theme",
  INDENTATION: "jsonflow:indentation",
} as const;

export const MAX_JSON_SIZE = 10 * 1024 * 1024; // 10MB

export const KEYBOARD_SHORTCUTS = {
  FORMAT: "Ctrl+Enter",
  MINIFY: "Ctrl+Shift+M",
  COPY: "Ctrl+C",
  DOWNLOAD: "Ctrl+S",
} as const;
