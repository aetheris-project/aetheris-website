"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClipboardCopy,
  Keyboard,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import {
  CONSOLE_BOOT_LOG,
  CONSOLE_STREAMED_LINES,
  type DemoConsoleLine,
  type PowerSignal,
  type PowerState
} from "@/components/website/demo/data";
import { StatusPill, useToast } from "@/components/website/demo/ui";

const SERVER_NAME = "Production-01";
const SERVER_IP = "10.40.0.11";

const LEVEL_COLOR: Record<DemoConsoleLine["level"], string> = {
  info: "text-muted",
  ok: "text-success",
  warn: "text-warning"
};

export function VncConsolePanel({
  expanded,
  onToggleExpand
}: {
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const [powerState, setPowerState] = useState<PowerState>("running");
  const [busySignal, setBusySignal] = useState<PowerSignal | null>(null);
  const [lines, setLines] = useState<DemoConsoleLine[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  // Stream the boot log like a live console feed.
  useEffect(() => {
    const all = [...CONSOLE_BOOT_LOG, ...CONSOLE_STREAMED_LINES];
    let index = 0;
    setLines([]);
    const timer = setInterval(() => {
      index += 1;
      setLines(all.slice(0, index));
      if (index >= all.length) clearInterval(timer);
    }, 640);
    return () => clearInterval(timer);
  }, []);

  // Keep the latest line in view without shifting anything above it.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  async function sendSignal(signal: PowerSignal) {
    if (busySignal) return;
    setBusySignal(signal);
    await mockDriver.sendPowerSignal(SERVER_NAME, signal);
    setBusySignal(null);

    if (signal === "stop") {
      setPowerState("stopped");
      toast.show("Stop signal acknowledged. Server powered off.", "warning");
    } else if (signal === "start") {
      setPowerState("running");
      toast.show("Start signal acknowledged. Server booting.", "success");
    } else {
      setPowerState("running");
      toast.show("Restart signal acknowledged. Rebooting container.", "success");
    }
  }

  const isRunning = powerState === "running";
  const signalLabel = busySignal ? `Sending ${busySignal}...` : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">{SERVER_NAME}</span>
              <StatusPill tone={isRunning ? "success" : "neutral"}>
                {isRunning ? "Running" : "Stopped"}
              </StatusPill>
            </div>
            <div className="mt-0.5 truncate font-mono text-xs text-muted">
              {SERVER_IP} - EU West - Frankfurt - 24ms
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="aetheris-btn-secondary h-8 px-3"
            disabled={isRunning || busySignal !== null}
            onClick={() => void sendSignal("start")}
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Start
          </button>
          <button
            type="button"
            className="aetheris-btn-secondary h-8 px-3"
            disabled={!isRunning || busySignal !== null}
            onClick={() => void sendSignal("restart")}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restart
          </button>
          <button
            type="button"
            className="aetheris-btn-secondary h-8 px-3 text-danger hover:border-danger/60 hover:text-danger"
            disabled={!isRunning || busySignal !== null}
            onClick={() => void sendSignal("stop")}
          >
            <Square className="h-3.5 w-3.5" aria-hidden="true" />
            Stop
          </button>
        </div>
      </div>

      {/* VNC screen: fixed heights keep the panel inside the frame at every breakpoint */}
      <div className="px-4 pt-4">
        <div className={cn("relative h-56 w-full overflow-hidden rounded-xl border border-white/[0.1] bg-black sm:h-64 xl:h-[300px]")}>
          <div className="scanline absolute inset-0" aria-hidden="true" />
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto p-4 font-mono text-[11px] leading-[1.7]"
            aria-label="VNC console output"
          >
            {lines.map((line, index) => (
              <div key={`${line.time}-${index}`} className={cn("flex gap-3 whitespace-pre-wrap", LEVEL_COLOR[line.level])}>
                <span className="shrink-0 text-muted/60">{line.time}</span>
                <span className="min-w-0">{line.text}</span>
              </div>
            ))}
            {signalLabel ? (
              <div className="flex gap-3 text-warning">
                <span className="shrink-0 text-muted/60">{new Date().toTimeString().slice(0, 8)}</span>
                <span>{signalLabel}</span>
              </div>
            ) : (
              <span className="ml-[4.5rem] inline-block h-3.5 w-2 animate-pulse bg-accent align-middle" aria-hidden="true" />
            )}
          </div>
          {/* Screen footer bar */}
          <div className="absolute inset-x-0 bottom-0 flex h-8 items-center justify-between border-t border-white/[0.08] bg-black/70 px-3 backdrop-blur-sm">
            <span className="font-mono text-[10px] text-muted">1920x1080 @ 60 FPS</span>
            <span className="font-mono text-[10px] text-success">connected - wss://console.aetheris.enterprise</span>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="aetheris-btn-ghost h-8 px-3 text-xs"
            onClick={() => toast.show("Clipboard content synced to console (demo).")}
          >
            <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
            Clipboard
          </button>
          <button
            type="button"
            className="aetheris-btn-ghost h-8 px-3 text-xs"
            onClick={() => toast.show("Keyboard sequence sent to console (demo).")}
          >
            <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
            Ctrl+Alt+Del
          </button>
        </div>
        <button
          type="button"
          className="aetheris-btn-ghost h-8 px-3 text-xs"
          onClick={onToggleExpand}
          aria-expanded={expanded}
        >
          {expanded ? <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />}
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {toast.node}
    </div>
  );
}
