/**
 * Mock data driver.
 *
 * Presents the same asynchronous contract as the production drivers in
 * aetheris-app. Swapping this module for the real API client is a drop-in
 * replacement: the demo panels never touch the mock directly.
 */

import {
  DEMO_API_KEY,
  DEMO_BACKUPS,
  DEMO_CLIENT_SERVERS,
  DEMO_INVOICES,
  DEMO_NODES,
  DEMO_PAYMENT_METHOD,
  DEMO_PLANS,
  DEMO_SERVERS,
  DEMO_TEMPLATES,
  type DemoApiKey,
  type DemoBackup,
  type DemoClientServer,
  type DemoInvoice,
  type DemoNode,
  type DemoPaymentMethod,
  type DemoPlan,
  type DemoServers,
  type DemoTemplate,
  type InvoiceStatus,
  type PowerSignal,
  type ProvisionRequest,
  type ProvisionResult
} from "./data";

const LATENCY_MS = 240;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export interface TelemetrySample {
  cpu: number;
  ram: number;
  disk: number;
}

export interface PowerSignalResult {
  serverId: string;
  signal: PowerSignal;
  acknowledged: boolean;
}

export interface PayInvoiceResult {
  invoiceId: string;
  status: InvoiceStatus;
  transactionId: string;
}

export interface BackupResult {
  backupId: string;
  status: "completed";
}

export interface MockDriver {
  listNodes(): Promise<DemoNode[]>;
  listServers(nodeId: string): Promise<DemoServers[]>;
  getTelemetry(nodeId: string): Promise<TelemetrySample>;
  sendPowerSignal(serverId: string, signal: PowerSignal): Promise<PowerSignalResult>;
  listInvoices(): Promise<DemoInvoice[]>;
  payInvoice(invoiceId: string): Promise<PayInvoiceResult>;
  getPaymentMethod(): Promise<DemoPaymentMethod>;
  listTemplates(): Promise<DemoTemplate[]>;
  listPlans(): Promise<DemoPlan[]>;
  provisionServer(request: ProvisionRequest): Promise<ProvisionResult>;
  listClientServers(): Promise<DemoClientServer[]>;
  listBackups(serverId: string): Promise<DemoBackup[]>;
  createBackup(serverId: string): Promise<BackupResult>;
  restoreBackup(backupId: string): Promise<{ backupId: string; restored: boolean }>;
  getApiKey(): Promise<DemoApiKey>;
  rotateApiKey(): Promise<DemoApiKey>;
}

export const mockDriver: MockDriver = {
  async listNodes() {
    await delay(LATENCY_MS);
    return DEMO_NODES;
  },

  async listServers(nodeId: string) {
    await delay(LATENCY_MS);
    // fra-01 is the default node in the demo; other nodes return a subset.
    if (nodeId !== "fra-01") return DEMO_SERVERS.slice(0, 2);
    return DEMO_SERVERS;
  },

  async getTelemetry(nodeId: string) {
    await delay(180);
    const node = DEMO_NODES.find((candidate) => candidate.id === nodeId) ?? DEMO_NODES[0];
    return { cpu: node.cpu, ram: node.ram, disk: node.disk };
  },

  async sendPowerSignal(serverId: string, signal: PowerSignal) {
    await delay(420);
    return { serverId, signal, acknowledged: true };
  },

  async listInvoices() {
    await delay(LATENCY_MS);
    return DEMO_INVOICES;
  },

  async payInvoice(invoiceId: string) {
    await delay(520);
    return {
      invoiceId,
      status: "paid",
      transactionId: `pi_demo_${invoiceId.toLowerCase().replace("-", "")}`
    };
  },

  async getPaymentMethod() {
    await delay(120);
    return DEMO_PAYMENT_METHOD;
  },

  async listTemplates() {
    await delay(LATENCY_MS);
    return DEMO_TEMPLATES;
  },

  async listPlans() {
    await delay(120);
    return DEMO_PLANS;
  },

  async provisionServer(request: ProvisionRequest) {
    // Total simulated provisioning time (~2.6s) matches the stage animation.
    await delay(2600);
    const template = DEMO_TEMPLATES.find((candidate) => candidate.id === request.templateId) ?? DEMO_TEMPLATES[0];
    const node = DEMO_NODES.find((candidate) => candidate.id === request.nodeId) ?? DEMO_NODES[0];
    const octet = 20 + Math.floor(Math.random() * 100);
    return {
      serverId: `${template.id}-${node.id}-${Math.random().toString(16).slice(2, 8)}`,
      name: `${template.name.replace(/\s+/g, "")}-${octet}`,
      ipv4: `10.40.0.${octet}`,
      template: template.name,
      node: node.name
    };
  },

  async listClientServers() {
    await delay(LATENCY_MS);
    return DEMO_CLIENT_SERVERS;
  },

  async listBackups(serverId: string) {
    await delay(200);
    // Staging server carries one extra backup in the demo dataset.
    return serverId === "srv-44b1" ? [...DEMO_BACKUPS, { id: "bk-0175", label: "Pre-migration", size: "1.9 GB", createdAt: "2026-08-02 18:12", status: "completed" as const }] : DEMO_BACKUPS;
  },

  async createBackup(serverId: string) {
    await delay(900);
    return { backupId: `bk-${String(Date.now()).slice(-4)}`, status: "completed" as const };
  },

  async restoreBackup(backupId: string) {
    await delay(900);
    return { backupId, restored: true };
  },

  async getApiKey() {
    await delay(120);
    return DEMO_API_KEY;
  },

  async rotateApiKey() {
    await delay(700);
    const secret = "9xY2mQvR4tLp6wBzNcJh3KsFdAe5TgUi".split("").reverse().join("");
    return { ...DEMO_API_KEY, secret };
  }
};
