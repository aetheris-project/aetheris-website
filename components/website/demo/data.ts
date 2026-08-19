/**
 * Typed mock datasets for the interactive demo.
 *
 * These mirror the shapes produced by the production drivers in aetheris-app
 * (lib/adapters/hypervisors and lib/billing), so the demo panels consume the
 * same contracts the real client portal does.
 */

export type NodeStatus = "online" | "draining" | "offline";
export type PowerState = "running" | "stopped" | "suspended";
export type PowerSignal = "start" | "stop" | "restart";
export type InvoiceStatus = "paid" | "pending" | "overdue" | "failed";

export interface DemoNode {
  id: string;
  name: string;
  location: string;
  status: NodeStatus;
  cpu: number;
  ram: number;
  disk: number;
  cores: number;
  memoryGb: number;
  containers: number;
}

export interface DemoServers {
  id: string;
  name: string;
  state: PowerState;
  vcpu: number;
  memoryGb: number;
  diskGb: number;
  egg: string;
  ipv4: string;
}

export interface DemoInvoice {
  id: string;
  client: string;
  description: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface DemoConsoleLine {
  time: string;
  level: "info" | "ok" | "warn";
  text: string;
}

export interface DemoPaymentMethod {
  brand: string;
  last4: string;
  expiry: string;
  default: boolean;
}

export const DEMO_NODES: DemoNode[] = [
  {
    id: "fra-01",
    name: "fra-01",
    location: "EU West - Frankfurt",
    status: "online",
    cpu: 62,
    ram: 74,
    disk: 58,
    cores: 8,
    memoryGb: 64,
    containers: 23
  },
  {
    id: "iad-02",
    name: "iad-02",
    location: "US East - Ashburn",
    status: "online",
    cpu: 41,
    ram: 52,
    disk: 47,
    cores: 16,
    memoryGb: 128,
    containers: 41
  },
  {
    id: "sin-01",
    name: "sin-01",
    location: "AP South - Singapore",
    status: "online",
    cpu: 23,
    ram: 38,
    disk: 29,
    cores: 8,
    memoryGb: 64,
    containers: 17
  },
  {
    id: "syd-01",
    name: "syd-01",
    location: "AP East - Sydney",
    status: "draining",
    cpu: 12,
    ram: 15,
    disk: 21,
    cores: 4,
    memoryGb: 32,
    containers: 6
  }
];

export const DEMO_SERVERS: DemoServers[] = [
  {
    id: "8f2a77ec",
    name: "Production-01",
    state: "running",
    vcpu: 4,
    memoryGb: 8,
    diskGb: 80,
    egg: "Node.js",
    ipv4: "10.40.0.11"
  },
  {
    id: "19c3a1b4",
    name: "Web-02",
    state: "running",
    vcpu: 2,
    memoryGb: 4,
    diskGb: 40,
    egg: "Node.js",
    ipv4: "10.40.0.12"
  },
  {
    id: "44b1f902",
    name: "Staging-API",
    state: "stopped",
    vcpu: 2,
    memoryGb: 4,
    diskGb: 40,
    egg: "Python",
    ipv4: "10.40.0.13"
  },
  {
    id: "a7d0c3e8",
    name: "Cache-Redis",
    state: "running",
    vcpu: 1,
    memoryGb: 2,
    diskGb: 20,
    egg: "Redis",
    ipv4: "10.40.0.14"
  }
];

export const DEMO_INVOICES: DemoInvoice[] = [
  { id: "INV-10421", client: "Acme Corp", description: "Monthly hosting - 4x Production-01", amount: 249, dueDate: "2026-08-01", status: "paid" },
  { id: "INV-10422", client: "Northwind Ltd", description: "Monthly hosting - 2x Web-02", amount: 89, dueDate: "2026-08-22", status: "pending" },
  { id: "INV-10423", client: "Globex", description: "Overages - bandwidth (1.2 TB)", amount: 412, dueDate: "2026-08-05", status: "overdue" },
  { id: "INV-10424", client: "Initech", description: "Monthly hosting - 1x Staging-API", amount: 129, dueDate: "2026-08-10", status: "failed" },
  { id: "INV-10425", client: "Umbrella Corp", description: "Dedicated - 8x Cache-Redis", amount: 1249, dueDate: "2026-07-28", status: "paid" }
];

export const DEMO_PAYMENT_METHOD: DemoPaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expiry: "08/28",
  default: true
};

export const CONSOLE_BOOT_LOG: DemoConsoleLine[] = [
  { time: "13:37:01", level: "info", text: "aetheris-console: session established via wss://console.aetheris.enterprise" },
  { time: "13:37:01", level: "info", text: "pterodactyl: websocket token issued (expires in 3600s)" },
  { time: "13:37:02", level: "ok", text: "systemd: Starting aetheris-vnc-agent.service" },
  { time: "13:37:02", level: "info", text: "kernel: Linux 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC" },
  { time: "13:37:03", level: "ok", text: "systemd: Reached target Multi-User System" },
  { time: "13:37:04", level: "ok", text: "docker: Container 8f2a77ec started on bridge network" },
  { time: "13:37:05", level: "info", text: "app: Node.js v20.16.0 listening on 0.0.0.0:3000" },
  { time: "13:37:06", level: "ok", text: "status: Server ONLINE - 24ms latency" }
];

export const CONSOLE_STREAMED_LINES: DemoConsoleLine[] = [
  { time: "13:37:08", level: "info", text: "metrics: cpu 12.4% / mem 1.9 GB / net 214 Mbps in, 87 Mbps out" },
  { time: "13:37:11", level: "info", text: "backup: daily snapshot queued (retention 7d)" },
  { time: "13:37:14", level: "ok", text: "health: probe ok (200) from fra-01 across 3 regions" },
  { time: "13:37:17", level: "warn", text: "bandwidth: monthly transfer at 68% of allocation" },
  { time: "13:37:21", level: "info", text: "console: heartbeat 15s interval acknowledged" }
];
