"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import { DEMO_INVOICES, DEMO_PAYMENT_METHOD, type DemoInvoice, type DemoPaymentMethod, type InvoiceStatus } from "@/components/website/demo/data";
import { Skeleton, useToast } from "@/components/website/demo/ui";

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  paid: "border-success/30 bg-success/10 text-success",
  pending: "border-warning/30 bg-warning/10 text-warning",
  overdue: "border-danger/30 bg-danger/10 text-danger",
  failed: "border-danger/30 bg-danger/10 text-danger"
};

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function BillingEnginePanel() {
  const [invoices, setInvoices] = useState<DemoInvoice[]>(DEMO_INVOICES);
  const [paymentMethod, setPaymentMethod] = useState<DemoPaymentMethod>(DEMO_PAYMENT_METHOD);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    void Promise.all([mockDriver.listInvoices(), mockDriver.getPaymentMethod()]).then(
      ([nextInvoices, nextMethod]) => {
        if (cancelled) return;
        setInvoices(nextInvoices);
        setPaymentMethod(nextMethod);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const outstanding = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const mrr = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0) + 46961;
  const failedCount = invoices.filter((invoice) => invoice.status === "failed").length;

  async function payInvoice(invoice: DemoInvoice) {
    if (payingId) return;
    setPayingId(invoice.id);
    const result = await mockDriver.payInvoice(invoice.id);
    setInvoices((current) =>
      current.map((candidate) =>
        candidate.id === invoice.id ? { ...candidate, status: result.status } : candidate
      )
    );
    setPayingId(null);
    toast.show(`Payment of ${currency(invoice.amount)} confirmed. Transaction ${result.transactionId}.`, "success");
  }

  const summaryCards = [
    { label: "Monthly recurring revenue", value: currency(mrr), hint: "+3.2% vs last cycle" },
    { label: "Outstanding balance", value: currency(outstanding), hint: "across 3 invoices" },
    { label: "Active subscriptions", value: "1,284", hint: "across 4 nodes" },
    { label: "Failed payments", value: String(failedCount), hint: "dunning active" }
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="overflow-y-auto px-4 py-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aetheris-card p-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-6 w-20" />
                  <Skeleton className="mt-2 h-3 w-28" />
                </div>
              ))
            : summaryCards.map((card) => (
                <div key={card.label} className="aetheris-card p-4">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{card.label}</div>
                  <div className="mt-1.5 text-xl font-bold tracking-tight">{card.value}</div>
                  <div className="mt-1 text-[11px] text-muted">{card.hint}</div>
                </div>
              ))}
        </div>

        {/* Invoice table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Invoices</h3>
            <span className="font-mono text-[11px] text-muted">billing.aetheris.enterprise</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr className="border-b border-white/[0.06] bg-transparent">
                <th scope="col" className="px-4 py-2 font-medium">Invoice</th>
                <th scope="col" className="px-4 py-2 font-medium">Client</th>
                <th scope="col" className="hidden px-4 py-2 font-medium md:table-cell">Description</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">Amount</th>
                <th scope="col" className="px-4 py-2 font-medium">Status</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] bg-transparent">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                      <td className="hidden px-4 py-3 md:table-cell"><Skeleton className="h-4 w-48" /></td>
                      <td className="px-4 py-3"><Skeleton className="ml-auto h-4 w-14" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="px-4 py-3" />
                    </tr>
                  ))
                : invoices.map((invoice) => (
                    <tr key={invoice.id} className={cn(invoice.status === "paid" && "opacity-70")}>
                      <td className="px-4 py-3 font-mono text-xs">{invoice.id}</td>
                      <td className="px-4 py-3 text-xs font-medium">{invoice.client}</td>
                      <td className="hidden px-4 py-3 text-xs text-muted md:table-cell">{invoice.description}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs">{currency(invoice.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-medium", STATUS_STYLE[invoice.status])}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {invoice.status === "paid" ? (
                          <span className="inline-flex h-8 items-center gap-1.5 px-2 text-xs text-muted">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            Paid
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="aetheris-btn-primary h-8 px-3"
                            disabled={payingId !== null}
                            onClick={() => void payInvoice(invoice)}
                          >
                            {payingId === invoice.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            Pay now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Payment method */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-12 items-center justify-center rounded-md border border-edge bg-raised text-[10px] font-bold tracking-tight text-muted">
              VISA
            </span>
            <div>
              <div className="font-mono text-xs">
                {paymentMethod.brand} ending in {paymentMethod.last4}
              </div>
              <div className="mt-0.5 text-[11px] text-muted">
                Expires {paymentMethod.expiry} - default payment method
              </div>
            </div>
          </div>
          <button
            type="button"
            className="aetheris-btn-secondary h-8 px-3"
            onClick={() => toast.show("Redirecting to payment provider to update method (demo).")}
          >
            Update payment method
          </button>
        </div>
      </div>

      {toast.node}
    </div>
  );
}
