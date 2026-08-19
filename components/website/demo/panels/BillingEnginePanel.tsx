"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CreditCard,
  Layers,
  Loader2,
  TrendingUp,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import {
  DEMO_INVOICES,
  DEMO_PAYMENT_METHOD,
  PLAN_BREAKDOWN,
  REVENUE_LABELS,
  REVENUE_SERIES,
  type DemoInvoice,
  type DemoPaymentMethod,
  type InvoiceStatus
} from "@/components/website/demo/data";
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

/** SVG area chart for the MRR series. */
function RevenueChart({ series }: { series: number[] }) {
  const W = 620;
  const H = 150;
  const PAD = 10;

  const { path, area, min, max, step, lastPoint } = useMemo(() => {
    const values = series;
    const minimum = Math.min(...values) * 0.96;
    const maximum = Math.max(...values) * 1.03;
    const xStep = (W - PAD * 2) / (values.length - 1);
    const points = values.map((value, index) => ({
      x: PAD + index * xStep,
      y: H - PAD - ((value - minimum) / (maximum - minimum)) * (H - PAD * 2)
    }));
    const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    return {
      path: line,
      area: `${line} L${(PAD + (values.length - 1) * xStep).toFixed(1)},${H - PAD} L${PAD},${H - PAD} Z`,
      min: minimum,
      max: maximum,
      step: xStep,
      lastPoint: points[points.length - 1]
    };
  }, [series]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-36 w-full"
      role="img"
      aria-label="Monthly recurring revenue, last 12 months"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mrr-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "rgb(var(--aetheris-accent))", stopOpacity: 0.28 }} />
          <stop offset="100%" style={{ stopColor: "rgb(var(--aetheris-accent))", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Horizontal gridlines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={PAD}
          x2={W - PAD}
          y1={H - PAD - t * (H - PAD * 2)}
          y2={H - PAD - t * (H - PAD * 2)}
          stroke="rgb(var(--aetheris-border))"
          strokeDasharray="3 5"
          strokeWidth="1"
        />
      ))}

      <path d={area} fill="url(#mrr-fill)" />
      <path
        d={path}
        fill="none"
        style={{ stroke: "rgb(var(--aetheris-accent))" }}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Hover targets + labels */}
      {series.map((value, index) => (
        <g key={REVENUE_LABELS[index]}>
          <circle cx={PAD + index * step} cy={H - PAD - ((value - min) / (max - min)) * (H - PAD * 2)} r="6" fill="transparent">
            <title>{`${REVENUE_LABELS[index]} ${currency(value)}`}</title>
          </circle>
          {index % 2 === 0 ? (
            <text
              x={PAD + index * step}
              y={H - 2}
              textAnchor="middle"
              className="fill-faint text-[9px]"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {REVENUE_LABELS[index]}
            </text>
          ) : null}
        </g>
      ))}

      {/* Endpoint dot */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="4.5"
        style={{ fill: "rgb(var(--aetheris-accent))" }}
        stroke="rgb(var(--aetheris-surface))"
        strokeWidth="2"
      />
    </svg>
  );
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
  const currentMrr = REVENUE_SERIES[REVENUE_SERIES.length - 1];
  const previousMrr = REVENUE_SERIES[REVENUE_SERIES.length - 2];
  const mrrDelta = ((currentMrr - previousMrr) / previousMrr) * 100;
  const failedCount = invoices.filter((invoice) => invoice.status === "failed").length;
  const totalPlanRevenue = PLAN_BREAKDOWN.reduce((sum, plan) => sum + plan.revenue, 0);

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
    {
      label: "Monthly recurring revenue",
      value: currency(currentMrr),
      hint: `${mrrDelta >= 0 ? "+" : ""}${mrrDelta.toFixed(1)}% vs last cycle`,
      tone: "text-accent",
      icon: TrendingUp,
      positive: true
    },
    {
      label: "Outstanding balance",
      value: currency(outstanding),
      hint: "across 3 invoices",
      tone: "text-warning",
      icon: Wallet,
      positive: false
    },
    {
      label: "Active subscriptions",
      value: "1,284",
      hint: "across 4 nodes",
      tone: "text-ink",
      icon: Layers,
      positive: true
    },
    {
      label: "Failed payments",
      value: String(failedCount),
      hint: "dunning active",
      tone: "text-danger",
      icon: AlertTriangle,
      positive: false
    }
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
            : summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="aetheris-card aetheris-card-hover p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
                        {card.label}
                      </div>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-edge bg-raised/70">
                        <Icon className={cn("h-3.5 w-3.5", card.tone)} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="mt-1.5 text-xl font-bold tracking-tight">{card.value}</div>
                    <div className={cn("mt-1 text-[11px]", card.positive ? "text-success" : "text-muted")}>
                      {card.hint}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Revenue chart + plan breakdown */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-xl border border-edge bg-raised/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Revenue, last 12 months
                </h3>
                <div className="mt-1 text-lg font-bold tracking-tight">{currency(currentMrr)}</div>
              </div>
              <span className="inline-flex h-6 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 text-[11px] font-semibold text-success">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                +{mrrDelta.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3">
              <RevenueChart series={REVENUE_SERIES} />
            </div>
          </div>

          <div className="rounded-xl border border-edge bg-raised/40 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Revenue by plan
            </h3>
            <div className="mt-3 space-y-3">
              {PLAN_BREAKDOWN.map((plan) => {
                const share = (plan.revenue / totalPlanRevenue) * 100;
                return (
                  <div key={plan.plan}>
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="font-medium">{plan.plan}</span>
                      <span className="font-mono text-muted">
                        {currency(plan.revenue)} - {share.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-raised" role="meter" aria-valuenow={Math.round(share)} aria-valuemin={0} aria-valuemax={100} aria-label={`${plan.plan} revenue share`}>
                      <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: `${share}%`, background: "linear-gradient(90deg, rgb(var(--aetheris-accent)), rgb(var(--aetheris-accent-strong)))" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-edge pt-3 text-xs">
              <span className="text-muted">{PLAN_BREAKDOWN.reduce((sum, plan) => sum + plan.count, 0)} subscriptions</span>
              <span className="font-mono font-semibold">{currency(totalPlanRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Invoice table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-edge">
          <div className="flex items-center justify-between border-b border-edge bg-raised/40 px-4 py-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Invoices</h3>
            <span className="font-mono text-[11px] text-faint">billing.aetheris.enterprise</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr className="border-b border-edge">
                <th scope="col" className="px-4 py-2 font-medium">Invoice</th>
                <th scope="col" className="px-4 py-2 font-medium">Client</th>
                <th scope="col" className="hidden px-4 py-2 font-medium md:table-cell">Description</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">Amount</th>
                <th scope="col" className="px-4 py-2 font-medium">Status</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
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
                    <tr key={invoice.id} className={cn("transition-colors duration-150 hover:bg-raised/50", invoice.status === "paid" && "opacity-70")}>
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-raised/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-12 items-center justify-center rounded-md border border-edge bg-base text-[10px] font-bold tracking-tight text-muted">
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
