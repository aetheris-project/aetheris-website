"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClipboardCopy,
  ExternalLink,
  Keyboard,
  Maximize2,
  Minimize2,
  Monitor,
  Play,
  RotateCcw,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import {
  CONSOLE_BOOT_LOG,
  CONSOLE_STREAMED_LINES,
  DEMO_CLIENT_SERVERS,
  type DemoClientServer,
  type DemoConsoleLine,
  type PowerSignal,
  type PowerState
} from "@/components/website/demo/data";
import { StatusPill, useToast } from "@/components/website/demo/ui";

const LEVEL_COLOR: Record<DemoConsoleLine["level"], string> = {
  info: "text-muted",
  ok: "text-success",
  warn: "text-warning"
};

type VncClient = "novnc" | "tigervnc" | "realvnc" | "console";

const VNC_CLIENTS: Array<{ id: VncClient; label: string; hint: string }> = [
  { id: "novnc", label: "noVNC (web)", hint: "Browser WebSocket client" },
  { id: "tigervnc", label: "TigerVNC", hint: "Desktop client, TLS" },
  { id: "realvnc", label: "RealVNC", hint: "Desktop + mobile" },
  { id: "console", label: "Raw console", hint: "PTY stream, no VNC" }
];

const SERVER_BOOT_LOGS: Record<string, DemoConsoleLine[]> = {
  "srv-8f2a": [
    { time: "13:37:01", level: "info", text: "aetheris-console: session established via wss://console.aetheris.enterprise" },
    { time: "13:37:01", level: "info", text: "pterodactyl: websocket token issued (expires in 3600s)" },
    { time: "13:37:02", level: "ok", text: "systemd: Starting aetheris-vnc-agent.service" },
    { time: "13:37:02", level: "info", text: "kernel: Linux 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC" },
    { time: "13:37:03", level: "ok", text: "systemd: Reached target Multi-User System" },
    { time: "13:37:04", level: "ok", text: "docker: Container 8f2a77ec started on bridge network" },
    { time: "13:37:05", level: "info", text: "app: Node.js v20.16.0 listening on 0.0.0.0:3000" },
    { time: "13:37:06", level: "ok", text: "status: Server ONLINE - 24ms latency" }
  ],
  "srv-19c3": [
    { time: "13:41:12", level: "info", text: "aetheris-console: session established via wss://console.aetheris.enterprise" },
    { time: "13:41:12", level: "ok", text: "systemd: Reached target Multi-User System" },
    { time: "13:41:13", level: "info", text: "kernel: Linux 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC" },
    { time: "13:41:14", level: "ok", text: "docker: Container 19c3a1b4 started on bridge network" },
    { time: "13:41:15", level: "info", text: "nginx: worker processes are ready" },
    { time: "13:41:16", level: "ok", text: "status: Server ONLINE - 31ms latency" }
  ],
  "srv-44b1": [
    { time: "12:02:44", level: "info", text: "aetheris-console: session established via wss://console.aetheris.enterprise" },
    { time: "12:02:45", level: "warn", text: "state: server currently STOPPED - start to boot the container" },
    { time: "12:02:45", level: "info", text: "console: standby mode - press Start to power on" }
  ],
  "srv-a7d0": [
    { time: "13:50:09", level: "info", text: "aetheris-console: session established via wss://console.aetheris.enterprise" },
    { time: "13:50:10", level: "ok", text: "systemd: Reached target Multi-User System" },
    { time: "13:50:11", level: "ok", text: "docker: Container a7d0c3e8 started on bridge network" },
    { time: "13:50:12", level: "info", text: "redis: Ready to accept connections tcp 6379" },
    { time: "13:50:13", level: "ok", text: "status: Server ONLINE - 89ms latency" }
  ]
};

