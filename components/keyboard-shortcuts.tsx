interface Shortcut {
  action: string;
  shortcut: string;
}

function ShortcutItem({ action, shortcut }: { action: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">{action}</span>
      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
        {shortcut.replace("+", " + ")}
      </kbd>
    </div>
  );
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 mt-4 mb-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shortcuts.map(({ action, shortcut }) => (
          <ShortcutItem key={action} action={action} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
}
