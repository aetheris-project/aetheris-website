"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme, type ThemeName } from "@/lib/theme/ThemeProvider";

const OPTIONS: Array<{ id: ThemeName; label: string; icon: typeof Sun }> = [
  { id: "dark", label: "Dark theme", icon: Moon },
  { id: "light", label: "Light theme", icon: Sun },
  { id: "system", label: "System theme", icon: Monitor }
];

/**
 * ThemeToggle
 *
 * Segmented control for the demo frame and site header. Switches between
 * dark, light and system themes through ThemeProvider.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border border-edge bg-base/40 p-1",
        className
      )}
      role="group"
      aria-label="Site theme"
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150",
              active
                ? "bg-raised text-ink ring-1 ring-accent/40"
                : "text-faint hover:bg-raised/70 hover:text-ink"
            )}
            aria-label={option.label}
            aria-pressed={active}
            title={option.label}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
