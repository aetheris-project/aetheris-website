"use client";

import { useEffect, useState } from "react";
import { MapPin, Play, RefreshCw, Square } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver, type TelemetrySample } from "@/components/website/demo/driver";
import { DEMO_NODES, type DemoNode, type DemoServers } from "@/components/website/demo/data";
import { Gauge, MiniBar, Skeleton, StatusPill, useToast } from "@/components/website/demo/ui";

const NODE_TONE: Record<DemoNode["status"], "success" | "warning" | "danger"> = {
  online: "success",
  draining: "warning",
  offline: "danger"
};

export function NodeManagerPanel() {
  const [nodes, setNodes] = useState<DemoNode[]>(DEMO_NODES);
  const [selectedId, setSelectedId] = useState<string>("fra-01");
  const [telemetry, setTelemetry] = useState<TelemetrySample | null>(null);
  const [servers, setServers] = useState<DemoServers[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const toast = useToast();

  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];

  useEffect(() => {
    void mockDriver.listNodes().then(setNodes);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingDetail(true);
    setTelemetry(null);

    void Promise.all([
      mockDriver.getTelemetry(selectedId),
      mockDriver.listServers(selectedId)
    ]).then(([nextTelemetry, nextServers]) => {
      if (cancelled) return;
      setTelemetry(nextTelemetry);
      setServers(nextServers);
      setLoadingDetail(false);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  function selectNode(nodeId: string) {
    if (nodeId !== selectedId) setSelectedId(nodeId);
  }

  function toggleDrain() {
    setNodes((current) =>
      current.map((node) =>
        node.id === selectedId
          ? { ...node, status: node.status === "draining" ? ("online" as const) : ("draining" as const) }
          : node
      )
    );
    const nextStatus = selected.status === "draining" ? "online" : "draining";
    toast.show(
      nextStatus === "draining"
        ? `Node ${selected.name} marked as draining. No new containers scheduled.`
        : `Node ${selected.name} is accepting workloads again.`,
      nextStatus === "draining" ? "warning" : "success"
    );
  }

  return (
    <div className="grid h-full grid-cols-[240px_1fr] overflow-hidden">
      {/* Node list */}
      <aside className="overflow-y-auto border-r border-white/[0.06]">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Nodes</h3>
        </div>
        <ul className="p-2">
          {nodes.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => selectNode(node.id)}
                className={cn(
                  "w-full rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors duration-150",
                  node.id === selectedId
                    ? "border-accent/40 bg-accent-soft"
                    : "hover:bg-white/[0.04]"
                )}
                aria-current={node.id === selectedId ? "true" : undefined}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-xs font-semibold">{node.name}</span>
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", node.status === "online" ? "bg-success" : node.status === "draining" ? "bg-warning" : "bg-danger")} />
                </div>
                <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-muted">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {node.location}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <MiniBar value={node.cpu} />
                  <MiniBar value={node.ram} />
                  <span className="ml-auto font-mono text-[10px] text-muted">
                    {node.cpu}% / {node.ram}%
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Node detail */}
      <section className="overflow-y-auto">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold">{selected.name}</span>
                  <StatusPill tone={NODE_TONE[selected.status]}>{selected.status}</StatusPill>
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  {selected.location} - {selected.cores} vCPU - {selected.memoryGb} GB RAM - {selected.containers} containers
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="aetheris-btn-secondary h-8 px-3" onClick={() => toast.show(`Reboot signal sent to node ${selected.name}.`)}>
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Reboot
              </button>
              <button type="button" className="aetheris-btn-secondary h-8 px-3" onClick={toggleDrain}>
                {selected.status === "draining" ? "Undrain" : "Drain"}
              </button>
            </div>
          </div>
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-3 gap-4 border-b border-white/[0.06] px-4 py-4">
          {loadingDetail || telemetry === null ? (
            <>
              <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-1.5 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-1.5 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-1.5 w-full" /></div>
            </>
          ) : (
            <>
              <Gauge label="CPU" value={telemetry.cpu} display={`${telemetry.cpu}%`} />
              <Gauge label="Memory" value={telemetry.ram} display={`${telemetry.ram}%`} />
              <Gauge label="Disk" value={telemetry.disk} display={`${telemetry.disk}%`} />
            </>
          )}
        </div>

        {/* Servers */}
        <div className="px-4 py-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Running workloads</h4>
          <div className="overflow-hidden rounded-xl border border-white/[0.08]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Server</th>
                  <th scope="col" className="px-3 py-2 font-medium">Egg</th>
                  <th scope="col" className="px-3 py-2 font-medium">Resources</th>
                  <th scope="col" className="px-3 py-2 font-medium">State</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Power</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] bg-transparent">
                {servers.map((server) => (
                  <tr key={server.id}>
                    <td className="px-3 py-2.5 font-mono text-xs">{server.name}</td>
                    <td className="px-3 py-2.5 text-xs text-muted">{server.egg}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted">
                      {server.vcpu} vCPU / {server.memoryGb} GB / {server.diskGb} GB
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusPill tone={server.state === "running" ? "success" : "neutral"}>{server.state}</StatusPill>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        className="aetheris-btn-ghost h-7 w-7 p-0"
                        aria-label={`${server.state === "running" ? "Stop" : "Start"} ${server.name}`}
                        onClick={() =>
                          toast.show(
                            server.state === "running"
                              ? `Stop signal queued for ${server.name}.`
                              : `Start signal queued for ${server.name}.`
                          )
                        }
                      >
                        {server.state === "running" ? <Square className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {toast.node}
    </div>
  );
}
