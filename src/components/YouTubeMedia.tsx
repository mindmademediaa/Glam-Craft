import React, { useEffect, useState } from 'react';
import { Lock, Play, X } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../utils/youtube';

interface YouTubeThumbnailProps {
  videoId: string;
  alt: string;
  category?: 'Makeup' | 'Hairstyles' | 'Mehndi' | 'Tool';
  className?: string;
  showPlayButton?: boolean;
  isPremiumBadge?: boolean;
  isLocked?: boolean;
  compact?: boolean;
}

const FALLBACK_STYLES: Record<string, { bg: string; accent: string; label: string }> = {
  Makeup: {
    bg: 'from-[#4B283A] via-[#7B4B57] to-[#CFA093]',
    accent: '#F5DCD4',
    label: 'Bridal & Editorial Artistry',
  },
  Hairstyles: {
    bg: 'from-[#3E2434] via-[#6D4754] to-[#B9897C]',
    accent: '#F6E2DA',
    label: 'Bridal Hair Styling',
  },
  Mehndi: {
    bg: 'from-[#4A211F] via-[#7C3F34] to-[#C28668]',
    accent: '#F5DEC8',
    label: 'Henna & Mehndi Art',
  },
  Tool: {
    bg: 'from-[#3F2034] via-[#734A59] to-[#D49A89]',
    accent: '#FAF0EC',
    label: '3D Tool Demo',
  },
};

export function YouTubeThumbnail({
  videoId,
  alt,
  category = 'Makeup',
  className = '',
  showPlayButton = false,
  isPremiumBadge = false,
  isLocked = false,
  compact = false,
}: YouTubeThumbnailProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [videoId]);

  const fallback = FALLBACK_STYLES[category] ?? FALLBACK_STYLES.Makeup;

  return (
    <div className={`relative overflow-hidden bg-[#EBD9D3] ${className}`}>
      {!failed ? (
        <img
          src={getYouTubeThumbnailUrl(videoId, 'hqdefault')}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={(e) => {
            // YouTube serves a 120x90 grey placeholder when a video ID is invalid
            if (e.currentTarget.naturalWidth <= 120) {
              setFailed(true);
            }
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${fallback.bg} p-3 text-center`}
        >
          <div className="mb-1.5 h-8 w-8 rounded-full border border-white/25 bg-white/10 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
          </div>
          {!compact && (
            <span className="font-display text-xs text-white/90 tracking-wide">
              {fallback.label}
            </span>
          )}
        </div>
      )}

      {/* Subtle cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#24121F]/65 via-transparent to-[#24121F]/15" />

      {isPremiumBadge && (
        <span className="absolute right-2.5 top-2.5 rounded-md bg-gradient-to-r from-[#D49A89] to-[#C89B3C] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-sm">
          PRO
        </span>
      )}

      {showPlayButton && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={`flex items-center justify-center rounded-full border border-white/40 bg-[#C78F7E]/70 text-white shadow-md transition-transform duration-200 group-hover:scale-110 ${
              compact ? 'h-8 w-8' : 'h-12 w-12'
            }`}
          >
            {isLocked ? (
              <Lock className={compact ? 'h-3.5 w-3.5' : 'h-5 w-5'} />
            ) : (
              <Play className={`${compact ? 'h-3.5 w-3.5' : 'h-5 w-5'} fill-white ml-0.5`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  className?: string;
}

export function YouTubeEmbed({ videoId, title, autoplay = false, className = '' }: YouTubeEmbedProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-[#1E121B] aspect-video shadow-md ${className}`}>
      <iframe
        key={`${videoId}-${autoplay ? 'auto' : 'std'}`}
        src={getYouTubeEmbedUrl(videoId, autoplay)}
        title={title}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

interface YouTubePlayerModalProps {
  videoId: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function YouTubePlayerModal({ videoId, title, subtitle, onClose }: YouTubePlayerModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D0F19]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#EDD9D2] bg-[#FFF9F6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#F2E4DF] px-5 py-3.5">
          <div className="min-w-0 pr-4">
            <h3 className="font-display text-lg font-semibold text-[#2D1B2E] truncate">{title}</h3>
            {subtitle && <p className="text-xs text-[#7A6572] truncate">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video player"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EDD9D2] bg-white text-[#2D1B2E] transition-colors hover:bg-[#F5E6E1]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 bg-[#180E16]">
          <YouTubeEmbed videoId={videoId} title={title} autoplay />
        </div>
      </div>
    </div>
  );
}
