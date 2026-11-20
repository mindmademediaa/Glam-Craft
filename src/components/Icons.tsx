import React from 'react';
import { ToolModelPreset } from '../types/academy';

export function GlamCraftWordmark({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 select-none">
        <span className="font-display text-xl font-bold tracking-tight text-[#2D1B2E]">
          GlamCraft
        </span>
        <svg viewBox="0 0 28 16" className="w-6 h-3.5 text-[#D49A89]" fill="none" aria-hidden="true">
          <path
            d="M2 13C7.5 11.5 16 7.5 25.5 2.5"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M5 14C11 12.2 18.5 8.8 26.5 4.8"
            stroke="#C58371"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col leading-[0.98] select-none">
      <span className="font-display text-[26px] font-bold tracking-[-0.02em] text-[#2D1B2E]">
        GlamCraft
      </span>
      <span className="inline-flex items-end gap-1.5">
        <span className="font-display text-[25px] font-bold tracking-[-0.02em] text-[#2D1B2E]">
          Academy
        </span>
        <svg viewBox="0 0 36 20" className="w-8 h-5 mb-0.5 text-[#D49A89]" fill="none" aria-hidden="true">
          <path
            d="M3 16.5C11 13.8 21 8.5 32 2.5"
            stroke="url(#brushStrokeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M6 17.5C14 14.8 23.5 10.5 33.5 5.2"
            stroke="#B97664"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.55"
          />
          <defs>
            <linearGradient id="brushStrokeGrad" x1="3" y1="16" x2="32" y2="2" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C48673" />
              <stop offset="0.6" stopColor="#DFAC9C" />
              <stop offset="1" stopColor="#F0D0C6" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    </div>
  );
}

export function CategoryMakeupIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Lipstick tube */}
      <rect x="11" y="25" width="10" height="15" rx="1.8" fill="#52263F" stroke="#2D1B2E" strokeWidth="1.6" />
      <rect x="12.5" y="19" width="7" height="6" fill="#E3B1A1" stroke="#2D1B2E" strokeWidth="1.5" />
      <path d="M13.5 19V12.5L18.5 9.5V19H13.5Z" fill="#C97D6D" stroke="#2D1B2E" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Makeup brush */}
      <path d="M29.5 19.5H34.5L33.5 40H30.5L29.5 19.5Z" fill="#D49A89" stroke="#2D1B2E" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="29.5" y="16" width="5" height="4" fill="#F2D7CE" stroke="#2D1B2E" strokeWidth="1.4" />
      <path d="M28 16C26.5 11.5 28.5 7 32 7C35.5 7 37.5 11.5 36 16H28Z" fill="#B57B6E" stroke="#2D1B2E" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30.5 15.5V9.5M32.5 15.5V8.5M34.2 15.5V10.5" stroke="#2D1B2E" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export function Category3DToolsIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Isometric 3D cube */}
      <path d="M20 14L31 19.5V31.5L20 37L9 31.5V19.5L20 14Z" fill="#E5B6A6" stroke="#2D1B2E" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20 14L31 19.5L20 25L9 19.5L20 14Z" fill="#F3D8CE" stroke="#2D1B2E" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 25V37" stroke="#2D1B2E" strokeWidth="1.5" />
      {/* Diagonal contour brush */}
      <path d="M35.5 16.5L39.5 19L27.5 38.5L24.5 36.8L35.5 16.5Z" fill="#52263F" stroke="#2D1B2E" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M36 15.8C37.2 12 40.5 10.2 42.2 11.5C43.2 12.2 41.8 16 39.2 18.6L36 15.8Z" fill="#D49A89" stroke="#2D1B2E" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Sparkles */}
      <path d="M13 8V12M11 10H15" stroke="#2D1B2E" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M23 6.5V10.5M21 8.5H25" stroke="#C58371" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CategoryFaceTypesIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Head oval */}
      <path
        d="M21 9C14.5 9 11 14.2 11 21C11 28.5 15.2 36.5 21 37.5C26.8 36.5 31 28.5 31 21C31 14.2 27.5 9 21 9Z"
        fill="#FFF5F0"
        stroke="#2D1B2E"
        strokeWidth="1.6"
      />
      {/* Hair cap */}
      <path d="M11.6 17.5C13.5 13 17 11.5 21 11.5C25 11.5 28.5 13 30.4 17.5C29.5 12 26 9 21 9C16 9 12.5 12 11.6 17.5Z" fill="#D49A89" stroke="#2D1B2E" strokeWidth="1.3" />
      {/* Center symmetry guide */}
      <path d="M21 12V37" stroke="#C58371" strokeWidth="1.1" strokeDasharray="2 2" />
      {/* Eyes, nose, lips */}
      <path d="M14.5 20.5C15.5 19.7 17.2 19.7 18.2 20.5M23.8 20.5C24.8 19.7 26.5 19.7 27.5 20.5" stroke="#2D1B2E" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16.4" cy="22.8" r="1" fill="#2D1B2E" />
      <circle cx="25.6" cy="22.8" r="1" fill="#2D1B2E" />
      <path d="M18.8 31.2C20.1 32.2 21.9 32.2 23.2 31.2" stroke="#2D1B2E" strokeWidth="1.4" strokeLinecap="round" />
      {/* Vertical proportion arrow */}
      <path d="M37 11V37M34.5 13.5L37 11L39.5 13.5M34.5 34.5L37 37L39.5 34.5" stroke="#C58371" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryHairstylesIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Flowing waves */}
      <path
        d="M21 10C14 10 10 15.5 10 22.5C10 28 11.5 32.5 9.5 36.5C13 37.5 16 35.5 17 31.5C17 25.5 15.5 21 18.5 17.5C21.5 14 25.5 15.5 26 20C26.5 24.5 24 28.5 26 35C29 33 30.5 27.5 30.5 21.5C30.5 14.5 26.8 10 21 10Z"
        fill="#E1AF9E"
        stroke="#2D1B2E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M15 16C13 20 14 27 12.5 33" stroke="#2D1B2E" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      {/* Salon Shears */}
      <path d="M31.5 19L37.5 33.5M38.5 19L32.5 33.5" stroke="#2D1B2E" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="31.5" cy="36.5" r="2.7" stroke="#2D1B2E" strokeWidth="1.5" fill="#FFF9F6" />
      <circle cx="38.5" cy="36.5" r="2.7" stroke="#2D1B2E" strokeWidth="1.5" fill="#FFF9F6" />
    </svg>
  );
}

