"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleEqual,
  Eraser,
  GitCompareArrows,
  ListTree,
  WandSparkles,
  XCircle,
} from "lucide-react";

import { CodeEditor } from "@/components/code-editor";
import { WorkspaceShell } from "@/components/workspace-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useJsonCompare } from "@/lib/useJsonCompare";
import { validateJson } from "@/lib/json-utils";
import { COMPARE_SHORTCUTS } from "@/lib/constants";
import { getDiffTypeLabel, type DiffNode, type DiffType } from "@/lib/json-compare";
import { cn } from "@/lib/utils";

const shortcuts = [
  { action: "Compare JSON", shortcut: COMPARE_SHORTCUTS.COMPARE },
  { action: "Format left", shortcut: COMPARE_SHORTCUTS.FORMAT_LEFT },
  { action: "Format right", shortcut: COMPARE_SHORTCUTS.FORMAT_RIGHT },
  { action: "Clear both", shortcut: COMPARE_SHORTCUTS.CLEAR_ALL },
];

type MobilePanel = "left" | "right" | "result";

export function JsonCompare() {
  const {
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
  } = useJsonCompare();
  const [mobilePanel, setMobilePanel] = React.useState<MobilePanel>("left");

  const leftValidation = React.useMemo(() => leftJson.trim() ? validateJson(leftJson) : null, [leftJson]);
  const rightValidation = React.useMemo(() => rightJson.trim() ? validateJson(rightJson) : null, [rightJson]);
  const canCompare = leftValidation?.valid && rightValidation?.valid;

  const compare = React.useCallback(() => {
    if (!canCompare) return;
    handleCompare();
    setMobilePanel("result");
  }, [canCompare, handleCompare]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.key === "Enter") { event.preventDefault(); compare(); }
      if (modifier && event.shiftKey && event.key.toLowerCase() === "l") { event.preventDefault(); handleFormatLeft(); }
      if (modifier && event.shiftKey && event.key.toLowerCase() === "r") { event.preventDefault(); handleFormatRight(); }
      if (modifier && event.shiftKey && event.key.toLowerCase() === "x") { event.preventDefault(); handleClear(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [compare, handleClear, handleFormatLeft, handleFormatRight]);

  const sidebarControl = (
    <fieldset className="space-y-3">
      <legend className="mb-3 px-1 text-xs font-bold text-muted-foreground">Comparison options</legend>
      <Option checked={options.ignoreKeyOrder} onCheckedChange={(checked) => setOptions({ ignoreKeyOrder: checked })} label="Ignore key order" />
      <Option checked={options.compareArraysByValue} onCheckedChange={(checked) => setOptions({ compareArraysByValue: checked })} label="Compare arrays by value" />
      <Option checked={options.sortKeys} onCheckedChange={(checked) => setOptions({ sortKeys: checked })} label="Sort keys" />
      <Option checked={options.ignoreCase} onCheckedChange={(checked) => setOptions({ ignoreCase: checked })} label="Ignore text case" />
    </fieldset>
  );

  const mobileDock = (
    <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-3">
      <div className="flex justify-self-start">
        <Button variant={mobilePanel === "left" ? "secondary" : "ghost"} size="sm" onClick={() => setMobilePanel("left")}>Left</Button>
        <Button variant={mobilePanel === "right" ? "secondary" : "ghost"} size="sm" onClick={() => setMobilePanel("right")}>Right</Button>
      </div>
      <Button onClick={compare} disabled={!canCompare || isComparing} className="font-extrabold">Compare <ArrowRight /></Button>
      <Button variant={mobilePanel === "result" ? "secondary" : "ghost"} size="sm" className="justify-self-end" onClick={() => setMobilePanel("result")}>Result</Button>
    </div>
  );

  return (
    <WorkspaceShell sidebarControl={sidebarControl} shortcuts={shortcuts} mobileDock={mobileDock}>
      <div className="flex min-w-0 flex-1 flex-col bg-panel">
        <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <div>
            <h1 className="text-lg font-extrabold tracking-[-0.025em] sm:text-xl">Compare JSON</h1>
            <p className="mt-1 hidden text-xs text-muted-foreground sm:block">Find structural changes between two documents.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!leftJson && !rightJson}><Eraser />Clear</Button>
            <Button onClick={compare} disabled={!canCompare || isComparing} className="hidden font-extrabold sm:flex"><GitCompareArrows />Compare</Button>
          </div>
        </header>

        {error ? <div role="alert" className="border-b border-destructive/30 bg-destructive/8 px-5 py-2.5 text-sm font-semibold text-destructive">{error}</div> : null}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,0.85fr)]">
          <ComparePane
            title="Left JSON"
            value={leftJson}
            onChange={setLeftJson}
            validation={leftValidation}
            onFormat={handleFormatLeft}
            className={cn("border-e", mobilePanel === "left" ? "flex" : "hidden lg:flex")}
          />
          <ComparePane
            title="Right JSON"
            value={rightJson}
            onChange={setRightJson}
            validation={rightValidation}
            onFormat={handleFormatRight}
            className={cn("border-e", mobilePanel === "right" ? "flex" : "hidden lg:flex")}
          />
          <section className={cn("min-h-0 flex-col bg-result", mobilePanel === "result" ? "flex" : "hidden lg:flex")}>
            <div className="flex min-h-14 shrink-0 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2"><ListTree className="size-4 text-primary" /><h2 className="text-sm font-extrabold">Differences</h2></div>
              {result ? <span className="text-xs font-semibold text-muted-foreground">{result.summary.total} total</span> : null}
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {!result ? (
                <EmptyResult />
              ) : result.diffs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center"><CircleEqual className="mb-3 size-9 text-success" /><p className="font-bold">Documents match</p><p className="mt-1 text-sm text-muted-foreground">No structural differences were found.</p></div>
              ) : (
                <>
                  <Summary result={result.summary} />
                  <div className="mt-4 space-y-1 font-mono text-[13px]"><DiffTree nodes={result.diffs} /></div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ComparePane({ title, value, onChange, validation, onFormat, className }: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  validation: ReturnType<typeof validateJson> | null;
  onFormat: () => void;
  className?: string;
}) {
  return (
    <section className={cn("min-h-0 min-w-0 flex-col", className)}>
      <div className="flex min-h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2"><h2 className="text-sm font-extrabold">{title}</h2><CompareStatus validation={validation} /></div>
        <Button variant="ghost" size="sm" onClick={onFormat} disabled={!validation?.valid}><WandSparkles />Format</Button>
      </div>
      {validation?.valid === false ? <div className="border-b border-destructive/30 bg-destructive/8 px-4 py-2 text-xs font-semibold text-destructive">{validation.error?.message}</div> : null}
      <CodeEditor value={value} onChange={onChange} placeholder={`Paste ${title.toLowerCase()} here`} />
    </section>
  );
}

