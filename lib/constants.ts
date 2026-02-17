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
  COMPARE_LEFT: "jsonflow:compareLeft",
  COMPARE_RIGHT: "jsonflow:compareRight",
  COMPARE_OPTIONS: "jsonflow:compareOptions",
} as const;

export const MAX_JSON_SIZE = 10 * 1024 * 1024; // 10MB

export const KEYBOARD_SHORTCUTS = {
  FORMAT: "Ctrl+Enter",
  MINIFY: "Ctrl+Shift+M",
  COPY: "Ctrl+C",
  DOWNLOAD: "Ctrl+S",
} as const;

export const COMPARE_SHORTCUTS = {
  COMPARE: "Ctrl+Enter",
  FORMAT_LEFT: "Ctrl+Shift+L",
  FORMAT_RIGHT: "Ctrl+Shift+R",
  CLEAR_ALL: "Ctrl+Shift+X",
} as const;

export const FORMATTER_FEATURES = [
  { title: "Real-time Validation", description: "Instantly detect JSON errors with precise line numbers and clear error messages." },
  { title: "Format & Beautify", description: "Pretty-print JSON with configurable indentation (2/4/8 spaces or tabs)." },
  { title: "Minify JSON", description: "Compress JSON to single-line format for smaller file sizes." },
  { title: "Tree View", description: "Navigate complex JSON structures with expandable/collapsible tree view." },
  { title: "Multi-format Export", description: "Convert JSON to YAML, XML, CSV, or plain text instantly." },
  { title: "One-click Copy", description: "Copy formatted JSON to clipboard with a single click." },
  { title: "Drag & Drop", description: "Upload JSON files by dragging and dropping directly into the editor." },
  { title: "100% Private", description: "All processing happens in your browser. Your JSON data never leaves your device." },
] as const;

export const COMPARE_FEATURES = [
  { title: "Deep Comparison", description: "Detect added, removed, modified, and type-changed keys in nested JSON structures." },
  { title: "Side-by-Side View", description: "Compare two JSON documents with synchronized editors for easy visual comparison." },
  { title: "Real-time Validation", description: "Instant error detection with clear messages for invalid JSON input." },
  { title: "Smart Options", description: "Ignore key order, compare arrays by value, or sort keys for flexible comparison." },
  { title: "Diff Summary", description: "Get instant counts of added, removed, and modified keys at a glance." },
  { title: "Expandable Tree", description: "Navigate complex differences with collapsible tree view for nested objects." },
  { title: "Format First", description: "Format each JSON document independently before comparing for clean results." },
  { title: "100% Private", description: "All comparison happens in your browser. Your data never leaves your device." },
] as const;

export const COMMON_FAQS = [
  { question: "Is my JSON data stored or sent anywhere?", answer: "No. All JSON processing happens entirely in your browser using JavaScript. Your data never leaves your device and is never stored or logged." },
  { question: "What is the maximum JSON file size supported?", answer: "JsonFlow can handle JSON files up to 10MB. For optimal performance, we recommend keeping files under 5MB for instant formatting and validation." },
  { question: "Can I use JsonFlow offline?", answer: "Yes. Once the page is loaded, JsonFlow works completely offline. All formatting, validation, and conversion features are available without an internet connection." },
  { question: "What formats can I convert JSON to?", answer: "You can convert JSON to YAML, XML, CSV (for arrays or objects), and plain text format. Each conversion maintains the data structure appropriately." },
  { question: "How do I fix invalid JSON?", answer: "When JSON is invalid, the error message shows the line number and issue. Common fixes include adding missing commas, closing brackets, or quoting keys properly." },
  { question: "Can I customize the indentation?", answer: "Yes. You can choose from 2 spaces, 4 spaces, 8 spaces, or tabs for indentation when formatting your JSON." },
] as const;

export const COMPARE_FAQS = [
  { question: "How does JSON comparison work?", answer: "JSON Compare performs a deep structural comparison of two JSON documents, detecting added keys, removed keys, modified values, and type changes. It navigates through nested objects and arrays to find all differences." },
  { question: "Can I compare large JSON files?", answer: "Yes, JSON Compare can handle JSON files up to 10MB. For optimal performance, we recommend keeping files under 5MB for instant comparison results." },
  { question: "What does 'Ignore key order' do?", answer: "When enabled, the comparison treats objects with the same keys in different orders as equal. This is useful when key order doesn't matter in your use case." },
  { question: "How are arrays compared?", answer: "With 'Compare arrays by value' enabled, arrays are compared element by element. Disabled, arrays are compared as whole values using string comparison." },
  { question: "Is my JSON data stored or sent anywhere?", answer: "No. All JSON comparison happens entirely in your browser using JavaScript. Your data never leaves your device and is never stored or logged." },
  { question: "What do the colors mean in the diff view?", answer: "Green indicates added keys, red shows removed keys, yellow highlights modified values, and purple indicates type changes (e.g., string to number)." },
] as const;
