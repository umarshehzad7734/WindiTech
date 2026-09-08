"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "windii-theme";

/**
 * The active theme lives on <html> (set before paint by ThemeScript), so it is
 * external state as far as React is concerned — we subscribe to it rather than
 * mirroring it into component state.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return !document.documentElement.classList.contains("light");
}

/** Dark is the default, so that is what the server renders. */
function getServerSnapshot() {
  return true;
}

export function ThemeToggle({ className }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("light") ? "dark" : "light";
    root.classList.add(next);
    root.classList.remove(next === "dark" ? "light" : "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode) — the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg-muted",
        "transition-[color,border-color,background-color] duration-[--dur-base] ease-[--ease-out-soft]",
        "hover:border-accent/50 hover:bg-accent-soft hover:text-accent",
        className,
      )}
    >
      {/* Both icons render; CSS picks one, so the button shows the action it
          performs even before hydration. */}
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
    </button>
  );
}
