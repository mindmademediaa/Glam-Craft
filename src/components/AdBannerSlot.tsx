import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MonetizationConfig } from '../types/academy';

interface AdBannerSlotProps {
  placement: 'home' | 'player' | 'shorts';
  monetization: MonetizationConfig;
  isProUser: boolean;
  onUpgradeClick: () => void;
}

export function AdBannerSlot({ placement, monetization, isProUser, onUpgradeClick }: AdBannerSlotProps) {
  if (isProUser || !monetization.adsEnabled) {
    return null;
  }

  const text =
    placement === 'home'
      ? monetization.homeBannerText
      : placement === 'player'
      ? monetization.playerBannerText
      : monetization.shortsBannerText;

  const link =
    placement === 'home'
      ? monetization.homeBannerLink
      : placement === 'player'
      ? monetization.playerBannerLink
      : monetization.shortsBannerLink;

  const isExternal = link.startsWith('http://') || link.startsWith('https://');

  if (monetization.customAdHtml.trim()) {
    return (
      <div className="rounded-xl border border-[#E4C7BE] bg-[#F6E5DF] px-4 py-2.5 text-center text-xs text-[#3D2234]">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{text}</span>
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#8C6E76]">Sponsored</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DFC0B6] bg-[#F5E4DE] px-4 py-2.5 text-[#2D1B2E]">
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="truncate text-xs sm:text-sm font-medium text-[#2D1B2E]">{text}</p>
      </div>
      {isExternal ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#9C5C4B] transition-colors hover:bg-white"
        >
          <span>Shop</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <button
          type="button"
          onClick={onUpgradeClick}
          className="shrink-0 text-[11px] font-semibold text-[#9C5C4B] underline underline-offset-2 hover:text-[#2D1B2E]"
        >
          Remove Ads
        </button>
      )}
    </div>
  );
}
