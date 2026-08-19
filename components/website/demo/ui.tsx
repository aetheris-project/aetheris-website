import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type Tone = "success" | "warning" | "danger" | "neutral" | "accent";

const TONE_DOT: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted",
  accent: "bg-accent"
};

const TONE_TEXT: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-muted",
  accent: "text-accent"
};

export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-edge bg-base px-2.5 text-xs font-medium",
        TONE_TEXT[tone]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[tone], tone === "success" && "animate-pulse-dot")} />
      {children}
    </span>
  );
}

export function Gauge({
  label,
  value,
  display,
  tone
}: {
  label: string;
  value: number;
  display: string;
  tone?: Tone;
}) {
  const barTone = value >= 85 ? "bg-danger" : value >= 70 ? "bg-warning" : "bg-accent";
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="font-mono text-xs text-ink">{display}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-raised" role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", barTone)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="sr-only">{tone}</span>
    </div>
  );
}

export function MiniBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-16 overflow-hidden rounded-full bg-raised" role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label="utilization">
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", value >= 85 ? "bg-danger" : value >= 70 ? "bg-warning" : "bg-accent")}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-raised", className)} />;
}

export function Toast({
  message,
  tone = "accent"
}: {
  message: string;
  tone?: Tone;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex h-10 shrink-0 items-center gap-2 rounded-lg border border-edge bg-raised px-3.5 text-xs font-medium text-ink",
        "animate-fade-in"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[tone])} />
      {message}
    </div>
  );
}

export interface ToastHandle {
  show: (message: string, tone?: Tone) => void;
  node: ReactNode;
}

/**
 * Lightweight toast hook. Renders a fixed-height notification bar beneath the
 * panel content so appearing messages never shift layout.
 */
export function useToast(): ToastHandle {
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("accent");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((nextMessage: string, nextTone: Tone = "accent") => {
    setMessage(nextMessage);
    setTone(nextTone);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), 2600);
  }, []);

  return {
    show,
    node: (
      <div className="mt-3 flex h-10 items-center" aria-live="polite">
        {message ? <Toast message={message} tone={tone} /> : null}
      </div>
    )
  };
}
