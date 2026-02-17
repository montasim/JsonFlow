"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Braces } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TreeNodeProps {
  name: string | number;
  value: unknown;
  depth: number;
  isLast: boolean;
  path: string;
}

function TreeNode({ name, value, depth, isLast, path }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;
  const isEmpty = isExpandable && Object.keys(value as object).length === 0;

  const getValueType = (val: unknown): string => {
    if (val === null) return "null";
    if (Array.isArray(val)) return "array";
    return typeof val;
  };

  const getValueColor = (val: unknown): string => {
    const type = getValueType(val);
    switch (type) {
      case "string":
        return "text-green-600 dark:text-green-400";
      case "number":
        return "text-blue-600 dark:text-blue-400";
      case "boolean":
        return "text-purple-600 dark:text-purple-400";
      case "null":
        return "text-gray-500 dark:text-gray-400";
      default:
        return "text-foreground";
    }
  };

  const renderValue = (val: unknown): React.ReactNode => {
    if (val === null) {
      return <span className="text-gray-500">null</span>;
    }
    if (typeof val === "string") {
      return (
        <span className={getValueColor(val)}>
          &quot;{val.length > 50 ? val.slice(0, 50) + "..." : val}&quot;
        </span>
      );
    }
    return <span className={getValueColor(val)}>{String(val)}</span>;
  };

  const bracketCount = isExpandable
    ? ` ${Object.keys(value as object).length} ${isObject ? "keys" : "items"}`
    : "";

  if (!isExpandable) {
    return (
      <div
        className="flex items-center gap-1 py-0.5 hover:bg-muted/50 rounded px-2 -mx-2 cursor-pointer"
        title={path}
      >
        <span className="text-muted-foreground">&quot;{name}&quot;</span>
        <span className="text-muted-foreground">:</span>
        {renderValue(value)}
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-1 py-0.5 hover:bg-muted/50 rounded px-2 -mx-2 cursor-pointer"
        onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
        title={path}
      >
        {isEmpty ? (
          <span className="w-4" />
        ) : (
          <Button
            variant="ghost"
            size="icon-xs"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        <span className="text-muted-foreground">&quot;{name}&quot;</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-muted-foreground font-bold">{isArray ? "[" : "{"}</span>
        <span className="text-xs text-muted-foreground">{bracketCount}</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
      {isExpanded && !isEmpty && (
        <div className="ml-4 border-l border-muted pl-2">
          {Object.entries(value as object).map(([key, val], index, arr) => (
            <TreeNode
              key={key}
              name={isArray ? parseInt(key) : key}
              value={val}
              depth={depth + 1}
              isLast={index === arr.length - 1}
              path={`${path}.${key}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface JsonTreeViewProps {
  json: string;
  className?: string;
  searchQuery?: string;
}

export function JsonTreeView({ json, className, searchQuery }: JsonTreeViewProps) {
  const parsed = React.useMemo(() => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [json]);

  if (!parsed) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)}>
        Invalid JSON
      </div>
    );
  }

  const isArray = Array.isArray(parsed);

  return (
    <div className={cn("font-mono text-sm overflow-auto h-full p-4", className)}>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground font-bold">{isArray ? "[" : "{"}</span>
        <span className="text-xs text-muted-foreground">
          {Object.keys(parsed).length} {isArray ? "items" : "keys"}
        </span>
        <span className="text-muted-foreground font-bold">{isArray ? "]" : "}"}</span>
      </div>
      <div className="mt-2">
        {Object.entries(parsed).map(([key, val], index, arr) => (
          <TreeNode
            key={key}
            name={isArray ? parseInt(key) : key}
            value={val}
            depth={0}
            isLast={index === arr.length - 1}
            path={isArray ? `[${key}]` : key}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-muted-foreground font-bold">{isArray ? "[" : "{"}</span>
        <span className="text-muted-foreground font-bold">{isArray ? "]" : "}"}</span>
      </div>
    </div>
  );
}
