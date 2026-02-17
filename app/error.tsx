"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertTriangle, Home, FileJson } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-top-10 duration-700">
                <div className="relative">
                    <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-destructive opacity-5 select-none">
                        500
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                            <FileJson className="w-12 h-12 text-destructive" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-lg relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Something went wrong</h2>
                    <p className="text-muted-foreground text-lg">
                        An unexpected error occurred while processing JSON. Don&apos;t worry, your data is safe and never leaves your browser.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        size="lg"
                        onClick={() => reset()}
                        className="rounded-xl h-14 px-8 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary"
                    >
                        <div className="flex items-center gap-2">
                            <RefreshCcw className="w-5 h-5" />
                            Try Again
                        </div>
                    </Button>

                    <Button variant="outline" size="lg" asChild className="rounded-xl h-14 px-8 font-bold text-lg transition-all hover:bg-muted active:scale-95 border-border/50 backdrop-blur-sm">
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Back to JSON Formatter
                        </Link>
                    </Button>
                </div>

                <div className="pt-8 p-4 bg-muted/30 rounded-2xl border border-border/50 max-w-md w-full">
                    <p className="text-xs font-mono text-muted-foreground break-all">
                        Error ID: {error.digest || "unknown_internal_error"}
                    </p>
                </div>
            </div>
        </PageLayout>
    );
}
