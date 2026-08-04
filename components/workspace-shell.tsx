"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GitCompareArrows,
  Github,
  Keyboard,
  Moon,
  ShieldCheck,
  Sun,
  WandSparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { BrandMark } from "@/components/brand-mark";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

interface Shortcut {
  action: string;
  shortcut: string;
}

interface WorkspaceShellProps {
  children: React.ReactNode;
  sidebarControl?: React.ReactNode;
  mobileDock?: React.ReactNode;
  shortcuts: Shortcut[];
}

const tools = [
  { href: "/", label: "Format JSON", icon: WandSparkles },
  { href: "/compare", label: "Compare JSON", icon: GitCompareArrows },
];

export function WorkspaceShell({
  children,
  sidebarControl,
  mobileDock,
  shortcuts,
}: WorkspaceShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-workspace text-foreground">
      <aside className="hidden w-57 shrink-0 flex-col border-e bg-sidebar lg:flex">
        <Brand />
        <div className="flex min-h-0 flex-1 flex-col p-3">
          <nav aria-label="Workspace tools">
            <p className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Workspace
            </p>
            <div className="space-y-1">
              {tools.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-primary/12 text-primary dark:bg-primary/18"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4.5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {sidebarControl ? (
            <div className="mt-6 border-t pt-5">{sidebarControl}</div>
          ) : null}

          <div className="mt-auto space-y-1 pt-5">
            <p className="mb-3 flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2.5 text-xs font-medium leading-5 text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <span>Files stay in this browser</span>
            </p>
            <ShortcutDialog shortcuts={shortcuts} />
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href={config.appUrl} target="_blank" rel="noreferrer">
                <Github />
                GitHub
              </a>
            </Button>
            <ThemeButton />
            <div className="flex gap-3 px-3 pt-2 text-[11px] font-medium text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-4 lg:hidden">
          <Brand compact />
          <div className="flex items-center gap-1">
            <ShortcutDialog shortcuts={shortcuts} compact />
            <ThemeButton compact />
          </div>
        </header>
        <main className="flex min-h-0 flex-1">{children}</main>
        {mobileDock ? (
          <div className="shrink-0 border-t bg-sidebar lg:hidden">{mobileDock}</div>
        ) : null}
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        compact ? "h-auto" : "h-16 border-b px-5"
      )}
    >
      <BrandMark />
      <span className="text-[17px] font-extrabold tracking-[-0.035em]">JsonFlow</span>
    </Link>
  );
}

function ShortcutDialog({ shortcuts, compact = false }: { shortcuts: Shortcut[]; compact?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "default"}
          className={cn(!compact && "w-full justify-start")}
          aria-label={compact ? "Keyboard shortcuts" : undefined}
        >
          <Keyboard />
          {!compact ? <span>Shortcuts</span> : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Run common actions without leaving the editor.</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-4 pt-2 text-sm">
          {shortcuts.map(({ action, shortcut }) => (
            <React.Fragment key={action}>
              <dt>{action}</dt>
              <dd>
                <kbd className="rounded-md border bg-muted px-2 py-1 font-mono text-xs font-semibold">
                  {shortcut}
                </kbd>
              </dd>
            </React.Fragment>
          ))}
        </dl>
        <DialogClose asChild>
          <Button variant="outline" className="mt-2 sm:ms-auto">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function ThemeButton({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "default"}
      className={cn(!compact && "w-full justify-start")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      {!compact ? (
        <>
          <span className="dark:hidden">Dark mode</span>
          <span className="hidden dark:inline">Light mode</span>
        </>
      ) : null}
    </Button>
  );
}
