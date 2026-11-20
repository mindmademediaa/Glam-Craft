import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Play, Sparkles, X } from 'lucide-react';
import { Tool3D, ToolHotspot } from '../types/academy';
import { ToolPresetThumbnail } from './Icons';
import { ThreeToolViewport } from './ThreeToolViewport';
import { YouTubePlayerModal } from './YouTubeMedia';

interface Tools3DLabViewProps {
  tools: Tool3D[];
  bookmarkedToolIds: string[];
  onToggleBookmarkTool: (toolId: string) => void;
  onBack?: () => void;
}

export function Tools3DLabView({
  tools,
  bookmarkedToolIds,
  onToggleBookmarkTool,
  onBack,
}: Tools3DLabViewProps) {
  const [selectedToolId, setSelectedToolId] = useState<string>(tools[0]?.id ?? '');
  const [selectedHotspot, setSelectedHotspot] = useState<ToolHotspot | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const activeTool = tools.find((t) => t.id === selectedToolId) ?? tools[0];
  if (!activeTool) {
    return (
      <div className="p-8 text-center text-[#7A6572]">
        No 3D tools available yet. Add one from the Admin Panel.
      </div>
    );
  }

  const isBookmarked = bookmarkedToolIds.includes(activeTool.id);

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setSelectedHotspot(null);
  };

  return (
    <div className="min-h-full bg-[#FFF9F6] pb-24 lg:pb-12">
      {/* Luxury Deep Plum Header matching Screenshot 1 */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#3E1F34] px-4 py-3.5 text-white shadow-sm lg:rounded-b-2xl">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#E8B8A9] transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl sm:text-2xl font-medium tracking-wide text-white">
          3D Tools Explorer
        </h1>
        <button
          type="button"
          onClick={() => onToggleBookmarkTool(activeTool.id)}
          aria-label={isBookmarked ? 'Remove tool bookmark' : 'Bookmark this tool'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#E8B8A9] transition-colors hover:bg-white/10"
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-[#E8B8A9]' : ''}`} />
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6">
        <div className="mb-3 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#2D1B2E]">
            Interactive 3D Viewport
          </h2>
          <p className="mt-0.5 text-xs text-[#7A6572]">
            {activeTool.name} · Drag 360°, zoom, or tap anatomical pins
          </p>
        </div>

        {/* Desktop 2-column harmony; mobile vertical stack matching Screenshot 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ThreeToolViewport
              tool={activeTool}
              selectedHotspotId={selectedHotspot?.id ?? null}
              onSelectHotspot={setSelectedHotspot}
            />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {/* Active Hotspot Detail Inspector Card */}
            {selectedHotspot ? (
              <div className="rounded-2xl border border-[#DFB7AA] bg-white p-5 shadow-[0_8px_24px_rgba(61,31,52,0.06)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B97664]">
                      Anatomical Callout
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-[#2D1B2E]">
                      {selectedHotspot.label}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHotspot(null)}
                    aria-label="Close hotspot details"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF2EE] text-[#7A6572] hover:text-[#2D1B2E]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#4C3644]">
                  {selectedHotspot.detail}
                </p>
                <div className="mt-3 rounded-xl bg-[#FFF6F2] px-3.5 py-2.5 text-xs leading-relaxed text-[#6E5361]">
                  <span className="font-semibold text-[#2D1B2E]">Pro Care & Grip: </span>
                  {selectedHotspot.careTip}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#F2E4DF] bg-[#FFFDFB] px-4 py-3 text-xs text-[#7A6572]">
                <span className="font-semibold text-[#2D1B2E]">Inspect Anatomy: </span>
                Tap any labeled pin on the 3D tool or select a part below to read material & cleaning care.
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {activeTool.hotspots.map((hs) => (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => setSelectedHotspot(hs)}
                      className="rounded-lg border border-[#E9D5CE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2D1B2E] transition-colors hover:border-[#D49A89] hover:bg-[#FAF0EC]"
                    >
                      {hs.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Best For Usage Card matching Screenshot 1 */}
            <div className="rounded-[22px] border border-[#F2E4DF] bg-white p-5 shadow-[0_10px_28px_rgba(61,31,52,0.06)]">
              <h3 className="font-sans text-[17px] font-bold leading-snug text-[#2D1B2E]">
                Best For: {activeTool.bestFor}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C4452]">
                {activeTool.usageTip}
              </p>

              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl rose-gold-gradient px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] hover:opacity-95"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Watch 1-Min Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Explore Other Tools Carousel matching Screenshot 1 */}
        <section className="mt-7">
          <h3 className="mb-3.5 text-center font-display text-lg italic text-[#2D1B2E]">
            Explore Other Tools
          </h3>
          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar sm:justify-center">
            {tools.map((item) => {
              const isSelected = item.id === activeTool.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTool(item.id)}
                  className={`flex w-[96px] shrink-0 flex-col items-center rounded-2xl p-2 transition-all ${
                    isSelected
                      ? 'border-2 border-[#C99180] bg-[#FDF4F0] shadow-sm'
                      : 'border border-transparent hover:bg-white/80'
                  }`}
                >
                  <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl border border-[#F0E3DE] bg-[#F7F1EE] shadow-inner">
                    <ToolPresetThumbnail preset={item.modelPreset} className="h-14 w-14" />
                  </div>
                  <span
                    className={`mt-2 text-center text-xs leading-tight ${
                      isSelected ? 'font-bold text-[#2D1B2E]' : 'font-medium text-[#543E4B]'
                    }`}
                  >
                    {item.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {demoModalOpen && (
        <YouTubePlayerModal
          videoId={activeTool.demoYoutubeId}
          title={`${activeTool.name} — 1-Min Technique Demo`}
          subtitle={activeTool.bestFor}
          onClose={() => setDemoModalOpen(false)}
        />
      )}
    </div>
  );
}
