"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  HardDrive,
  Loader2,
  MemoryStick,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockDriver } from "@/components/website/demo/driver";
import {
  DEMO_NODES,
  DEMO_PLANS,
  DEMO_TEMPLATES,
  PROVISION_STAGES,
  type DemoNode,
  type DemoPlan,
  type DemoTemplate,
  type ProvisionResult
} from "@/components/website/demo/data";
import { useToast } from "@/components/website/demo/ui";

type StepId = "template" | "node" | "plan" | "deploying" | "done";

const STEP_LABELS: Array<{ id: StepId; label: string }> = [
  { id: "template", label: "Template" },
  { id: "node", label: "Node" },
  { id: "plan", label: "Plan" },
  { id: "deploying", label: "Deploy" }
];

const STAGE_DURATION_MS = 560;

export function ProvisioningPanel() {
  const [step, setStep] = useState<StepId>("template");
  const [templates, setTemplates] = useState<DemoTemplate[]>(DEMO_TEMPLATES);
  const [plans, setPlans] = useState<DemoPlan[]>(DEMO_PLANS);
  const [nodes, setNodes] = useState<DemoNode[]>(DEMO_NODES);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(DEMO_TEMPLATES[0].id);
  const [selectedNode, setSelectedNode] = useState<string>(DEMO_NODES[0].id);
  const [selectedPlan, setSelectedPlan] = useState<string>(DEMO_PLANS[1].id);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [result, setResult] = useState<ProvisionResult | null>(null);
  const [deployments, setDeployments] = useState<ProvisionResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toast = useToast();

  useEffect(() => {
    void Promise.all([
      mockDriver.listTemplates(),
      mockDriver.listPlans(),
      mockDriver.listNodes()
    ]).then(([nextTemplates, nextPlans, nextNodes]) => {
      setTemplates(nextTemplates);
      setPlans(nextPlans);
      setNodes(nextNodes);
    });
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startDeploy() {
    setStep("deploying");
    setActiveStage(0);
    setResult(null);

    timerRef.current = setInterval(() => {
      setActiveStage((current) => Math.min(current + 1, PROVISION_STAGES.length - 1));
    }, STAGE_DURATION_MS);

    void mockDriver.provisionServer({
      templateId: selectedTemplate,
      nodeId: selectedNode,
      planId: selectedPlan
    }).then((nextResult) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setActiveStage(PROVISION_STAGES.length - 1);
      setResult(nextResult);
      setDeployments((current) => [nextResult, ...current].slice(0, 4));
      toast.show(`${nextResult.name} is online at ${nextResult.ipv4}.`, "success");
      setStep("done");
    });
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep("template");
    setResult(null);
    setActiveStage(0);
  }

  const plan = plans.find((candidate) => candidate.id === selectedPlan) ?? plans[0];
  const node = nodes.find((candidate) => candidate.id === selectedNode) ?? nodes[0];

  const stepIndex = STEP_LABELS.findIndex((entry) => entry.id === step);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="overflow-y-auto px-4 py-4">
        {/* Stepper */}
        <ol className="flex items-center gap-2" aria-label="Provisioning steps">
          {STEP_LABELS.map((entry, index) => {
            const done = index < stepIndex;
            const active = entry.id === step;
            return (
              <li key={entry.id} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-200",
                    done
                      ? "border-accent bg-accent text-base"
                      : active
                        ? "border-accent/50 bg-accent-soft text-accent"
                        : "border-edge bg-raised/60 text-faint"
                  )}
                >
                  {done ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
                </span>
                <span className={cn("hidden text-xs font-medium sm:block", active ? "text-ink" : "text-faint")}>
                  {entry.label}
                </span>
                {index < STEP_LABELS.length - 1 && (
                  <span className={cn("h-px flex-1", index < stepIndex ? "bg-accent" : "bg-edge")} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>

        {/* Deploy progress */}
        {step === "deploying" || step === "done" ? (
          <div className="mt-5 rounded-xl border border-edge bg-raised/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-tight">
                {step === "done" ? "Deployment complete" : "Provisioning server"}
              </h3>
              {step === "done" && result ? (
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
                  Online
                </span>
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden="true" />
              )}
            </div>
            <div className="mt-4 space-y-1">
              {PROVISION_STAGES.map((stage, index) => {
                const reached = index < activeStage || step === "done";
                const current = index === activeStage && step !== "done";
                return (
                  <div
                    key={stage.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-200",
                      current && "bg-accent-soft"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                        reached
                          ? "border-success bg-success/15 text-success"
                          : current
                            ? "border-accent/50 text-accent"
                            : "border-edge text-faint"
                      )}
                    >
                      {reached ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className={cn("text-xs font-medium", reached || current ? "text-ink" : "text-faint")}>
                        {stage.label}
                      </div>
                      <div className="truncate text-[11px] text-muted">{stage.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {step === "done" && result && (
              <div className="mt-4 rounded-lg border border-accent/30 bg-accent-soft p-3 animate-fade-up">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-mono text-sm font-semibold text-ink">{result.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {result.template} - {plan.vcpu} vCPU / {plan.memoryGb} GB / {plan.diskGb} GB
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-accent">{result.ipv4}</div>
                    <div className="text-[11px] text-muted">on {result.node}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="aetheris-btn-secondary h-8 flex-1 px-3" onClick={reset}>
                    Deploy another server
                  </button>
                  <button type="button" className="aetheris-btn-primary h-8 px-4" onClick={() => toast.show("Opening client portal for the new server (demo).")}>
                    Open portal
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Step content */}
            {step === "template" && (
              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Choose a template</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {templates.map((template) => {
                    const selected = template.id === selectedTemplate;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedTemplate(template.id)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-all duration-200",
                          selected
                            ? "border-accent/50 bg-accent-soft ring-1 ring-accent/30"
                            : "border-edge bg-raised/40 hover:border-accent/30 hover:bg-raised"
                        )}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-semibold">{template.name}</span>
                          {selected && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
                        </div>
                        <div className="mt-1 text-[11px] leading-5 text-muted">{template.description}</div>
                        <div className="mt-2 font-mono text-[10px] text-faint">egg: {template.egg}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "node" && (
              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Choose a node</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {nodes.map((candidate) => {
                    const selected = candidate.id === selectedNode;
                    const busy = candidate.status === "draining" || candidate.status === "offline";
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        disabled={candidate.status === "offline"}
                        onClick={() => setSelectedNode(candidate.id)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-all duration-200",
                          selected
                            ? "border-accent/50 bg-accent-soft ring-1 ring-accent/30"
                            : "border-edge bg-raised/40 hover:border-accent/30 hover:bg-raised",
                          candidate.status === "offline" && "cursor-not-allowed opacity-50"
                        )}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-semibold">{candidate.name}</span>
                          <span className={cn("h-1.5 w-1.5 rounded-full", candidate.status === "online" ? "bg-success" : candidate.status === "draining" ? "bg-warning" : "bg-danger")} />
                        </div>
                        <div className="mt-1 text-[11px] text-muted">{candidate.location}</div>
                        <div className="mt-2 text-[11px] text-faint">
                          {candidate.cores} vCPU - {candidate.memoryGb} GB - {busy ? "accepting no new workloads" : "accepting workloads"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "plan" && (
              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Choose a plan</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {plans.map((candidate) => {
                    const selected = candidate.id === selectedPlan;
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => setSelectedPlan(candidate.id)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-all duration-200",
                          selected
                            ? "border-accent/50 bg-accent-soft ring-1 ring-accent/30"
                            : "border-edge bg-raised/40 hover:border-accent/30 hover:bg-raised"
                        )}
                        aria-pressed={selected}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold">{candidate.name}</span>
                          <span className="font-mono text-xs text-accent">${candidate.price}/mo</span>
                        </div>
                        <div className="mt-3 space-y-1.5 text-[11px] text-muted">
                          <div className="flex items-center gap-2"><Cpu className="h-3 w-3" aria-hidden="true" />{candidate.vcpu} vCPU</div>
                          <div className="flex items-center gap-2"><MemoryStick className="h-3 w-3" aria-hidden="true" />{candidate.memoryGb} GB RAM</div>
                          <div className="flex items-center gap-2"><HardDrive className="h-3 w-3" aria-hidden="true" />{candidate.diskGb} GB NVMe</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer actions */}
        {step !== "deploying" && step !== "done" && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              className="aetheris-btn-ghost h-9 px-3"
              disabled={step === "template"}
              onClick={() => {
                const index = STEP_LABELS.findIndex((entry) => entry.id === step);
                setStep(STEP_LABELS[Math.max(0, index - 1)].id);
              }}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              className="aetheris-btn-primary h-9 px-5"
              onClick={() => {
                if (step === "plan") {
                  startDeploy();
                } else {
                  const index = STEP_LABELS.findIndex((entry) => entry.id === step);
                  setStep(STEP_LABELS[Math.min(STEP_LABELS.length - 1, index + 1)].id);
                }
              }}
            >
              {step === "plan" ? (
                <>
                  <Rocket className="h-4 w-4" aria-hidden="true" />
                  Deploy server
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Recent deployments */}
        {deployments.length > 0 && step !== "deploying" && (
          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">Recent deployments</h4>
            <div className="mt-2 space-y-2">
              {deployments.map((deployment) => (
                <div key={deployment.serverId} className="flex items-center justify-between rounded-lg border border-edge bg-raised/40 px-3 py-2">
                  <span className="font-mono text-xs">{deployment.name}</span>
                  <span className="font-mono text-[11px] text-muted">{deployment.ipv4}</span>
                  <span className="text-[11px] text-faint">{deployment.node}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast.node}
    </div>
  );
}
