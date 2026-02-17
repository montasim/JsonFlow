"use client";

import * as React from "react";
import Editor, { type OnMount, type EditorProps } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  errorLine?: number | null;
  onFileUpload?: (file: File) => void;
  placeholder?: string;
}

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  className,
  errorLine = null,
  onFileUpload,
  placeholder = "Paste your JSON here...",
}: JsonEditorProps) {
  const { theme } = useTheme();
  const editorRef = React.useRef<Parameters<OnMount>[0]>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Configure JSON diagnostics
    const monaco = (window as any).monaco;
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
        enableSchemaRequest: false,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      onFileUpload?.(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
    }
    e.target.value = "";
  };

  const editorOptions: EditorProps["options"] = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    padding: { top: 12, bottom: 12 },
    wordWrap: "on",
    wrappingIndent: "indent",
    renderWhitespace: "none",
    cursorBlinking: "smooth",
    smoothScrolling: true,
    contextmenu: true,
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    tabCompletion: "on",
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: "full",
    readOnly,
  };

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-lg transition-colors bg-transparent",
        isDragging && "border-2 border-primary bg-primary/5",
        !isDragging && "border-none",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Editor
        height="100%"
        language="json"
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={value}
        onChange={(val) => onChange?.(val || "")}
        onMount={handleEditorMount}
        options={{
          ...editorOptions,
          readOnly,
        }}
        loading={
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading editor...
          </div>
        }
      />

      {/* File upload overlay */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
          <div className="rounded-lg border-2 border-dashed border-primary bg-background p-8 text-center">
            <p className="text-lg font-semibold text-primary">Drop JSON file here</p>
          </div>
        </div>
      )}

      {/* File input (hidden) */}
      <input
        type="file"
        accept=".json"
        onChange={handleFileInput}
        className="hidden"
        id="json-file-input"
      />

      {/* Error line decoration */}
      {errorLine && (
        <div
          className="absolute left-0 right-0 bg-destructive/20 pointer-events-none"
          style={{
            top: `${(errorLine - 1) * 24}px`,
            height: "24px",
          }}
        />
      )}

      {/* Placeholder */}
      {!value && !readOnly && (
        <div className="absolute left-14 top-6 pointer-events-none text-muted-foreground font-mono text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
}
