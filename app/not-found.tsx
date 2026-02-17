"use client";

import Link from "next/link";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, FileJson } from "lucide-react";

export default function NotFound() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter opacity-5 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                            <FileJson className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-w-lg relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">JSON Not Found</h2>
                    <p className="text-muted-foreground text-lg">
                        We couldn&apos;t find the page you&apos;re looking for. The URL might be invalid or the page has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button asChild size="lg" className="rounded-xl h-14 px-8 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Back to JSON Formatter
                        </Link>
                    </Button>

                    <Button variant="outline" size="lg" onClick={() => window.history.back()} className="rounded-xl h-14 px-8 font-bold text-lg transition-all hover:bg-muted active:scale-95 border-border/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </div>
                    </Button>
                </div>

                <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-xs font-medium text-muted-foreground/40 uppercase tracking-[0.2em]">
                    <span>Not Found</span>
                    <span>Invalid URL</span>
                    <span>404 Error</span>
                    <span>Missing Page</span>
                </div>
            </div>
        </PageLayout>
    );
}
