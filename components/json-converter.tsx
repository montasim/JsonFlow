"use client";

import * as React from "react";
import {
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  Copy,
  Download,
  FileJson,
  FolderOpen,
  Minimize2,
  Trash2,
  TreePine,
  XCircle,
} from "lucide-react";

import { CodeEditor } from "@/components/code-editor";
import { JsonTreeView } from "@/components/json-tree-view";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJsonFormatter } from "@/lib/hooks";
import { validateJson } from "@/lib/json-utils";
import {
  DEFAULT_INDENTATION,
  INDENTATION_OPTIONS,
  KEYBOARD_SHORTCUTS,
  MAX_JSON_SIZE,
  type IndentationValue,
} from "@/lib/constants";
import type { ConversionType } from "@/lib/json-conversions";
import { cn } from "@/lib/utils";

const sampleJson = JSON.stringify({
  project: "JsonFlow",
  private: true,
  tools: ["format", "validate", "convert"],
  settings: { indentation: DEFAULT_INDENTATION },
}, null, 2);

const shortcuts = [
  { action: "Format JSON", shortcut: KEYBOARD_SHORTCUTS.FORMAT },
  { action: "Minify JSON", shortcut: KEYBOARD_SHORTCUTS.MINIFY },
  { action: "Download result", shortcut: KEYBOARD_SHORTCUTS.DOWNLOAD },
];

type MobilePanel = "input" | "result";
type ResultView = "code" | "tree";