function CompareStatus({ validation }: { validation: ReturnType<typeof validateJson> | null }) {
  if (!validation) return <span className="text-[11px] font-bold text-muted-foreground">Empty</span>;
  return validation.valid
    ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success"><CheckCircle2 className="size-3" />Valid</span>
    : <span className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive"><XCircle className="size-3" />Invalid</span>;
}

function Option({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (checked: boolean) => void; label: string }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} />
      <span>{label}</span>
    </label>
  );
}

function EmptyResult() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <GitCompareArrows className="mb-3 size-9 text-muted-foreground/60" />
      <p className="font-bold">Ready to compare</p>
      <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">Add valid JSON on both sides, then run Compare.</p>
    </div>
  );
}

function Summary({ result }: { result: { added: number; removed: number; modified: number; typeChanged: number } }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <SummaryItem label="Added" value={result.added} tone="added" />
      <SummaryItem label="Removed" value={result.removed} tone="removed" />
      <SummaryItem label="Modified" value={result.modified} tone="modified" />
      <SummaryItem label="Type changed" value={result.typeChanged} tone="type_changed" />
    </div>
  );
}

function SummaryItem({ label, value, tone }: { label: string; value: number; tone: DiffType }) {
  return <div className={cn("rounded-lg border px-3 py-2", toneClass(tone))}><strong className="block text-lg">{value}</strong><span className="text-xs font-semibold">{label}</span></div>;
}

function DiffTree({ nodes, depth = 0 }: { nodes: DiffNode[]; depth?: number }) {
  return nodes.map((node) => <DiffRow key={node.path || node.key} node={node} depth={depth} />);
}

function DiffRow({ node, depth }: { node: DiffNode; depth: number }) {
  const [open, setOpen] = React.useState(depth < 1);
  const hasChildren = Boolean(node.children?.length);
  return (
    <div className={cn(depth > 0 && "ms-3 border-s ps-3")}>
      <button type="button" onClick={() => hasChildren && setOpen((value) => !value)} className={cn("flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left", toneClass(node.type))}>
        {hasChildren ? (open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />) : <span className="w-3.5" />}
        <span className="min-w-0 flex-1 truncate">{node.path || node.key}</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-wide">{getDiffTypeLabel(node.type)}</span>
      </button>
      {open && node.children ? <div className="mt-1 space-y-1"><DiffTree nodes={node.children} depth={depth + 1} /></div> : null}
    </div>
  );
}

function toneClass(type: DiffType) {
  if (type === "added") return "border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300";
  if (type === "removed") return "border-rose-500/25 bg-rose-500/8 text-rose-700 dark:text-rose-300";
  if (type === "modified") return "border-amber-500/25 bg-amber-500/8 text-amber-700 dark:text-amber-300";
  if (type === "type_changed") return "border-sky-500/25 bg-sky-500/8 text-sky-700 dark:text-sky-300";
  return "border-border bg-muted/50 text-muted-foreground";
}
