"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface JsonTreeViewProps {
  json: string;
  className?: string;
}

export function JsonTreeView({ json, className }: JsonTreeViewProps) {
  const parsed = React.useMemo(() => {
    try { return JSON.parse(json); } catch { return undefined; }
  }, [json]);

  if (parsed === undefined) {
    return (
      <div className={cn("flex h-full items-center justify-center p-8 text-sm text-muted-foreground", className)}>
        Format valid JSON to inspect its tree.
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-auto p-5 font-mono text-[13px] leading-6 sm:text-sm", className)}>
      <TreeNode label="root" value={parsed} depth={0} />
    </div>
  );
}

function TreeNode({ label, value, depth }: { label: string; value: unknown; depth: number }) {
  const expandable = value !== null && typeof value === "object";
  const [open, setOpen] = React.useState(depth < 2);

  if (!expandable) {
    return (
      <div className="flex min-w-max items-baseline gap-1 rounded-md px-2 py-0.5 hover:bg-muted/70">
        <span className="text-syntax-key">{JSON.stringify(label)}</span>
        <span className="text-muted-foreground">:</span>
        <TreeValue value={value} />
      </div>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const array = Array.isArray(value);

  return (
    <div className={cn(depth > 0 && "ms-3 border-s ps-3")}>
      <div className="flex min-w-max items-center gap-1 rounded-md py-0.5 hover:bg-muted/70">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setOpen((current) => !current)}
          disabled={entries.length === 0}
          aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
        >
          {open ? <ChevronDown /> : <ChevronRight />}
        </Button>
        <span className="text-syntax-key">{JSON.stringify(label)}</span>
        <span className="text-muted-foreground">{array ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </div>
      {open ? entries.map(([key, item]) => (
        <TreeNode key={key} label={key} value={item} depth={depth + 1} />
      )) : null}
    </div>
  );
}

function TreeValue({ value }: { value: unknown }) {
  if (typeof value === "string") return <span className="text-syntax-string">{JSON.stringify(value)}</span>;
  if (typeof value === "number") return <span className="text-syntax-number">{String(value)}</span>;
  if (typeof value === "boolean") return <span className="text-syntax-boolean">{String(value)}</span>;
  return <span className="text-syntax-null">null</span>;
}
