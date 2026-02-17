import { useState, useMemo, useCallback, useEffect } from "react";
import { formatJson, minifyJson, validateJson, type ValidationResult } from "./json-utils";
import { convertJson, type ConversionType } from "./json-conversions";
import { STORAGE_KEYS, DEFAULT_INDENTATION, type IndentationValue } from "./constants";

export interface TextStats {
    characters: number;
    words: number;
    sentences: number;
    lines: number;
}

export function useCaseConverter() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const stats: TextStats = useMemo(() => {
        const trimmedText = text.trim();
        return {
            characters: text.length,
            words: trimmedText === "" ? 0 : trimmedText.split(/\s+/).length,
            sentences: trimmedText === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length,
            lines: trimmedText === "" ? 0 : text.split(/\n/).length,
        };
    }, [text]);

    const handleCopy = useCallback(async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    }, [text]);

    const handleDownload = useCallback(() => {
        if (!text) return;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "converted-text.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [text]);

    const handleClear = useCallback(() => {
        setText("");
    }, []);

    const applyConversion = useCallback((conversionFn: (t: string) => string) => {
        if (!text) return;
        setText(prev => conversionFn(prev));
    }, [text]);

    return {
        text,
        setText,
        stats,
        copied,
        handleCopy,
        handleDownload,
        handleClear,
        applyConversion,
    };
}

export type BranchPrefix = "none" | "feature" | "bug" | "custom";

export interface BranchNameGeneratorState {
    taskName: string;
    setTaskName: (name: string) => void;
    prefix: BranchPrefix;
    setPrefix: (prefix: BranchPrefix) => void;
    customPrefix: string;
    setCustomPrefix: (prefix: string) => void;
    divider: "-" | "_";
    setDivider: (divider: "-" | "_") => void;
    branchName: string;
    copied: boolean;
    handleCopy: () => Promise<void>;
    handleClear: () => void;
}

function slugify(text: string, divider: "-" | "_"): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, divider)
        .replace(/^-+|-+$/g, "");
}

export function useBranchNameGenerator(): BranchNameGeneratorState {
    const [taskName, setTaskName] = useState("");
    const [prefix, setPrefix] = useState<BranchPrefix>("none");
    const [customPrefix, setCustomPrefix] = useState("");
    const [divider, setDivider] = useState<"-" | "_">("-");
    const [copied, setCopied] = useState(false);

    const branchName = useMemo(() => {
        if (!taskName.trim()) return "";

        const slugifiedTask = slugify(taskName, divider);

        if (prefix === "none") {
            return slugifiedTask;
        }

        const prefixValue = prefix === "custom" ? customPrefix.toLowerCase() : prefix;

        if (!prefixValue) {
            return slugifiedTask;
        }

        return `${prefixValue}/${slugifiedTask}`;
    }, [taskName, prefix, customPrefix, divider]);

    const handleCopy = useCallback(async () => {
        if (!branchName) return;
        try {
            await navigator.clipboard.writeText(branchName);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy branch name: ", err);
        }
    }, [branchName]);

    const handleClear = useCallback(() => {
        setTaskName("");
        setPrefix("feature");
        setCustomPrefix("");
        setDivider("-");
    }, []);

    return {
        taskName,
        setTaskName,
        prefix,
        setPrefix,
        customPrefix,
        setCustomPrefix,
        divider,
        setDivider,
        branchName,
        copied,
        handleCopy,
        handleClear,
    };
}

export interface JsonFormatterState {
    input: string;
    setInput: (input: string) => void;
    output: string;
    indentation: IndentationValue;
    setIndentation: (indentation: IndentationValue) => void;
    validationResult: ValidationResult | null;
    copied: boolean;
    isMinified: boolean;
    outputFormat: string;
    handleFormat: () => void;
    handleMinify: () => void;
    handleClear: () => void;
    handleCopy: () => Promise<void>;
    handleDownload: () => void;
    handleConvert: (type: ConversionType) => void;
    handleFileUpload: (file: File) => void;
}

export function useJsonFormatter(): JsonFormatterState {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [indentation, setIndentation] = useState<IndentationValue>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEYS.INDENTATION);
            return stored ? (JSON.parse(stored) as IndentationValue) : DEFAULT_INDENTATION;
        }
        return DEFAULT_INDENTATION;
    });
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [isMinified, setIsMinified] = useState(false);
    const [outputFormat, setOutputFormat] = useState("json");

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.INDENTATION, JSON.stringify(indentation));
    }, [indentation]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEYS.LAST_INPUT);
            if (stored) {
                setInput(stored);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (input.trim()) {
                localStorage.setItem(STORAGE_KEYS.LAST_INPUT, input);
            }
        }
    }, [input]);

    const validate = useCallback((json: string) => {
        if (!json.trim()) {
            setValidationResult(null);
            return;
        }
        const result = validateJson(json);
        setValidationResult(result);
    }, []);

    const handleFormat = useCallback(() => {
        if (!input.trim()) return;
        try {
            const formatted = formatJson(input, indentation);
            setOutput(formatted);
            setIsMinified(false);
            setOutputFormat("json");
            validate(formatted);
        } catch (e) {
            const error = e as SyntaxError;
            setValidationResult({
                valid: false,
                error: { line: 1, column: 1, message: error.message },
            });
        }
    }, [input, indentation, validate]);

    const handleMinify = useCallback(() => {
        if (!input.trim()) return;
        try {
            const minified = minifyJson(input);
            setOutput(minified);
            setIsMinified(true);
            setOutputFormat("json");
            validate(minified);
        } catch (e) {
            const error = e as SyntaxError;
            setValidationResult({
                valid: false,
                error: { line: 1, column: 1, message: error.message },
            });
        }
    }, [input, validate]);

    const handleClear = useCallback(() => {
        setInput("");
        setOutput("");
        setValidationResult(null);
        setIsMinified(false);
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEYS.LAST_INPUT);
        }
    }, []);

    const handleCopy = useCallback(async () => {
        const textToCopy = output || input;
        if (!textToCopy) return;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }, [output, input]);

    const handleDownload = useCallback(() => {
        const textToDownload = output || input;
        if (!textToDownload) return;

        const formatExt: Record<string, { ext: string; type: string }> = {
            json: { ext: "json", type: "application/json" },
            yaml: { ext: "yaml", type: "text/yaml" },
            xml: { ext: "xml", type: "application/xml" },
            csv: { ext: "csv", type: "text/csv" },
            plaintext: { ext: "txt", type: "text/plain" },
        };

        const { ext, type } = formatExt[outputFormat] || formatExt.json;
        const blob = new Blob([textToDownload], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `jsonflow-${Date.now()}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [output, input, outputFormat]);

    const handleConvert = useCallback((type: ConversionType) => {
        if (!input.trim()) return;
        try {
            const converted = convertJson(input, type);
            setOutput(converted);
            setOutputFormat(type);
        } catch (e) {
            const error = e as Error;
            setValidationResult({
                valid: false,
                error: { line: 1, column: 1, message: error.message },
            });
        }
    }, [input]);

    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) {
                setInput(content);
                validate(content);
            }
        };
        reader.readAsText(file);
    }, [validate]);

    return {
        input,
        setInput,
        output,
        indentation,
        setIndentation,
        validationResult,
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
    };
}
