"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  HardDrive,
  Loader2,
  MapPin,
  MemoryStick,
  Play,
  RotateCcw,
  Square,
  TerminalSquare,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import {
  DEMO_CLIENT_SERVERS,
  type DemoBackup,
  type DemoClientServer,
  type PowerState
} from "@/components/website/demo/data";
import { Gauge, MiniBar, Skeleton, StatusPill, useToast } from "@/components/website/demo/ui";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function ClientPortalPanel() {
  const [servers, setServers] = useState<DemoClientServer[]>(DEMO_CLIENT_SERVERS);
  const [selectedId, setSelectedId] = useState<string>(DEMO_CLIENT_SERVERS[0].id);
  const [backups, setBackups] = useState<DemoBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBackups, setLoadingBackups] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [busySignal, setBusySignal] = useState<"start" | "stop" | "restart" | null>(null);
  const toast = useToast();

  const selected = servers.find((server) => server.id === selectedId) ?? servers[0];

  useEffect(() => {
    let cancelled = false;
    void mockDriver.listClientServers().then((next) => {
      if (cancelled) return;
      setServers(next);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingBackups(true);
    void mockDriver.listBackups(selectedId).then((next) => {
      if (cancelled) return;
      setBackups(next);
      setLoadingBackups(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  function selectServer(serverId: string) {
    if (serverId !== selectedId) setSelectedId(serverId);
  }

  async function sendSignal(signal: "start" | "stop" | "restart") {
    if (busySignal) return;
    setBusySignal(signal);
    await mockDriver.sendPowerSignal(selected.id, signal);
    setBusySignal(null);
    const nextState: PowerState = signal === "stop" ? "stopped" : "running";
    setServers((current) =>
      current.map((server) => (server.id === selected.id ? { ...server, state: nextState } : server))
    );
    toast.show(
      signal === "stop"
        ? `${selected.name} powered off.`
        : signal === "restart"
          ? `Reboot signal acknowledged for ${selected.name}.`
          : `${selected.name} is booting.`,
      signal === "stop" ? "warning" : "success"
    );
  }

  async function createBackup() {
    if (creating) return;
    setCreating(true);
    const result = await mockDriver.createBackup(selected.id);
    setCreating(false);
    const now = new Date().toISOString().slice(0, 10);
    setBackups((current) => [
      { id: result.backupId, label: "Manual snapshot", size: "1.7 GB", createdAt: `${now} ${new Date().toTimeString().slice(0, 5)}`, status: "completed" },
      ...current
    ]);
    toast.show(`Backup ${result.backupId} created and stored.`, "success");
  }

  async function restoreBackup(backupId: string) {
    if (restoringId) return;
    setRestoringId(backupId);
    await mockDriver.restoreBackup(backupId);
    setRestoringId(null);
    toast.show(`Restore from ${backupId} started. Server will reboot on completion.`, "warning");
  }

  const totalMonthly = servers.reduce((sum, server) => sum + server.monthlyCost, 0);
  const runningCount = servers.filter((server) => server.state === "running").length;

  return (
    <div className="flex h-full flex-col overflow-hidden sm:grid sm:grid-cols-[240px_1fr]">
      {/* Server list: horizontal chips on mobile, vertical sidebar on sm+ */}
      <aside className="shrink-0 border-b border-edge sm:overflow-y-auto sm:border-b-0 sm:border-r">
        <div className="border-b border-edge px-3 py-2.5 sm:px-4 sm:py-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">My servers</h3>
        </div>
        <ul className="flex gap-1 overflow-x-auto p-2 sm:flex-col sm:gap-0 sm:overflow-y-auto">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <li key={index} className="p-2.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-3 w-16" />
                </li>
              ))
            : servers.map((server) => (
                <li key={server.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => selectServer(server.id)}
                    className={cn(
                      "w-48 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors duration-150 sm:w-full",
                      server.id === selectedId ? "border-accent/40 bg-accent-soft" : "hover:bg-raised/70"
                    )}
                    aria-current={server.id === selectedId ? "true" : undefined}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs font-semibold">{server.name}</span>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          server.state === "running" ? "bg-success" : "bg-faint"
                        )}
                      />
                    </div>
                    <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-muted">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {server.region.split(" - ")[1]}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <MiniBar value={server.cpu} />
                      <span className="ml-auto font-mono text-[10px] text-muted">{server.plan}</span>
                    </div>
                  </button>
                </li>
              ))}
        </ul>
      </aside>

      {/* Server detail */}
      <section className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-edge px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold">{selected.name}</span>
                  <StatusPill tone={selected.state === "running" ? "success" : "neutral"}>
                    {selected.state}
                  </StatusPill>
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  {selected.ipv4} - {selected.region} - {selected.egg}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://aetheris-panel.vercel.app/console/${selected.id}?client=novnc`}
                target="_blank"
                rel="noopener noreferrer"
                className="aetheris-btn-secondary h-8 px-3"
              >
                <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" />
                Console
              </a>
              <button
                type="button"
                className="aetheris-btn-secondary h-8 px-3"
                disabled={selected.state === "running" || busySignal !== null}
                onClick={() => void sendSignal("start")}
              >
                {busySignal === "start" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                Start
              </button>
              <button
                type="button"
                className="aetheris-btn-secondary h-8 px-3"
                disabled={selected.state !== "running" || busySignal !== null}
                onClick={() => void sendSignal("restart")}
              >
                {busySignal === "restart" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
                Restart
              </button>
              <button
                type="button"
                className="aetheris-btn-secondary h-8 px-3 text-danger hover:border-danger/60 hover:text-danger"
                disabled={selected.state !== "running" || busySignal !== null}
                onClick={() => void sendSignal("stop")}
              >
                {busySignal === "stop" ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Square className="h-3.5 w-3.5" aria-hidden="true" />}
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Resource gauges */}
        <div className="grid grid-cols-4 gap-4 border-b border-edge px-4 py-4">
          <Gauge label="CPU" value={selected.cpu} display={`${selected.cpu}%`} />
          <Gauge label="Memory" value={selected.ram} display={`${selected.ram}%`} />
          <Gauge label="Disk" value={selected.disk} display={`${selected.disk}%`} />
          <Gauge label="Transfer" value={selected.transferUsed} display={`${selected.transferUsed}%`} />
        </div>

        {/* Plan summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-4 py-3">
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-edge bg-raised/70 px-2.5 font-medium">
              <Cpu className="h-3 w-3" aria-hidden="true" />
              {selected.vcpu} vCPU
            </span>
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-edge bg-raised/70 px-2.5 font-medium">
              <MemoryStick className="h-3 w-3" aria-hidden="true" />
              {selected.memoryGb} GB
            </span>
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-edge bg-raised/70 px-2.5 font-medium">
              <HardDrive className="h-3 w-3" aria-hidden="true" />
              {selected.diskGb} GB
            </span>
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-edge bg-raised/70 px-2.5 font-medium">
              <Wifi className="h-3 w-3" aria-hidden="true" />
              {selected.transferUsed}% of {selected.transferGb >= 1000 ? `${selected.transferGb / 1000} TB` : `${selected.transferGb} GB`}
            </span>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-faint">Next due {selected.nextDue}</div>
            <div className="font-mono text-sm font-semibold">{currency(selected.monthlyCost)}/mo</div>
          </div>
        </div>

        {/* Backups */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
              Backups - {backups.length} stored
            </h4>
            <button type="button" className="aetheris-btn-primary h-8 px-3" disabled={creating} onClick={() => void createBackup()}>
              {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Database className="h-3.5 w-3.5" aria-hidden="true" />}
              Create backup
            </button>
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-edge">
            {loadingBackups ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-raised/40 text-xs text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Backup</th>
                    <th scope="col" className="px-3 py-2 font-medium">Size</th>
                    <th scope="col" className="hidden px-3 py-2 font-medium md:table-cell">Created</th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {backups.map((backup) => (
                    <tr key={backup.id} className="transition-colors duration-150 hover:bg-raised/50">
                      <td className="px-3 py-2.5">
                        <div className="font-mono text-xs">{backup.id}</div>
                        <div className="text-[11px] text-muted">{backup.label}</div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-muted">{backup.size}</td>
                      <td className="hidden px-3 py-2.5 text-xs text-muted md:table-cell">{backup.createdAt}</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          className="aetheris-btn-ghost h-7 px-2 text-xs"
                          disabled={restoringId !== null}
                          onClick={() => void restoreBackup(backup.id)}
                        >
                          {restoringId === backup.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer stats */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-raised/40 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-ink">{runningCount} running</span>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span>{servers.length} total servers</span>
            </div>
            <a
              href="https://aetheris-panel.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-edge bg-raised/70 px-2.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              Open portal
            </a>
            <div className="font-mono text-xs text-muted">
              Monthly total <span className="font-semibold text-ink">{currency(totalMonthly)}</span>
            </div>
          </div>
        </div>
      </section>

      {toast.node}
    </div>
  );
}
