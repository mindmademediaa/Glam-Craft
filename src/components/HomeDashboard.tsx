import React, { useMemo } from 'react';
import { Crown, Search, ShieldCheck, Star, User, X } from 'lucide-react';
import {
  Course,
  MonetizationConfig,
  ShortVideo,
  SkillLevel,
  Tool3D,
  UserProgress,
} from '../types/academy';
import { AdBannerSlot } from './AdBannerSlot';
import {
  Category3DToolsIcon,
  CategoryFaceTypesIcon,
  CategoryHairstylesIcon,
  CategoryMakeupIcon,
  CategoryMehndiIcon,
  GlamCraftWordmark,
} from './Icons';
import { YouTubeThumbnail } from './YouTubeMedia';

interface HomeDashboardProps {
  courses: Course[];
  shorts: ShortVideo[];
  tools3D: Tool3D[];
  monetization: MonetizationConfig;
  progress: UserProgress;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectLevel: (level: SkillLevel) => void;
  onOpenCourse: (courseId: string) => void;
  onOpenCategory: (category: 'makeup' | 'lab3d' | 'faceTypes' | 'hairstyles' | 'mehndi') => void;
  onOpenShort: (short: ShortVideo) => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenUpgrade: () => void;
}

export function HomeDashboard({
  courses,
  shorts,
  tools3D,
  monetization,
  progress,
  searchQuery,
  onSearchChange,
  onSelectLevel,
  onOpenCourse,
  onOpenCategory,
  onOpenShort,
  onOpenProfile,
  onOpenAdmin,
  onOpenUpgrade,
}: HomeDashboardProps) {
  const totalLessons = useMemo(
    () => courses.reduce((sum, c) => sum + c.lessons.length, 0),
    [courses]
  );

  const completedCount = progress.completedLessonIds.length;
  const activeStage: SkillLevel =
    completedCount >= Math.max(8, Math.floor(totalLessons * 0.65))
      ? 'Expert'
      : completedCount >= 2
      ? 'Intermediate'
      : 'Beginner';

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return null;
    const matchedCourses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(normalizedQuery) ||
        c.subCategory.toLowerCase().includes(normalizedQuery) ||
        c.level.toLowerCase().includes(normalizedQuery) ||
        c.instructor.toLowerCase().includes(normalizedQuery)
    );
    const matchedTools = tools3D.filter(
      (t) =>
        t.name.toLowerCase().includes(normalizedQuery) ||
        t.bestFor.toLowerCase().includes(normalizedQuery)
    );
    const matchedShorts = shorts.filter(
      (s) =>
        s.title.toLowerCase().includes(normalizedQuery) ||
        s.category.toLowerCase().includes(normalizedQuery) ||
        s.subCategory.toLowerCase().includes(normalizedQuery)
    );
    return { matchedCourses, matchedTools, matchedShorts };
  }, [normalizedQuery, courses, tools3D, shorts]);

  const categories = [
    { id: 'makeup' as const, label: 'Makeup', icon: <CategoryMakeupIcon className="h-10 w-10" /> },
    { id: 'lab3d' as const, label: '3D Tools', icon: <Category3DToolsIcon className="h-10 w-10" /> },
    { id: 'faceTypes' as const, label: 'Face Types', icon: <CategoryFaceTypesIcon className="h-10 w-10" /> },
    { id: 'hairstyles' as const, label: 'Hairstyles', icon: <CategoryHairstylesIcon className="h-10 w-10" /> },
    { id: 'mehndi' as const, label: 'Mehndi', icon: <CategoryMehndiIcon className="h-10 w-10" /> },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-12">
      {/* Top Header matching Screenshot 4 */}
      <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-5">
        <div className="shrink-0">
          <GlamCraftWordmark />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2.5 min-w-[210px]">
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search courses, tools..."
              aria-label="Search courses, 3D tools, hairstyles, and Mehndi"
              className="w-full rounded-full border border-[#EFE0DB] bg-[#F5EAE5] py-2.5 pl-4 pr-10 text-sm text-[#2D1B2E] placeholder:text-[#967D84] focus:border-[#D49A89] focus:bg-white focus:outline-none transition-colors"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6572] hover:text-[#2D1B2E]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A78277]" />
            )}
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            title="Admin CMS Panel"
            aria-label="Open Admin Panel"
            className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E7D4CD] bg-white px-3.5 text-xs font-semibold text-[#3E1F34] transition-colors hover:border-[#D49A89] hover:bg-[#FAF0EC] whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="h-4 w-4 text-[#B97664]" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Open Profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E7D4CD] bg-white text-[#2D1B2E] transition-colors hover:border-[#D49A89] hover:bg-[#FAF0EC]"
          >
            {progress.isProUser ? (
              <Crown className="h-4 w-4 text-[#C89B3C]" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* Instant Global Search Results Drawer */}
      {searchResults && (
        <section className="mt-4 rounded-2xl border border-[#E7CFC6] bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#2D1B2E]">
              Search Results for “{searchQuery}”
            </h2>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-xs font-medium text-[#B97664] hover:underline"
            >
              Clear
            </button>
          </div>

          {searchResults.matchedCourses.length === 0 &&
          searchResults.matchedTools.length === 0 &&
          searchResults.matchedShorts.length === 0 ? (
            <p className="py-4 text-center text-sm text-[#7A6572]">
              No matching courses, 3D tools, hairstyles, or Mehndi tutorials found.
            </p>
          ) : (
            <div className="space-y-3">
              {searchResults.matchedCourses.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A6572]">
                    Courses ({searchResults.matchedCourses.length})
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {searchResults.matchedCourses.map((course) => (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => onOpenCourse(course.id)}
                        className="flex items-center gap-3 rounded-xl border border-[#F2E4DF] p-2 text-left hover:bg-[#FFF6F2]"
                      >
                        <YouTubeThumbnail
                          videoId={course.lessons[0]?.youtubeVideoId ?? '5O0YDHiosD0'}
                          alt={course.title}
                          compact
                          className="h-12 w-20 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#2D1B2E]">{course.title}</p>
                          <p className="text-xs text-[#7A6572]">
                            {course.level} · {course.lessons.length} Lessons
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedTools.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A6572]">
                    3D Makeup Tools ({searchResults.matchedTools.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.matchedTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => onOpenCategory('lab3d')}
                        className="rounded-xl border border-[#EDD9D2] bg-[#FFF9F6] px-3 py-2 text-left text-xs font-semibold text-[#2D1B2E] hover:border-[#D49A89]"
                      >
                        {tool.name} · <span className="font-normal text-[#7A6572]">{tool.bestFor}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedShorts.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A6572]">
                    Hairstyles & Mehndi Shorts ({searchResults.matchedShorts.length})
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {searchResults.matchedShorts.map((short) => (
                      <button
                        key={short.id}
                        type="button"
                        onClick={() => onOpenShort(short)}
                        className="flex items-center justify-between rounded-xl border border-[#F2E4DF] px-3 py-2 text-left hover:bg-[#FFF6F2]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#2D1B2E]">{short.title}</p>
                          <p className="text-[11px] text-[#7A6572]">
                            {short.category} · {short.subCategory}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-[#B97664]">{short.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Hero Progress Card ("Fresh to Expert Path") matching Screenshot 4 */}
      <section className="mt-5 overflow-hidden rounded-[26px] border border-[#DEC0B6] hero-blush-surface px-5 py-5 sm:px-8 sm:py-7 shadow-[0_12px_32px_rgba(61,31,52,0.06)]">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-2xl sm:text-[32px] font-bold leading-tight text-[#2D1B2E]">
              Fresh to Expert Path
            </h1>
            <p className="mt-1 text-sm text-[#6B5461]">
              Luxury online progress card · {completedCount} of {totalLessons} lessons completed
            </p>
          </div>
          <span className="text-xs font-medium text-[#8C6458] tabular-nums">
            Tap any stage to filter courses
          </span>
        </div>

        {/* Interactive Winding Path matching Screenshot 4 */}
        <div className="relative mt-5 py-3">
          {/* Connecting S-curve spline */}
          <svg
            viewBox="0 0 600 110"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M 85 84 C 195 84, 210 52, 300 52 C 390 52, 415 24, 515 24"
              fill="none"
              stroke="#C99688"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Decorative 4-point sparkles from Screenshot 4 */}
            <path d="M525 14 L527 20 L533 22 L527 24 L525 30 L523 24 L517 22 L523 20 Z" fill="#C99688" opacity="0.7" />
            <path d="M62 40 L63.5 44 L67.5 45.5 L63.5 47 L62 51 L60.5 47 L56.5 45.5 L60.5 44 Z" fill="#C99688" opacity="0.65" />
            <path d="M432 70 L433.2 73.2 L436.5 74.5 L433.2 75.8 L432 79 L430.8 75.8 L427.5 74.5 L430.8 73.2 Z" fill="#C99688" opacity="0.6" />
          </svg>

          <div className="relative grid grid-cols-3 items-center gap-2 min-h-[96px]">
            {/* Beginner Stage (Lower Left) */}
            <div className="flex justify-start self-end pb-1">
              <button
                type="button"
                onClick={() => onSelectLevel('Beginner')}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-sm whitespace-nowrap ${
                  activeStage === 'Beginner'
                    ? 'bg-[#3B1B30] text-white shadow-md scale-105'
                    : 'bg-[#C99B8B] text-[#2D1B2E] hover:bg-[#B88574] hover:text-white'
                }`}
              >
                Beginner
              </button>
            </div>

            {/* Intermediate Stage (Center Elevated) */}
            <div className="flex justify-center self-center">
              <button
                type="button"
                onClick={() => onSelectLevel('Intermediate')}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeStage === 'Intermediate'
                    ? 'bg-[#3B1B30] text-white shadow-[0_6px_18px_rgba(59,27,48,0.28)] scale-105'
                    : 'bg-[#C99B8B] text-[#2D1B2E] hover:bg-[#3B1B30] hover:text-white'
                }`}
              >
                Intermediate
              </button>
            </div>

            {/* Expert Stage (Upper Right) */}
            <div className="flex justify-end self-start pt-1">
              <button
                type="button"
                onClick={() => onSelectLevel('Expert')}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-sm whitespace-nowrap ${
                  activeStage === 'Expert'
                    ? 'bg-[#3B1B30] text-white shadow-md scale-105'
                    : 'bg-[#C99B8B] text-[#2D1B2E] hover:bg-[#B88574] hover:text-white'
                }`}
              >
                Expert
              </button>
            </div>
          </div>

          {/* Step Indicator Dots matching Screenshot 4 */}
          <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden="true">
            <span
              className={`h-1.5 rounded-full transition-all ${
                activeStage === 'Beginner' ? 'w-5 bg-[#C58371]' : 'w-1.5 bg-[#DFC3BA]'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all ${
                activeStage === 'Intermediate' ? 'w-5 bg-[#C58371]' : 'w-1.5 bg-[#DFC3BA]'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all ${
                activeStage === 'Expert' ? 'w-5 bg-[#C58371]' : 'w-1.5 bg-[#DFC3BA]'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Category Icon Bar matching Screenshot 4 */}
      <section className="mt-6" aria-label="Academy categories">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onOpenCategory(cat.id)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
            >
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-[#F2E4DF] bg-white shadow-[0_6px_18px_rgba(61,31,52,0.04)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#D49A89] group-hover:shadow-md">
                {cat.icon}
              </div>
              <span className="text-center text-xs sm:text-sm font-medium text-[#2D1B2E] group-hover:text-[#B97664] transition-colors">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Optional Home Feed Ad Banner Slot */}
      <div className="mt-6">
        <AdBannerSlot
          placement="home"
          monetization={monetization}
          isProUser={progress.isProUser}
          onUpgradeClick={onOpenUpgrade}
        />
      </div>

      {/* Featured Courses Section matching Screenshot 4 */}
      <section className="mt-7">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl sm:text-[26px] font-bold text-[#2D1B2E]">
            Featured Courses
          </h2>
          <button
            type="button"
            onClick={() => onOpenCategory('makeup')}
            className="text-xs sm:text-sm font-semibold text-[#B97664] hover:text-[#2D1B2E] transition-colors"
          >
            View All ({courses.length})
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const coverVideoId = course.lessons[0]?.youtubeVideoId ?? '5O0YDHiosD0';
            const completedInCourse = course.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;

            return (
              <article
                key={course.id}
                onClick={() => onOpenCourse(course.id)}
                className="group cursor-pointer overflow-hidden rounded-[22px] border border-[#F2E4DF] bg-white p-3 shadow-[0_8px_24px_rgba(61,31,52,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DFB7AA] hover:shadow-[0_14px_32px_rgba(61,31,52,0.08)]"
              >
                <YouTubeThumbnail
                  videoId={coverVideoId}
                  alt={course.title}
                  category={course.category === 'Makeup' ? 'Makeup' : course.category}
                  showPlayButton
                  isPremiumBadge={course.isPremium}
                  className="aspect-[16/10] w-full rounded-2xl"
                />

                <div className="mt-3 px-1">
                  <h3 className="font-sans text-[17px] font-bold leading-snug text-[#2D1B2E] line-clamp-2 group-hover:text-[#9D5E4C] transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#7A6572] truncate">
                    {course.instructor}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-0.5 text-[#D49A89]" aria-label={`Rated ${course.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3.5 w-3.5 ${
                            idx < Math.round(course.rating) ? 'fill-[#D49A89]' : 'text-[#E7D6D0]'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 font-medium text-[#5A4451] tabular-nums">
                        {course.lessons.length} Lessons
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-[#8C6458] tabular-nums">
                      {completedInCourse > 0
                        ? `${completedInCourse}/${course.lessons.length} done`
                        : course.level}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
