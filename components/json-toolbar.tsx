"use client";

import * as React from "react";
import {
  Wand2,
  Minimize2,
  Copy,
  Download,
  Trash2,
  Upload,
  Check,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ConversionType } from "@/lib/json-conversions";
import { INDENTATION_OPTIONS, type IndentationValue } from "@/lib/constants";

export interface JsonToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  onCopy: () => Promise<void>;
  onDownload: () => void;
  onFileUpload: (file: File) => void;
  onConvert: (type: ConversionType) => void;
  indentation: IndentationValue;
  onIndentationChange: (indentation: IndentationValue) => void;
  copied: boolean;
  hasContent: boolean;
  isValid?: boolean | null;
}

export function JsonToolbar({
  onFormat,
  onMinify,
  onClear,
  onCopy,
  onDownload,
  onFileUpload,
  onConvert,
  indentation,
  onIndentationChange,
  copied,
  hasContent,
  isValid,
}: JsonToolbarProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    e.target.value = "";
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2 p-4 border-b bg-muted/30">
        {/* Format Actions */}
        <div className="flex items-center gap-2">
          <ActionButton
            icon={Wand2}
            label="Format"
            shortcut="Ctrl+Enter"
            onClick={onFormat}
            disabled={!hasContent}
            primary
          />
          <ActionButton
            icon={Minimize2}
            label="Minify"
            shortcut="Ctrl+Shift+M"
            onClick={onMinify}
            disabled={!hasContent || isValid === false}
          />
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* Clipboard Actions */}
        <div className="flex items-center gap-2">
          <ActionButton
            icon={copied ? Check : Copy}
            label={copied ? "Copied!" : "Copy"}
            shortcut="Ctrl+C"
            onClick={onCopy}
            disabled={!hasContent || isValid === false}
            success={copied}
          />
          <ActionButton
            icon={Download}
            label="Download"
            shortcut="Ctrl+S"
            onClick={onDownload}
            disabled={!hasContent || isValid === false}
          />
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* File Actions */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <ActionButton
            icon={Upload}
            label="Upload"
            onClick={handleFileClick}
          />
          <ActionButton
            icon={Trash2}
            label="Clear"
            onClick={onClear}
            disabled={!hasContent}
            destructive
          />
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* Settings */}
        <div className="flex items-center gap-2">
          <Select
            value={String(indentation)}
            onValueChange={(val) => onIndentationChange(val as IndentationValue)}
            disabled={!hasContent || isValid === false}
          >
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Indent" />
            </SelectTrigger>
            <SelectContent>
              {INDENTATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={onConvert} disabled={!hasContent || isValid === false}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Convert to..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="plaintext">Plain Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Validation Status */}
        {isValid !== undefined && isValid !== null && (
          <div className="ml-auto flex items-center gap-2">
            <div
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                isValid
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {isValid ? "Valid JSON" : "Invalid JSON"}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  destructive?: boolean;
  success?: boolean;
}

function ActionButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  disabled = false,
  primary = false,
  destructive = false,
  success = false,
}: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={primary ? "default" : destructive ? "destructive" : "outline"}
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "gap-2",
            success && "bg-green-600 text-white hover:bg-green-700"
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      </TooltipTrigger>
      {shortcut && (
        <TooltipContent side="bottom">
          <p>{label}</p>
          <p className="text-xs text-muted-foreground">{shortcut}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