export function JsonConverter() {
  const {
    input,
    setInput,
    output,
    indentation,
    setIndentation,
    copied,
    isMinified,
    outputFormat,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
    handleDownload,
    handleConvert,
    handleFileUpload,
  } = useJsonFormatter();
  const [mobilePanel, setMobilePanel] = React.useState<MobilePanel>("input");
  const [resultView, setResultView] = React.useState<ResultView>("code");
  const [notice, setNotice] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validation = React.useMemo(() => input.trim() ? validateJson(input) : null, [input]);
  const valid = validation?.valid === true;
  const hasOutput = output.length > 0;
  const treeJson = outputFormat === "json" && hasOutput ? output : input;
  const canShowTree = valid && outputFormat === "json";
  const resultLabel = isMinified ? "Minified" : outputFormat === "plaintext" ? "Text" : outputFormat.toUpperCase();
  const inputStats = React.useMemo(() => getStats(input), [input]);
  const outputStats = React.useMemo(() => getStats(output), [output]);

  const revealResult = React.useCallback(() => {
    setMobilePanel("result");
    setResultView("code");
  }, []);

  const format = React.useCallback(() => {
    if (!valid) return;
    handleFormat();
    revealResult();
    setNotice("JSON formatted");
  }, [handleFormat, revealResult, valid]);

  const minify = React.useCallback(() => {
    if (!valid) return;
    handleMinify();
    revealResult();
    setNotice("JSON minified");
  }, [handleMinify, revealResult, valid]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.key === "Enter") { event.preventDefault(); format(); }
      if (modifier && event.shiftKey && event.key.toLowerCase() === "m") { event.preventDefault(); minify(); }
      if (modifier && event.key.toLowerCase() === "s") { event.preventDefault(); handleDownload(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [format, handleDownload, minify]);

  React.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const openFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) {
      setNotice("Choose a .json file");
      return;
    }
    if (file.size > MAX_JSON_SIZE) {
      setNotice("JSON files must be 10 MB or smaller");
      return;
    }
    handleFileUpload(file);
    setMobilePanel("input");
    setNotice(`${file.name} opened`);
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setMobilePanel("input");
    } catch {
      setNotice("Clipboard access was blocked. Use Ctrl+V in the editor.");
    }
  };

  const convert = (type: ConversionType) => {
    if (!valid) return;
    handleConvert(type);
    revealResult();
    setNotice(`Converted to ${type === "plaintext" ? "plain text" : type.toUpperCase()}`);
  };

  const sidebarControl = (
    <div>
      <label htmlFor="indentation" className="mb-2 block px-1 text-xs font-bold text-muted-foreground">Indentation</label>
      <select
        id="indentation"
        value={String(indentation)}
        onChange={(event) => setIndentation((event.target.value === "tab" ? "tab" : Number(event.target.value)) as IndentationValue)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-ring"
      >
        {INDENTATION_OPTIONS.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const mobileDock = (
    <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-3">
      <Button
        variant={mobilePanel === "input" ? "secondary" : "ghost"}
        className="justify-self-start"
        onClick={() => setMobilePanel("input")}
      >
        Input
      </Button>
      <Button onClick={format} disabled={!valid} className="bg-primary px-4 font-extrabold shadow-lg shadow-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none">
        Format <ArrowRight />
      </Button>
      <Button
        variant={mobilePanel === "result" ? "secondary" : "ghost"}
        className="justify-self-end"
        onClick={() => setMobilePanel("result")}
      >
        Result
      </Button>
    </div>
  );

  return (
    <WorkspaceShell sidebarControl={sidebarControl} shortcuts={shortcuts} mobileDock={mobileDock}>
      {notice ? (
        <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-xl lg:bottom-5">
          {notice}
        </div>
      ) : null}

      <section className={cn("min-w-0 flex-1 flex-col bg-panel", mobilePanel === "result" ? "hidden lg:flex" : "flex")}>
        <div className="flex min-h-20 shrink-0 flex-col justify-center gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-[-0.025em] sm:text-xl">JSON input</h1>
              <ValidationBadge validation={validation} />
            </div>
            <p className="mt-1 hidden text-xs text-muted-foreground sm:block">Paste data, open a file, or load an example.</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={paste}><Clipboard />Paste</Button>
            <Button variant="ghost" size="sm" onClick={() => { setInput(sampleJson); setMobilePanel("input"); }}><Braces />Example</Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><FolderOpen />Open file</Button>
            <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) openFile(file); event.target.value = ""; }} />
          </div>
        </div>

        {validation?.valid === false && validation.error ? (
          <div role="alert" className="flex shrink-0 items-center gap-2 border-b border-destructive/30 bg-destructive/8 px-5 py-2.5 text-sm font-semibold text-destructive">
            <XCircle className="size-4" />
            <span>Line {validation.error.line}: {validation.error.message}</span>
          </div>
        ) : null}

        <CodeEditor
          value={input}
          onChange={(value) => { setInput(value); setNotice(null); }}
          placeholder='Paste JSON here, for example {"project":"JsonFlow"}'
          onFileDrop={openFile}
        />

        <div className="flex h-12 shrink-0 items-center justify-between border-t bg-panel px-4 text-xs text-muted-foreground sm:px-6">
          <span>{formatStats(inputStats)}</span>
          <Button variant="ghost" size="sm" onClick={() => { handleClear(); setMobilePanel("input"); }} disabled={!input && !output} className="text-muted-foreground hover:text-destructive">
            <Trash2 />Clear
          </Button>
        </div>
      </section>

      <div className="hidden w-19 shrink-0 flex-col items-center justify-center border-x bg-workspace lg:flex">
        <Button
          onClick={format}
          disabled={!valid}
          className="h-auto w-14 flex-col gap-2 rounded-xl px-2 py-4 font-extrabold shadow-lg shadow-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <ArrowRight className="size-5" />
          <span className="text-xs">Format</span>
        </Button>
        <Button variant="ghost" onClick={minify} disabled={!valid} className="mt-3 h-auto w-14 flex-col gap-1.5 px-2 py-3 text-muted-foreground">
          <Minimize2 />
          <span className="text-[11px]">Minify</span>
        </Button>
      </div>

      <aside className={cn("min-w-0 flex-1 flex-col bg-result lg:flex lg:max-w-155 lg:basis-[38%]", mobilePanel === "result" ? "flex" : "hidden")}>
        <div className="flex min-h-20 shrink-0 flex-col justify-center gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-[-0.025em] sm:text-xl">Result</h2>
              <span className="rounded-md bg-primary/12 px-2 py-1 text-[11px] font-bold text-primary">{resultLabel}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{hasOutput ? formatStats(outputStats) : "No output yet"}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={async () => { await handleCopy(); setNotice("Result copied"); }} disabled={!hasOutput}>
              {copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!hasOutput}><Download />Save</Button>
          </div>
        </div>

        <div className="flex h-12 shrink-0 items-center justify-between border-b px-4 sm:px-5">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <Button variant={resultView === "code" ? "secondary" : "ghost"} size="sm" onClick={() => setResultView("code")}><Code2 />Code</Button>
            <Button variant={resultView === "tree" ? "secondary" : "ghost"} size="sm" onClick={() => setResultView("tree")} disabled={!canShowTree}><TreePine />Tree</Button>
          </div>
          <Select onValueChange={(value) => convert(value as ConversionType)} disabled={!valid}>
            <SelectTrigger className="h-9 w-30 rounded-lg"><SelectValue placeholder="Convert" /></SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="plaintext">Plain text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {resultView === "tree" ? (
          <JsonTreeView json={treeJson} className="min-h-0 flex-1" />
        ) : (
          <CodeEditor
            value={output}
            readOnly
            language={outputFormat === "json" ? "json" : "text"}
            placeholder="Your formatted result will appear here."
          />
        )}
      </aside>
    </WorkspaceShell>
  );
}

function ValidationBadge({ validation }: { validation: ReturnType<typeof validateJson> | null }) {
  if (!validation) {
    return <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground"><FileJson className="size-3" />Empty</span>;
  }
  if (validation.valid) {
    return <span className="inline-flex items-center gap-1.5 rounded-md bg-success/12 px-2 py-1 text-[11px] font-bold text-success"><CheckCircle2 className="size-3" />Valid</span>;
  }
  return <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-[11px] font-bold text-destructive"><XCircle className="size-3" />Invalid</span>;
}

function getStats(value: string) {
  return {
    lines: value ? value.split("\n").length : 0,
    bytes: typeof TextEncoder === "undefined" ? value.length : new TextEncoder().encode(value).length,
  };
}

function formatStats({ lines, bytes }: { lines: number; bytes: number }) {
  return `${lines} ${lines === 1 ? "line" : "lines"}, ${bytes.toLocaleString()} bytes`;
}