export function VncConsolePanel({
  expanded,
  onToggleExpand
}: {
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const [server, setServer] = useState<DemoClientServer>(DEMO_CLIENT_SERVERS[0]);
  const [client, setClient] = useState<VncClient>("novnc");
  const [powerState, setPowerState] = useState<PowerState>("running");
  const [busySignal, setBusySignal] = useState<PowerSignal | null>(null);
  const [lines, setLines] = useState<DemoConsoleLine[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  // Stream the boot log like a live console feed. Restarts on server switch.
  useEffect(() => {
    const boot = SERVER_BOOT_LOGS[server.id] ?? CONSOLE_BOOT_LOG;
    const all = [...boot, ...CONSOLE_STREAMED_LINES];
    let index = 0;
    setLines([]);
    setPowerState(server.state);
    const timer = setInterval(() => {
      index += 1;
      setLines(all.slice(0, index));
      if (index >= all.length) clearInterval(timer);
    }, 480);
    return () => clearInterval(timer);
  }, [server.id, server.state]);

  // Keep the latest line in view without shifting anything above it.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  async function sendSignal(signal: PowerSignal) {
    if (busySignal) return;
    setBusySignal(signal);
    await mockDriver.sendPowerSignal(server.id, signal);
    setBusySignal(null);

    if (signal === "stop") {
      setPowerState("stopped");
      toast.show(`${server.name} powered off.`, "warning");
    } else if (signal === "start") {
      setPowerState("running");
      toast.show(`${server.name} is booting.`, "success");
    } else {
      setPowerState("running");
      toast.show(`Reboot signal acknowledged for ${server.name}.`, "success");
    }
  }

  function launchClient() {
    if (client === "console") {
      toast.show("Raw console stream active in this panel.", "success");
      return;
    }
    if (client === "novnc") {
      window.open(
        `https://aetheris-app.vercel.app/console/${server.id}?client=novnc`,
        "_blank",
        "noopener,noreferrer"
      );
      toast.show("Opening the live noVNC session in a new tab.", "success");
      return;
    }
    const host = server.ipv4.replace("10.40.", "panel.");
    toast.show(
      `Desktop client: connect to ${host}:5900 with ${client === "tigervnc" ? "TigerVNC" : "RealVNC"}.`,
      "neutral"
    );
  }

  const isRunning = powerState === "running";
  const signalLabel = busySignal ? `Sending ${busySignal}...` : null;
  const activeClient = VNC_CLIENTS.find((candidate) => candidate.id === client) ?? VNC_CLIENTS[0];

  return (
    <div className="flex h-full flex-col">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">{server.name}</span>
              <StatusPill tone={isRunning ? "success" : "neutral"}>
                {isRunning ? "Running" : "Stopped"}
              </StatusPill>
            </div>
            <div className="mt-0.5 truncate font-mono text-xs text-muted">
              {server.ipv4} - {server.region} - {server.egg}
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

      {/* Server + client selectors */}
      <div className="flex flex-wrap items-center gap-2 border-b border-edge px-4 py-2.5">
        <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">
          <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
          Server
          <select
            value={server.id}
            onChange={(event) => {
              const next = DEMO_CLIENT_SERVERS.find((candidate) => candidate.id === event.target.value);
              if (next) setServer(next);
            }}
            className="ml-1 h-7 rounded-lg border border-edge bg-raised px-2 font-mono text-xs text-ink outline-none transition-colors hover:border-accent/40"
          >
            {DEMO_CLIENT_SERVERS.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-edge bg-base/40 p-0.5" role="group" aria-label="VNC client">
          {VNC_CLIENTS.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              title={candidate.hint}
              aria-pressed={client === candidate.id}
              onClick={() => setClient(candidate.id)}
              className={cn(
                "h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors duration-150",
                client === candidate.id ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"
              )}
            >
              {candidate.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="aetheris-btn-primary ml-auto h-8 px-3"
          onClick={launchClient}
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {client === "console" ? "Attach console" : "Launch client"}
        </button>
      </div>

      {/* VNC screen: fixed heights keep the panel inside the frame at every breakpoint */}
      <div className="px-4 pt-4">
        <div className={cn("relative h-52 w-full overflow-hidden rounded-xl border border-edge bg-black shadow-[inset_0_0_60px_rgb(0_0_0/0.6)] sm:h-60 xl:h-[280px]")}>
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
            <span className="font-mono text-[10px] text-muted">
              {activeClient.id === "console" ? "pty" : "1920x1080 @ 60 FPS"}
            </span>
            <span className="font-mono text-[10px] text-success">
              {client === "console" ? "attached - raw stream" : `connected - ${activeClient.label}`}
            </span>
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
