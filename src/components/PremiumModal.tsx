import React, { useEffect, useState } from 'react';
import { Check, Crown, ShieldCheck, X } from 'lucide-react';
import { MonetizationConfig } from '../types/academy';

interface PremiumModalProps {
  monetization: MonetizationConfig;
  isProUser: boolean;
  onActivatePro: () => void;
  onDeactivatePro: () => void;
  onClose: () => void;
}

export function PremiumModal({
  monetization,
  isProUser,
  onActivatePro,
  onDeactivatePro,
  onClose,
}: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#23101D]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="GlamCraft Academy Pro Membership"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5C6BC] bg-[#FFF9F6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Rose-Plum Luxury Header */}
        <div className="relative bg-[#3E1F34] px-6 py-6 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close upgrade modal"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#E9BFA9]">
            <Crown className="h-4 w-4 text-[#DFB262]" />
            <span>GlamCraft Pro Studio</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-white">
            Unlock All Pro Masterclasses
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[#E9D7DF]">
            Go from Fresh Beginner to Certified Bridal Artist with full ad-free access to every Pro course & Short.
          </p>
        </div>

        <div className="p-6">
          {/* Plan Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedPlan('yearly')}
              className={`relative rounded-2xl border p-3.5 text-left transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-[#C58371] bg-[#FDF1EC] ring-1 ring-[#C58371]'
                  : 'border-[#EDD9D2] bg-white hover:border-[#D49A89]'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B97664]">
                Best Value
              </span>
              <p className="mt-1 font-display text-xl font-bold text-[#2D1B2E] tabular-nums">
                {monetization.yearlyPrice}
              </p>
              <p className="text-xs text-[#7A6572]">per year · save 33%</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              className={`rounded-2xl border p-3.5 text-left transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-[#C58371] bg-[#FDF1EC] ring-1 ring-[#C58371]'
                  : 'border-[#EDD9D2] bg-white hover:border-[#D49A89]'
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6572]">
                Flexible
              </span>
              <p className="mt-1 font-display text-xl font-bold text-[#2D1B2E] tabular-nums">
                {monetization.monthlyPrice}
              </p>
              <p className="text-xs text-[#7A6572]">per month</p>
            </button>
          </div>

          {/* Benefits List */}
          <ul className="mt-5 space-y-2.5">
            {monetization.proBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#3E2836]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5E6E1] text-[#B97664]">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Action CTA */}
          {isProUser ? (
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center justify-center gap-2 rounded-xl bg-[#F4ECE8] py-3 text-sm font-semibold text-[#2D1B2E]">
                <ShieldCheck className="h-4 w-4 text-[#B97664]" />
                <span>GlamCraft Pro is Active</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onDeactivatePro();
                  onClose();
                }}
                className="w-full rounded-xl border border-[#EDD9D2] py-2.5 text-xs font-medium text-[#7A6572] hover:bg-white"
              >
                Switch back to Free Preview Mode
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  onActivatePro();
                  onClose();
                }}
                className="w-full rounded-xl rose-gold-gradient py-3.5 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.98] hover:opacity-95"
              >
                Start Pro Access ({selectedPlan === 'yearly' ? `${monetization.yearlyPrice}/yr` : `${monetization.monthlyPrice}/mo`})
              </button>
              <p className="mt-2.5 text-center text-[11px] text-[#7A6572]">
                Instant preview unlock · Cancel anytime · 100% Ad-Free
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
