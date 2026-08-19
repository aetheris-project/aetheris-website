/**
 * Mock data driver.
 *
 * Presents the same asynchronous contract as the production drivers in
 * aetheris-app. Swapping this module for the real API client is a drop-in
 * replacement: the demo panels never touch the mock directly.
 */

import {
  DEMO_INVOICES,
  DEMO_NODES,
  DEMO_PAYMENT_METHOD,
  DEMO_SERVERS,
  type DemoInvoice,
  type DemoNode,
  type DemoPaymentMethod,
  type DemoServers,
  type InvoiceStatus,
  type PowerSignal
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

export interface MockDriver {
  listNodes(): Promise<DemoNode[]>;
  listServers(nodeId: string): Promise<DemoServers[]>;
  getTelemetry(nodeId: string): Promise<TelemetrySample>;
  sendPowerSignal(serverId: string, signal: PowerSignal): Promise<PowerSignalResult>;
  listInvoices(): Promise<DemoInvoice[]>;
  payInvoice(invoiceId: string): Promise<PayInvoiceResult>;
  getPaymentMethod(): Promise<DemoPaymentMethod>;
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
  }
};
