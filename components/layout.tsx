"use client";

import * as React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; iconSize?: string; textSize?: string; showText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      {showText ? <span className="text-[17px] font-extrabold tracking-[-0.035em]">{config.appName}</span> : null}
    </span>
  );
}

export function Header() {
  return (
    <header className="border-b bg-sidebar">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="rounded-md focus-visible:ring-2 focus-visible:ring-ring"><Logo /></Link>
        <nav className="ms-auto flex items-center gap-1" aria-label="Primary navigation">
          <Button variant="ghost" asChild><Link href="/">Formatter</Link></Button>
          <Button variant="ghost" asChild><Link href="/compare">Compare</Link></Button>
          <Button variant="ghost" size="icon" asChild><a href={config.appUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a></Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-sidebar">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{config.appName} processes JSON locally in your browser.</p>
        <nav className="flex gap-5" aria-label="Legal links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></nav>
      </div>
    </footer>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-workspace"><Header /><main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">{children}</main><Footer /></div>;
}

export function PageHeader({ title, description, className }: { title: string; description: string; icon?: React.ElementType; gradient?: boolean; className?: string }) {
  return <div className={cn("max-w-2xl space-y-3", className)}><h1 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{title}</h1><p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p></div>;
}

export function InfoCard({ title, description, icon: Icon, className, centered = false }: { title: string; description: string; icon?: React.ElementType; className?: string; centered?: boolean }) {
  return <Card className={cn("shadow-none", className)}><CardContent className={cn("space-y-3 p-6", centered && "text-center")}>{Icon ? <span className={cn("flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary", centered && "mx-auto")}><Icon className="size-5" /></span> : null}<h3 className="font-bold">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{description}</p></CardContent></Card>;
}

export function PageSection({ title, children, icon: Icon, className }: { title: string; children: React.ReactNode; icon?: React.ElementType; className?: string }) {
  return <section className={cn("space-y-3", className)}><div className="flex items-center gap-2">{Icon ? <Icon className="size-4 text-primary" /> : null}<h2 className="text-lg font-bold">{title}</h2></div><div className="space-y-3 leading-7 text-muted-foreground">{children}</div></section>;
}

export function InfoGrid({ children, cols = 3, className }: { children: React.ReactNode; cols?: 1 | 2 | 3 | 4; className?: string }) {
  const columns = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-3", 4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" }[cols];
  return <div className={cn("grid gap-4", columns, className)}>{children}</div>;
}

export function ContentCard({ children, className }: { children: React.ReactNode; className?: string; gradientBar?: boolean }) {
  return <Card className={cn("shadow-none", className)}><CardContent className="space-y-8 p-6 sm:p-8">{children}</CardContent></Card>;
}
