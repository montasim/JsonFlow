"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  language?: "json" | "text";
  className?: string;
  onFileDrop?: (file: File) => void;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  language = "json",
  className,
  onFileDrop,
}: CodeEditorProps) {
  const lineCount = Math.max(1, value.split("\n").length);
  const lines = React.useMemo(
    () => Array.from({ length: Math.min(lineCount, 5000) }, (_, index) => index + 1),
    [lineCount]
  );
  const gutterRef = React.useRef<HTMLDivElement>(null);

  const syncScroll = (top: number) => {
    if (gutterRef.current) gutterRef.current.scrollTop = top;
  };

  return (
    <div
      className={cn("grid min-h-0 flex-1 grid-cols-[52px_1fr] overflow-hidden bg-editor", className)}
      onDragOver={onFileDrop ? (event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; } : undefined}
      onDrop={onFileDrop ? (event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) onFileDrop(file); } : undefined}
    >
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden border-e bg-gutter py-5 pe-3 text-end font-mono text-[13px] leading-6 text-muted-foreground/65 sm:text-sm"
      >
        {lines.map((line) => <div key={line}>{line}</div>)}
        {lineCount > 5000 ? <div>…</div> : null}
      </div>

      {readOnly ? (
        <pre
          tabIndex={0}
          onScroll={(event) => syncScroll(event.currentTarget.scrollTop)}
          className="min-h-0 overflow-auto whitespace-pre-wrap break-words px-5 py-5 font-mono text-[13px] leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:text-sm"
        >
          {value ? (language === "json" ? <JsonSyntax value={value} /> : value) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </pre>
      ) : (
        <textarea
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onScroll={(event) => syncScroll(event.currentTarget.scrollTop)}
          placeholder={placeholder}
          spellCheck={false}
          className="min-h-0 w-full resize-none overflow-auto bg-transparent px-5 py-5 font-mono text-[13px] leading-6 text-foreground outline-none placeholder:text-muted-foreground/65 focus:bg-primary/[0.015] sm:text-sm"
        />
      )}
    </div>
  );
}

function JsonSyntax({ value }: { value: string }) {
  const tokens = React.useMemo(
    () => value.split(/("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"\s*:|"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?)/g),
    [value]
  );

  return tokens.map((token, index) => {
    let className = "";
    if (/^".*"\s*:$/.test(token)) className = "text-syntax-key";
    else if (/^"/.test(token)) className = "text-syntax-string";
    else if (/^(true|false)$/.test(token)) className = "text-syntax-boolean";
    else if (token === "null") className = "text-syntax-null";
    else if (/^-?\d/.test(token)) className = "text-syntax-number";
    return <span key={`${index}-${token.slice(0, 8)}`} className={className}>{token}</span>;
  });
}
