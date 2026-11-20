import React, { useMemo, useState } from 'react';
import { ArrowLeft, Lock, Play, Star, User } from 'lucide-react';
import { FACE_SHAPE_GUIDES } from '../data/seedData';
import {
  Course,
  FaceShape,
  MonetizationConfig,
  ShortVideo,
  UserProgress,
} from '../types/academy';
import { AdBannerSlot } from './AdBannerSlot';
import { FaceShapeDiagram } from './FaceShapeDiagram';
import { YouTubePlayerModal, YouTubeThumbnail } from './YouTubeMedia';

interface FaceShapeAndShortsViewProps {
  courses: Course[];
  shorts: ShortVideo[];
  monetization: MonetizationConfig;
  progress: UserProgress;
  initialShortCategory?: 'All' | 'Hairstyles' | 'Mehndi';
  focusSection?: 'face' | 'shorts';
  onBack?: () => void;
  onOpenProfile: () => void;
  onOpenCourse: (courseId: string) => void;
  onOpenUpgrade: () => void;
}

const FACE_SHAPES: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Long'];

export function FaceShapeAndShortsView({
  courses,
  shorts,
  monetization,
  progress,
  initialShortCategory = 'All',
  focusSection = 'face',
  onBack,
  onOpenProfile,
  onOpenCourse,
  onOpenUpgrade,
}: FaceShapeAndShortsViewProps) {
  const [selectedShape, setSelectedShape] = useState<FaceShape>('Oval');
  const [activeZone, setActiveZone] = useState<'highlight' | 'blush' | 'contour' | null>(null);
  const [shortCategory, setShortCategory] = useState<'All' | 'Hairstyles' | 'Mehndi'>(
    initialShortCategory
  );
  const [shortSubFilter, setShortSubFilter] = useState<string>('All');
  const [playingShort, setPlayingShort] = useState<ShortVideo | null>(null);

  const guide = FACE_SHAPE_GUIDES[selectedShape];

  const recommendedCourses = useMemo(
    () => courses.filter((c) => c.faceShapes.includes(selectedShape)),
    [courses, selectedShape]
  );

  const subCategories = useMemo(() => {
    const filteredByCat =
      shortCategory === 'All' ? shorts : shorts.filter((s) => s.category === shortCategory);
    const set = new Set<string>(['All']);
    filteredByCat.forEach((s) => set.add(s.subCategory));
    return Array.from(set);
  }, [shorts, shortCategory]);

  const visibleShorts = useMemo(() => {
    return shorts.filter((s) => {
      if (shortCategory !== 'All' && s.category !== shortCategory) return false;
      if (shortSubFilter !== 'All' && s.subCategory !== shortSubFilter) return false;
      return true;
    });
  }, [shorts, shortCategory, shortSubFilter]);

  const handleShortClick = (short: ShortVideo) => {
    if (short.isPremium && !progress.isProUser) {
      onOpenUpgrade();
      return;
    }
    setPlayingShort(short);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-12">
      {/* Top Bar matching Screenshot 3 */}
      <header className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#2D1B2E] transition-colors hover:bg-[#F5E6E1]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2D1B2E] text-center">
          Face Shape Makeup Guide
        </h1>

        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="Profile"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2D1B2E]/20 bg-white text-[#2D1B2E] hover:bg-[#F5E6E1]"
        >
          <User className="h-5 w-5" />
        </button>
      </header>

      {/* Face Shape Selector Pill Chips matching Screenshot 3 */}
      <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar sm:justify-center">
        {FACE_SHAPES.map((shape) => {
          const active = selectedShape === shape;
          return (
            <button
              key={shape}
              type="button"
              onClick={() => {
                setSelectedShape(shape);
                setActiveZone(null);
              }}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                active
                  ? 'rose-gold-gradient text-white shadow-sm'
                  : 'border border-[#C8A196] bg-white text-[#2D1B2E] hover:border-[#B97664] hover:bg-[#FFF5F0]'
              }`}
            >
              {shape}
            </button>
          );
        })}
      </div>

      {/* Visual Placement Diagram & Tailored Tips */}
      <section className={`mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start ${focusSection === 'shorts' ? 'order-2' : ''}`}>
        <div className="lg:col-span-6">
          <FaceShapeDiagram
            shape={selectedShape}
            activeZone={activeZone}
            onSelectZone={(z) => setActiveZone((prev) => (prev === z ? null : z))}
          />
        </div>

        <div className="flex flex-col gap-3 lg:col-span-6">
          <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
            <h2 className="font-display text-xl font-bold text-[#2D1B2E]">
              {selectedShape} Face Artistry Map
            </h2>
            <p className="mt-1 text-sm text-[#6B5461]">{guide.tagline}</p>

            <div className="mt-4 space-y-3">
              <div
                onClick={() => setActiveZone('highlight')}
                className={`cursor-pointer rounded-xl border p-3.5 transition-colors ${
                  activeZone === 'highlight'
                    ? 'border-[#C58371] bg-[#FDF1EC]'
                    : 'border-[#F2E4DF] bg-[#FFFDFB] hover:border-[#DFB7AA]'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#9E6757]">Highlight</p>
                <p className="mt-1 text-sm leading-relaxed text-[#3D2735]">{guide.highlightTip}</p>
              </div>

              <div
                onClick={() => setActiveZone('blush')}
                className={`cursor-pointer rounded-xl border p-3.5 transition-colors ${
                  activeZone === 'blush'
                    ? 'border-[#C58371] bg-[#FDF1EC]'
                    : 'border-[#F2E4DF] bg-[#FFFDFB] hover:border-[#DFB7AA]'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#C26973]">Blush</p>
                <p className="mt-1 text-sm leading-relaxed text-[#3D2735]">{guide.blushTip}</p>
              </div>

              <div
                onClick={() => setActiveZone('contour')}
                className={`cursor-pointer rounded-xl border p-3.5 transition-colors ${
                  activeZone === 'contour'
                    ? 'border-[#C58371] bg-[#FDF1EC]'
                    : 'border-[#F2E4DF] bg-[#FFFDFB] hover:border-[#DFB7AA]'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A5956]">Contour</p>
                <p className="mt-1 text-sm leading-relaxed text-[#3D2735]">{guide.contourTip}</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#7A6572]">
              <strong className="text-[#2D1B2E]">Artist Secret:</strong> {guide.proSecret}
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Tutorials for Selected Face Shape */}
      {recommendedCourses.length > 0 && (
        <section className="mt-7">
          <h2 className="font-display text-xl font-bold text-[#2D1B2E]">
            Recommended Tutorials for {selectedShape} Faces
          </h2>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {recommendedCourses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => onOpenCourse(course.id)}
                className="group flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-[#F2E4DF] bg-white p-2.5 text-left shadow-sm transition-all hover:border-[#D49A89]"
              >
                <YouTubeThumbnail
                  videoId={course.lessons[0]?.youtubeVideoId ?? '5O0YDHiosD0'}
                  alt={course.title}
                  compact
                  showPlayButton
                  className="h-16 w-20 shrink-0 rounded-xl"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#2D1B2E] group-hover:text-[#B97664]">
                    {course.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#7A6572]">{course.level}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[#B97664]">
                    <Star className="h-3 w-3 fill-[#D49A89] text-[#D49A89]" />
                    <span className="tabular-nums">{course.rating.toFixed(1)}</span>
                    <span className="text-[#8E7A85]">· {course.lessons.length} lessons</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Hairstyles & Mehndi Shorts Hub matching Screenshot 3 */}
      <section className="mt-8" id="shorts-hub">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <h2 className="font-display text-2xl sm:text-[28px] font-bold text-[#2D1B2E]">
            Hairstyles &amp; Mehndi Shorts
          </h2>

          {/* Main Filter Tabs: All | Hairstyles | Mehndi */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D4CD] bg-white p-1 self-start">
            {(['All', 'Hairstyles', 'Mehndi'] as const).map((cat) => {
              const active = shortCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setShortCategory(cat);
                    setShortSubFilter('All');
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    active ? 'bg-[#3E1F34] text-white' : 'text-[#6B5461] hover:text-[#2D1B2E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-category filter row */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {subCategories.map((sub) => {
            const active = shortSubFilter === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setShortSubFilter(sub)}
                className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'rose-gold-gradient text-white'
                    : 'border border-[#EFE0DB] bg-white text-[#6B5461] hover:border-[#D49A89]'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Optional Shorts Feed Ad Slot */}
        <div className="mt-4">
          <AdBannerSlot
            placement="shorts"
            monetization={monetization}
            isProUser={progress.isProUser}
            onUpgradeClick={onOpenUpgrade}
          />
        </div>

        {/* 2-Column Mobile / 4-Column Desktop Shorts Grid matching Screenshot 3 */}
        <div className="mt-4 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
          {visibleShorts.map((short) => {
            const locked = short.isPremium && !progress.isProUser;
            return (
              <button
                key={short.id}
                type="button"
                onClick={() => handleShortClick(short)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-[#EBDAD4] bg-[#2C1A26] text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <YouTubeThumbnail
                  videoId={short.youtubeVideoId}
                  alt={short.title}
                  category={short.category}
                  className="h-full w-full"
                />

                {/* Measured readability scrim */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1E1019]/75 via-[#1E1019]/25 to-[#1E1019]/85" />

                {/* Top Left Title & Optional PRO Badge */}
                <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-[15px] font-semibold leading-tight text-white drop-shadow-sm line-clamp-2">
                    {short.title}
                  </h3>
                  {short.isPremium && (
                    <span className="shrink-0 rounded bg-[#C89B3C] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
                      PRO
                    </span>
                  )}
                </div>

                {/* Centered Play Circle + Sub-category matching Screenshot 3 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-[#C79182]/70 text-white shadow transition-transform duration-200 group-hover:scale-110">
                    {locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    )}
                  </div>
                  <span className="mt-1.5 text-xs font-medium text-white/95 drop-shadow">
                    {short.subCategory}
                  </span>
                </div>

                {/* Bottom Row: Views & Duration matching Screenshot 3 */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-white/90">
                  <span className="inline-flex items-center gap-1">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/90 text-[#2D1B2E]">
                      <Play className="h-2.5 w-2.5 fill-[#2D1B2E] ml-0.5" />
                    </span>
                    <span className="tabular-nums">{short.viewsLabel}</span>
                  </span>
                  <span className="tabular-nums">{short.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {playingShort && (
        <YouTubePlayerModal
          videoId={playingShort.youtubeVideoId}
          title={playingShort.title}
          subtitle={`${playingShort.category} · ${playingShort.subCategory} · ${playingShort.viewsLabel}`}
          onClose={() => setPlayingShort(null)}
        />
      )}
    </div>
  );
}
