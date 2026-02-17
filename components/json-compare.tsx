"use client";

import * as React from "react";
import { JsonEditor } from "@/components/json-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJsonCompare } from "@/lib/useJsonCompare";
import { PageHeader } from "@/components/layout";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { Features } from "@/components/features";
import { FAQs } from "@/components/faqs";
import { KEYBOARD_SHORTCUTS } from "@/lib/constants";
import {
  getDiffTypeColor,
  getDiffTypeLabel,
  type DiffNode,
} from "@/lib/json-compare";
import { JsonToolbar } from "@/components/json-toolbar";
import { JsonTreeView } from "@/components/json-tree-view";
import {
    Braces,
    GitCompare,
    Wand2,
    Zap,
    Files,
    Shield,
    GitBranch, Trash2,
} from "lucide-react";

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
    leftError,
    rightError,
  } = useJsonCompare();

  const [activeTab, setActiveTab] = React.useState("diff");
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(new Set(["root"]));
  const [leftDiffLines, setLeftDiffLines] = React.useState<number[]>([]);
  const [rightDiffLines, setRightDiffLines] = React.useState<number[]>([]);

  const toggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Extract line numbers from diff results based on JSON content
  React.useEffect(() => {
    if (result && leftJson && rightJson) {
      const leftLines = findDiffLines(leftJson, result.diffs, "left");
      const rightLines = findDiffLines(rightJson, result.diffs, "right");
      setLeftDiffLines(leftLines);
      setRightDiffLines(rightLines);
    } else {
      setLeftDiffLines([]);
      setRightDiffLines([]);
    }
  }, [result, leftJson, rightJson]);

  const findDiffLines = (jsonText: string, diffs: DiffNode[], side: "left" | "right"): number[] => {
    const lines = jsonText.split("\n");
    const diffLines: Set<number> = new Set();

    function findLineForPath(path: string): number {
      if (!path || path === "root") return 1;

      // Parse path into segments
      // e.g., "data.responses[5].name" -> ["data", "responses", "[5]", "name"]
      const segments: string[] = [];
      let current = "";
      for (let i = 0; i < path.length; i++) {
        const char = path[i];
        if (char === ".") {
          if (current && current !== "root") segments.push(current);
          current = "";
        } else if (char === "[") {
          if (current && current !== "root") segments.push(current);
          current = "[";
        } else if (char === "]") {
          current += "]";
          segments.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      if (current && current !== "root") segments.push(current);

      if (segments.length === 0) return 1;

      // Track position in segments and depth
      let segIndex = 0;
      let currentDepth = 0;
      let arrayDepth = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Count depth changes
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        const openBrackets = (line.match(/\[/g) || []).length;
        const closeBrackets = (line.match(/\]/g) || []).length;

        // Check if we're looking for an array index
        if (segIndex < segments.length && segments[segIndex].startsWith("[")) {
          const targetIndex = parseInt(segments[segIndex].slice(1, -1));

          // Look for array elements - count opening braces at current array depth
          if (trimmed.startsWith("{")) {
            // Check if this is the target array element
            if (arrayDepth === targetIndex) {
              segIndex++;
              // If this was the last segment, return this line
              if (segIndex === segments.length) {
                return i + 1;
              }
            }
            arrayDepth++;
          }

          // Reset array depth when exiting array
          if (closeBrackets > openBrackets) {
            arrayDepth = 0;
          }
        }
        // Check if we're looking for a key
        else if (segIndex < segments.length) {
          const keyPattern = `"${segments[segIndex]}":`;
          if (trimmed.startsWith(keyPattern)) {
            segIndex++;
            // If this was the last segment, return this line
            if (segIndex === segments.length) {
              return i + 1;
            }
          }
        }

        // Update depth
        currentDepth += openBraces - closeBraces;

        // Reset array depth when exiting an array
        if (closeBrackets > 0 && currentDepth < arrayDepth) {
          arrayDepth = 0;
        }
      }

      // Fallback: search for the last segment anywhere
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        for (let i = 0; i < lines.length; i++) {
          if (lastSegment.startsWith("[")) {
            if (lines[i].includes(lastSegment)) {
              return i + 1;
            }
          } else {
            if (lines[i].includes(`"${lastSegment}":`)) {
              return i + 1;
            }
          }
        }
      }

      return 1;
    }

    function extractLines(node: DiffNode) {
      // For type_changed at root, highlight line 1
      if (node.type === "type_changed" && (!node.path || node.path === "root")) {
        diffLines.add(1);
      }

      // Check if this node represents a diff for the current side
      const isLeftDiff = side === "left" &&
        (node.type === "removed" || node.type === "modified" || node.type === "type_changed");
      const isRightDiff = side === "right" &&
        (node.type === "added" || node.type === "modified" || node.type === "type_changed");

      if (isLeftDiff || isRightDiff) {
        if (node.path && node.path !== "root") {
          const lineNum = findLineForPath(node.path);
          if (lineNum > 0) {
            diffLines.add(lineNum);
          }
        } else {
          diffLines.add(1);
        }
      }

      // Recursively process children
      if (node.children) {
        node.children.forEach(extractLines);
      }
    }

    diffs.forEach(extractLines);
    return Array.from(diffLines).sort((a, b) => a - b);
  };

  const hasContent = leftJson.trim().length > 0 && rightJson.trim().length > 0;
  const isValid = !leftError && !rightError && hasContent;

  return (
      <div className="flex flex-col gap-y-28">
          <div className="w-full flex flex-col">
              {/* Main Editor Area */}
              <div className="h-[calc(100vh-80px)] flex-1 border rounded-xl shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col mb-4">
                  {/* Main Editor Area */}
                  <div className="border rounded-xl shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                      {/* Toolbar */}
                      <div className="flex flex-wrap items-center gap-2 p-4 border-b bg-muted/30">
                          <div className="flex items-center gap-2">
                              <Button
                                  variant="default"
                                  size="sm"
                                  onClick={handleCompare}
                                  disabled={!isValid || isComparing}
                                  className="gap-2"
                              >
                                  <GitCompare className="h-4 w-4" />
                                  Compare
                              </Button>
                          </div>

                          <div className="h-6 w-px bg-border mx-2" />

                          <div className="flex items-center gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleFormatLeft}
                                  disabled={!leftJson.trim()}
                                  className="gap-2"
                              >
                                  <Wand2 className="h-4 w-4" />
                                  Format Left
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleFormatRight}
                                  disabled={!rightJson.trim()}
                                  className="gap-2"
                              >
                                  <Wand2 className="h-4 w-4" />
                                  Format Right
                              </Button>
                          </div>

                          <div className="h-6 w-px bg-border mx-2" />

                          <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleClear}
                              disabled={!leftJson && !rightJson}
                              className="gap-2"
                          >
                              <Trash2 className="h-4 w-4" />
                              Clear All
                          </Button>

                          <div className="ml-auto flex items-center gap-4">
                              <label className="flex items-center gap-2 text-sm">
                                  <input
                                      type="checkbox"
                                      checked={options.ignoreKeyOrder}
                                      onChange={(e) => setOptions({ ignoreKeyOrder: e.target.checked })}
                                      className="rounded border-input"
                                  />
                                  Ignore key order
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                  <input
                                      type="checkbox"
                                      checked={options.compareArraysByValue}
                                      onChange={(e) => setOptions({ compareArraysByValue: e.target.checked })}
                                      className="rounded border-input"
                                  />
                                  Compare arrays by value
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                  <input
                                      type="checkbox"
                                      checked={options.sortKeys}
                                      onChange={(e) => setOptions({ sortKeys: e.target.checked })}
                                      className="rounded border-input"
                                  />
                                  Sort keys
                              </label>
                          </div>
                      </div>

                      {/* Editors and Results */}
                      <div className="h-[600px] md:h-[700px] grid grid-cols-2 gap-0">
                          {/* Left Editor */}
                          <div className="border-r min-h-0 flex flex-col">
                              <div className="px-4 py-2 border-b bg-muted/30 text-sm font-medium flex items-center justify-between">
                                  <span>Left JSON</span>
                                  {leftError && (
                                      <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Invalid
                </span>
                                  )}
                                  {!leftError && leftJson.trim() && (
                                      <span className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Valid
                </span>
                                  )}
                              </div>
                              <div className="flex-1 min-h-0">
                                  <JsonEditor
                                      value={leftJson}
                                      onChange={setLeftJson}
                                      placeholder="Paste first JSON here..."
                                      diffLines={leftDiffLines}
                                      diffSide="left"
                                  />
                              </div>
                          </div>

                          {/* Right Editor */}
                          <div className="min-h-0 flex flex-col">
                              <div className="px-4 py-2 border-b bg-muted/30 text-sm font-medium flex items-center justify-between">
                                  <span>Right JSON</span>
                                  {rightError && (
                                      <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Invalid
                </span>
                                  )}
                                  {!rightError && rightJson.trim() && (
                                      <span className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Valid
                </span>
                                  )}
                              </div>
                              <div className="flex-1 min-h-0">
                                  <JsonEditor
                                      value={rightJson}
                                      onChange={setRightJson}
                                      placeholder="Paste second JSON here..."
                                      diffLines={rightDiffLines}
                                      diffSide="right"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Results Section */}
              {result && (
                  <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden mb-4">
                      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <h3 className="font-semibold">Comparison Results</h3>
                              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-700 dark:text-green-400">
                  +{result.summary.added} Added
                </span>
                                  <span className="px-2 py-1 rounded bg-red-500/20 text-red-700 dark:text-red-400">
                  −{result.summary.removed} Removed
                </span>
                                  <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                  ~{result.summary.modified} Modified
                </span>
                                  {result.summary.typeChanged > 0 && (
                                      <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-700 dark:text-purple-400">
                    !{result.summary.typeChanged} Type Changed
                  </span>
                                  )}
                              </div>
                          </div>
                          <Tabs value={activeTab} onValueChange={setActiveTab}>
                              <TabsList className="bg-transparent h-auto p-0">
                                  <TabsTrigger
                                      value="diff"
                                      className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
                                  >
                                      Diff View
                                  </TabsTrigger>
                                  <TabsTrigger
                                      value="summary"
                                      className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
                                  >
                                      Summary
                                  </TabsTrigger>
                              </TabsList>
                          </Tabs>
                      </div>

                      <div className="p-4 max-h-[400px] overflow-auto">
                          {activeTab === "diff" ? (
                              result.diffs.length > 0 ? (
                                  <DiffTree nodes={result.diffs} expandedPaths={expandedPaths} toggleExpand={toggleExpand} />
                              ) : (
                                  <div className="text-center py-8 text-muted-foreground">
                                      <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                      <p className="text-lg font-medium">No differences found</p>
                                      <p className="text-sm">The two JSON documents are identical</p>
                                  </div>
                              )
                          ) : (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <SummaryCard label="Total Differences" value={result.summary.total} />
                                  <SummaryCard label="Added Keys" value={result.summary.added} color="green" />
                                  <SummaryCard label="Removed Keys" value={result.summary.removed} color="red" />
                                  <SummaryCard label="Modified Values" value={result.summary.modified} color="yellow" />
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {/* Error Display */}
              {error && (
                  <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 mb-4">
                      <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-medium">{error}</span>
                      </div>
                  </div>
              )}

              {/* Keyboard Shortcuts */}
              <KeyboardShortcuts shortcuts={shortcuts} />
          </div>

          {/* Features */}
          <Features features={features} />

          {/* FAQ Section */}
          <FAQs faqs={faqs} />
      </div>
  );
}

function DiffTree({
  nodes,
  expandedPaths,
  toggleExpand,
  depth = 0,
}: {
  nodes: DiffNode[];
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  depth?: number;
}) {
  return (
    <div className="font-mono text-sm space-y-1">
      {nodes.map((node, index) => (
        <DiffNode
          key={node.path || index}
          node={node}
          expandedPaths={expandedPaths}
          toggleExpand={toggleExpand}
          depth={depth}
        />
      ))}
    </div>
  );
}

function DiffNode({
  node,
  expandedPaths,
  toggleExpand,
  depth,
}: {
  node: DiffNode;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  depth: number;
}) {
  const isExpanded = expandedPaths.has(node.path);
  const hasChildren = node.children && node.children.length > 0;
  const colorClass = getDiffTypeColor(node.type);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-muted/50 ${colorClass} border-l-2`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && toggleExpand(node.path)}
      >
        {hasChildren && (
          <span className="w-4 h-4 flex items-center justify-center text-xs">
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        {!hasChildren && <span className="w-4" />}
        <span className="font-medium">{node.key}</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-background/50">
          {getDiffTypeLabel(node.type)}
        </span>
        {node.type === "modified" && (
          <span className="text-xs text-muted-foreground ml-2">
            {JSON.stringify(node.leftValue)} → {JSON.stringify(node.rightValue)}
          </span>
        )}
        {node.type === "type_changed" && (
          <span className="text-xs text-muted-foreground ml-2">
            {node.leftType} → {node.rightType}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <DiffTree nodes={node.children!} expandedPaths={expandedPaths} toggleExpand={toggleExpand} depth={depth + 1} />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: "green" | "red" | "yellow";
}) {
  const colorClasses: Record<string, string> = {
    green: "bg-green-500/20 text-green-700 dark:text-green-400",
    red: "bg-red-500/20 text-red-700 dark:text-red-400",
    yellow: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  };

  return (
    <div className={`rounded-xl border p-4 ${color && colorClasses[color] || "bg-muted"}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

const shortcuts = [
  { action: "Compare", shortcut: "Ctrl+Enter" },
  { action: "Format Left", shortcut: "Ctrl+Shift+L" },
  { action: "Format Right", shortcut: "Ctrl+Shift+R" },
  { action: "Clear All", shortcut: "Ctrl+Shift+X" },
];

const features = [
  { title: "Deep Comparison", description: "Detect added, removed, modified, and type-changed keys in nested JSON structures.", icon: GitCompare },
  { title: "Side-by-Side View", description: "Compare two JSON documents with synchronized editors for easy visual comparison.", icon: Files },
  { title: "Real-time Validation", description: "Instant error detection with clear messages for invalid JSON input.", icon: Zap },
  { title: "Smart Options", description: "Ignore key order, compare arrays by value, or sort keys for flexible comparison.", icon: Wand2 },
  { title: "Diff Summary", description: "Get instant counts of added, removed, and modified keys at a glance.", icon: GitBranch },
  { title: "Expandable Tree", description: "Navigate complex differences with collapsible tree view for nested objects.", icon: Braces },
  { title: "Format First", description: "Format each JSON document independently before comparing for clean results.", icon: Wand2 },
  { title: "100% Private", description: "All comparison happens in your browser. Your data never leaves your device.", icon: Shield },
];

const faqs = [
  { question: "How does JSON comparison work?", answer: "JSON Compare performs a deep structural comparison of two JSON documents, detecting added keys, removed keys, modified values, and type changes. It navigates through nested objects and arrays to find all differences." },
  { question: "Can I compare large JSON files?", answer: "Yes, JSON Compare can handle JSON files up to 10MB. For optimal performance, we recommend keeping files under 5MB for instant comparison results." },
  { question: "What does 'Ignore key order' do?", answer: "When enabled, the comparison treats objects with the same keys in different orders as equal. This is useful when key order doesn't matter in your use case." },
  { question: "How are arrays compared?", answer: "With 'Compare arrays by value' enabled, arrays are compared element by element. Disabled, arrays are compared as whole values using string comparison." },
  { question: "Is my JSON data stored or sent anywhere?", answer: "No. All JSON comparison happens entirely in your browser using JavaScript. Your data never leaves your device and is never stored or logged." },
  { question: "What do the colors mean in the diff view?", answer: "Green indicates added keys, red shows removed keys, yellow highlights modified values, and purple indicates type changes (e.g., string to number)." },
];