export function CategoryMehndiIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Hand silhouette */}
      <path
        d="M14 24V15.5C14 14.2 15.8 14.2 15.8 15.5V22M15.8 21V11.5C15.8 10.2 17.8 10.2 17.8 11.5V21M17.8 20.5V10.5C17.8 9.2 19.8 9.2 19.8 10.5V21M19.8 21.5V13C19.8 11.8 21.8 11.8 21.8 13V24.5L24.5 22C25.7 21 27 22.5 26 24L22.8 29.5C22 33.5 21 37.5 21 39.5H13.5C13.5 35.5 11.5 32 11.5 27.5V24C11.5 22.5 14 22.5 14 24Z"
        fill="#E5B6A6"
        stroke="#2D1B2E"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Mandala dot on palm */}
      <circle cx="17.5" cy="29" r="3" fill="#FFF9F6" stroke="#2D1B2E" strokeWidth="1.2" />
      <circle cx="17.5" cy="29" r="1" fill="#52263F" />
      {/* Henna cone */}
      <path d="M26 25.5L36.5 13.5L41 18L27.2 26.8L26 25.5Z" fill="#C98A77" stroke="#2D1B2E" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M33.5 17L37.5 21" stroke="#2D1B2E" strokeWidth="1.2" />
    </svg>
  );
}

export function ToolPresetThumbnail({ preset, className = 'w-14 h-14' }: { preset: ToolModelPreset; className?: string }) {
  switch (preset) {
    case 'beauty_blender':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <defs>
            <radialGradient id="spongeGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#F9CED7" />
              <stop offset="55%" stopColor="#EE9FB0" />
              <stop offset="100%" stopColor="#D67C90" />
            </radialGradient>
          </defs>
          <path
            d="M32 10C26 18 16 30 16 40.5C16 49.6 23.2 55 32 55C40.8 55 48 49.6 48 40.5C48 30 38 18 32 10Z"
            fill="url(#spongeGrad)"
          />
          <ellipse cx="26" cy="33" rx="3" ry="6" transform="rotate(-14 26 33)" fill="#FFFFFF" opacity="0.24" />
        </svg>
      );
    case 'foundation_brush':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M24 12H40L38 25H26L24 12Z" fill="#B68B82" />
          <path d="M24 12H40L39.2 16H24.8L24 12Z" fill="#DFC3BC" opacity="0.7" />
          <rect x="26" y="25" width="12" height="17" rx="1.5" fill="url(#ferruleThumb)" />
          <path d="M27.5 42H36.5L35 58H29L27.5 42Z" fill="#4B223B" />
          <defs>
            <linearGradient id="ferruleThumb" x1="26" y1="33" x2="38" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B87A68" />
              <stop offset="0.45" stopColor="#F3CEC1" />
              <stop offset="1" stopColor="#9B5F4E" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'contour_brush':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M23 15L40 9L38 25H26L23 15Z" fill="#B58A82" />
          <path d="M23 15L40 9L39.4 13.5L24.2 18.5L23 15Z" fill="#E3C7C1" opacity="0.75" />
          <rect x="26" y="25" width="12" height="16" rx="1.5" fill="url(#ferruleContour)" />
          <path d="M27.5 41H36.5L34.2 58H29.8L27.5 41Z" fill="#4B223B" />
          <path d="M31.5 46L33 56" stroke="#E4B5A5" strokeWidth="1.6" strokeLinecap="round" />
          <defs>
            <linearGradient id="ferruleContour" x1="26" y1="33" x2="38" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B57564" />
              <stop offset="0.48" stopColor="#F4D0C4" />
              <stop offset="1" stopColor="#9B5D4D" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'eyelash_curler':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M22 14C27 11 37 11 42 14" stroke="#B77867" strokeWidth="3" strokeLinecap="round" />
          <path d="M23 19C28 16.5 36 16.5 41 19" stroke="#E6A9B5" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M23 14L26 30L39 47M41 14L38 30L25 47" stroke="#C58573" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="51" r="5" stroke="#B77867" strokeWidth="2.4" />
          <circle cx="40" cy="51" r="5" stroke="#B77867" strokeWidth="2.4" />
        </svg>
      );
    case 'eyeshadow_brush':
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <path d="M27 22C25.5 14.5 28 9.5 32 9.5C36 9.5 38.5 14.5 37 22H27Z" fill="#B78B82" />
          <rect x="28" y="22" width="8" height="17" rx="1.2" fill="url(#ferruleEye)" />
          <path d="M29 39H35L33.8 58H30.2L29 39Z" fill="#4B223B" />
          <defs>
            <linearGradient id="ferruleEye" x1="28" y1="30" x2="36" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B87A68" />
              <stop offset="0.5" stopColor="#F3CEC1" />
              <stop offset="1" stopColor="#9B5F4E" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
