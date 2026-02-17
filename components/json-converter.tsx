"use client";

import * as React from "react";
import { JsonEditor } from "@/components/json-editor";
import { JsonTreeView } from "@/components/json-tree-view";
import { JsonToolbar } from "@/components/json-toolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJsonFormatter } from "@/lib/hooks";
import { Braces, Zap, FileJson, Shield, Trees, FileDown, Copy, Wand2, Upload } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "@/lib/constants";
import type { ConversionType } from "@/lib/json-conversions";
import { InfoGrid, InfoCard } from "@/components/layout";

export function JsonConverter() {
  const {
    input,
    setInput,
    output,
    indentation,
    setIndentation,
    validationResult,
    copied,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
    handleDownload,
    handleConvert,
    handleFileUpload,
  } = useJsonFormatter();

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to format
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleFormat();
      }
      // Ctrl+Shift+M to minify
      if (e.ctrlKey && e.shiftKey && e.key === "M") {
        e.preventDefault();
        handleMinify();
      }
      // Ctrl+S to download
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleDownload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFormat, handleMinify, handleDownload]);

  const handleConvertWrapper = (type: ConversionType) => {
    handleConvert(type);
  };

  const hasContent = input.trim().length > 0;

  return (
    <div className="flex flex-col gap-y-28">
        <div className="w-full h-[calc(100vh-80px)] flex flex-col">
            {/* Main Editor Area */}
            <div className="flex-1 border rounded-xl shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col mb-4">
                <JsonToolbar
                    onFormat={handleFormat}
                    onMinify={handleMinify}
                    onClear={handleClear}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onFileUpload={handleFileUpload}
                    onConvert={handleConvertWrapper}
                    indentation={indentation}
                    onIndentationChange={setIndentation}
                    copied={copied}
                    hasContent={hasContent}
                    isValid={validationResult?.valid ?? null}
                />

                <div className="flex-1 min-h-0">
                    <Tabs defaultValue="editor" className="h-full">
                        <div className="flex items-center justify-between px-4 pt-2 border-b">
                            <TabsList className="bg-transparent h-auto p-0">
                                <TabsTrigger
                                    value="editor"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
                                >
                                    <Braces className="w-4 h-4 mr-2" />
                                    Editor
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tree"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
                                >
                                    Tree View
                                </TabsTrigger>
                            </TabsList>
                            {validationResult && !validationResult.valid && validationResult.error && (
                                <div className="text-sm text-destructive px-2 py-1">
                                    Line {validationResult.error.line}: {validationResult.error.message}
                                </div>
                            )}
                        </div>

                        <TabsContent value="editor" className="h-[calc(100%-50px)] m-0">
                            <div className="h-full grid grid-cols-2 gap-0">
                                {/* Input Editor */}
                                <div className="border-r min-h-0">
                                    <div className="px-4 py-2 border-b bg-muted/30 text-sm font-medium">
                                        Input JSON
                                    </div>
                                    <JsonEditor
                                        value={input}
                                        onChange={setInput}
                                        onFileUpload={handleFileUpload}
                                        placeholder="Paste your JSON here or drag and drop a .json file..."
                                        errorLine={validationResult?.valid === false ? validationResult.error?.line ?? null : null}
                                    />
                                </div>

                                {/* Output Editor */}
                                <div className="min-h-0">
                                    <div className="px-4 py-2 border-b bg-muted/30 text-sm font-medium">
                                        Output
                                    </div>
                                    <JsonEditor
                                        value={output}
                                        readOnly
                                        placeholder="Formatted output will appear here..."
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="tree" className="h-[calc(100%-50px)] m-0">
                            <div className="h-full">
                                <div className="px-4 py-2 border-b bg-muted/30 text-sm font-medium">
                                    Tree View
                                </div>
                                <JsonTreeView json={output || input} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 mt-4 mb-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ShortcutItem action="Format" shortcut={KEYBOARD_SHORTCUTS.FORMAT} />
                    <ShortcutItem action="Minify" shortcut={KEYBOARD_SHORTCUTS.MINIFY} />
                    <ShortcutItem action="Copy" shortcut={KEYBOARD_SHORTCUTS.COPY} />
                    <ShortcutItem action="Download" shortcut={KEYBOARD_SHORTCUTS.DOWNLOAD} />
                </div>
            </div>
        </div>

        {/* Features */}
        <div className="">
            <h3 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Features</h3>
            <InfoGrid cols={4}>
                <InfoCard
                    title="Real-time Validation"
                    description="Instantly detect JSON errors with precise line numbers and clear error messages."
                    icon={Zap}
                />
                <InfoCard
                    title="Format & Beautify"
                    description="Pretty-print JSON with configurable indentation (2/4/8 spaces or tabs)."
                    icon={Wand2}
                />
                <InfoCard
                    title="Minify JSON"
                    description="Compress JSON to single-line format for smaller file sizes."
                    icon={FileDown}
                />
                <InfoCard
                    title="Tree View"
                    description="Navigate complex JSON structures with expandable/collapsible tree view."
                    icon={Trees}
                />
                <InfoCard
                    title="Multi-format Export"
                    description="Convert JSON to YAML, XML, CSV, or plain text instantly."
                    icon={FileJson}
                />
                <InfoCard
                    title="One-click Copy"
                    description="Copy formatted JSON to clipboard with a single click."
                    icon={Copy}
                />
                <InfoCard
                    title="Drag & Drop"
                    description="Upload JSON files by dragging and dropping directly into the editor."
                    icon={Upload}
                />
                <InfoCard
                    title="100% Private"
                    description="All processing happens in your browser. Your JSON data never leaves your device."
                    icon={Shield}
                />
            </InfoGrid>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
            <h3 className="text-2xl font-semibold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FAQItem
                    question="Is my JSON data stored or sent to a server?"
                    answer="No. All JSON processing happens entirely in your browser using JavaScript. Your data never leaves your device and is never stored or logged."
                />
                <FAQItem
                    question="What is the maximum JSON file size supported?"
                    answer="JSONify can handle JSON files up to 10MB. For optimal performance, we recommend keeping files under 5MB for instant formatting and validation."
                />
                <FAQItem
                    question="Can I use JSONify offline?"
                    answer="Yes. Once the page is loaded, JSONify works completely offline. All formatting, validation, and conversion features are available without an internet connection."
                />
                <FAQItem
                    question="What formats can I convert JSON to?"
                    answer="You can convert JSON to YAML, XML, CSV (for arrays or objects), and plain text format. Each conversion maintains the data structure appropriately."
                />
                <FAQItem
                    question="How do I fix invalid JSON?"
                    answer="When JSON is invalid, the error message shows the line number and issue. Common fixes include adding missing commas, closing brackets, or quoting keys properly."
                />
                <FAQItem
                    question="Can I customize the indentation?"
                    answer="Yes. You can choose from 2 spaces, 4 spaces, 8 spaces, or tabs for indentation when formatting your JSON."
                />
            </div>
        </div>
    </div>
  );
}

function ShortcutItem({ action, shortcut }: { action: string; shortcut: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{action}</span>
      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">{shortcut.replace("+", " + ")}</kbd>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-5">
      <h4 className="font-semibold mb-2 text-primary">{question}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  );
}
