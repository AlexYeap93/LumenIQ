import { useMemo, useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '../components/ui/dialog';
import type { PlanStream } from '../types/plans';
import { plansApi } from '../api/plans';

export interface PlanSelectionContentProps {
  currentPlanId?: string;
  onSelectPlan?: (planId: string) => void;
  /** When set, used as plan list. When omitted, internal fetch runs when `fetchWhen` is true. */
  streams?: PlanStream[];
  /** Fetch plans from API when `streams` is omitted (e.g. modal opened). */
  fetchWhen?: boolean;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Hide the bottom "Selected: …" summary strip (e.g. when parent already shows selection). */
  hideSelectionSummary?: boolean;
}

export function PlanSelectionContent({
  currentPlanId,
  onSelectPlan,
  streams: streamsProp,
  fetchWhen = false,
  className = '',
  hideSelectionSummary = false
}: PlanSelectionContentProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(currentPlanId);
  const [fetchedStreams, setFetchedStreams] = useState<PlanStream[]>([]);

  useEffect(() => {
    setSelectedPlanId(currentPlanId);
  }, [currentPlanId]);

  useEffect(() => {
    if (streamsProp === undefined && fetchWhen) {
      plansApi.list().then(setFetchedStreams).catch(() => {});
    }
  }, [fetchWhen, streamsProp]);

  const streams = streamsProp ?? fetchedStreams;
  const flattenedPlans = useMemo(() => streams.flatMap((stream) => stream.plans), [streams]);
  const selectedPlan = flattenedPlans.find((plan) => plan.id === selectedPlanId);

  const handleSelect = (planId: string) => {
    if (planId === currentPlanId) {
      setSelectedPlanId(planId);
      return;
    }
    setSelectedPlanId(planId);
    onSelectPlan?.(planId);
  };

  return (
    <div className={className}>
      {streams.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">Loading plans...</div>
      ) : (
        <div className="space-y-8">
          {streams.map((stream) => (
            <div key={stream.id} className="space-y-5">
              <div className="text-center">
                <p className="text-xs font-outfit uppercase tracking-widest text-blue-400">
                  {stream.title}
                </p>
                <p className="text-sm text-slate-400 mt-1">{stream.subtitle}</p>
              </div>

              <div
                className={`grid gap-5 ${
                  stream.plans.length === 1
                    ? 'grid-cols-1 max-w-sm mx-auto'
                    : stream.plans.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {stream.plans.map((plan, planIndex) => {
                  const isCurrentPlan = currentPlanId === plan.id;
                  const isSelected = selectedPlanId === plan.id;
                  const isPopular = stream.plans.length >= 3 && planIndex === 1;

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col rounded-2xl border transition-all duration-200 bg-slate-900 ${
                        isSelected
                          ? 'border-blue-500 shadow-lg shadow-blue-500/15'
                          : isPopular
                            ? 'border-blue-500/40'
                            : 'border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <span className="gradient-blue-primary whitespace-nowrap rounded-full px-4 py-1 text-xs font-medium text-white shadow-sm">
                            Most popular
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col flex-1 p-6 pt-7">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-outfit font-semibold text-white">
                            {plan.name}
                          </h4>
                          {isCurrentPlan && (
                            <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-4xl font-outfit font-bold text-white">
                            {plan.priceLabel}
                          </span>
                          {!plan.isEnterprise && (
                            <span className="text-sm text-slate-400 ml-0.5">/month</span>
                          )}
                        </div>

                        {plan.description && (
                          <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            {plan.description}
                          </p>
                        )}

                        <div className="mt-6">
                          <Button
                            className={`w-full rounded-xl py-5 text-sm font-medium transition-all ${
                              isCurrentPlan
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : isPopular || isSelected
                                  ? 'gradient-blue-primary text-white hover:opacity-90 shadow-md shadow-blue-500/20'
                                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
                            }`}
                            onClick={() => handleSelect(plan.id)}
                            disabled={isCurrentPlan}
                          >
                            {isCurrentPlan
                              ? 'Current plan'
                              : plan.isEnterprise
                                ? 'Contact sales'
                                : isSelected
                                  ? 'Selected'
                                  : 'Get started'}
                          </Button>
                        </div>

                        {plan.features && plan.features.length > 0 && (
                          <div className="mt-6 border-t border-slate-700/50 pt-5 flex-1">
                            <p className="text-sm font-semibold text-slate-300 mb-3">
                              {planIndex === 0
                                ? `${plan.name} includes:`
                                : `Everything in ${stream.plans[planIndex - 1]?.name ?? 'previous'}, plus:`}
                            </p>
                            <ul className="space-y-2.5">
                              {plan.features.map((feature) => (
                                <li
                                  key={feature}
                                  className="flex items-center gap-2.5 text-sm text-slate-400"
                                >
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hideSelectionSummary && selectedPlan && (
        <div className="mt-5 rounded-2xl border border-slate-700/50 bg-slate-900/80 px-5 py-3.5 text-sm text-slate-400">
          Selected:{' '}
          <span className="font-medium text-white">{selectedPlan.name}</span>{' '}
          ({selectedPlan.priceLabel})
        </div>
      )}
    </div>
  );
}

interface PlanSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: string;
  onSelectPlan?: (planId: string) => void;
  streams?: PlanStream[];
}

export function PlanSelectionModal({
  open,
  onOpenChange,
  currentPlanId,
  onSelectPlan,
  streams: streamsProp
}: PlanSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-outfit font-semibold text-white">Choose a plan</h2>
          <p className="text-sm text-slate-400 mt-1">
            Select the plan that fits your business stream and scale.
          </p>
        </div>

        <PlanSelectionContent
          currentPlanId={currentPlanId}
          onSelectPlan={onSelectPlan}
          streams={streamsProp}
          fetchWhen={open && streamsProp === undefined}
        />

        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
