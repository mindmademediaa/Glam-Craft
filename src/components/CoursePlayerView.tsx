import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  Save,
} from 'lucide-react';
import { Course, MonetizationConfig, UserProgress } from '../types/academy';
import { AdBannerSlot } from './AdBannerSlot';
import { LessonWalkthroughPlayer } from './LessonWalkthroughPlayer';
import { YouTubeEmbed, YouTubeThumbnail } from './YouTubeMedia';

interface CoursePlayerViewProps {
  course: Course;
  monetization: MonetizationConfig;
  progress: UserProgress;
  onBack: () => void;
  onToggleBookmarkCourse: (courseId: string) => void;
  onToggleLessonComplete: (lessonId: string) => void;
  onToggleProductCheck: (lessonId: string, product: string) => void;
  onSavePersonalNote: (lessonId: string, note: string) => void;
  onOpenUpgrade: () => void;
}

export function CoursePlayerView({
  course,
  monetization,
  progress,
  onBack,
  onToggleBookmarkCourse,
  onToggleLessonComplete,
  onToggleProductCheck,
  onSavePersonalNote,
  onOpenUpgrade,
}: CoursePlayerViewProps) {
  const defaultLessonIndex = useMemo(() => {
    if (course.id === 'course_bridal_01') return 0;
    const firstUnlockedUnfinished = course.lessons.findIndex(
      (l) =>
        (!l.isPremium || progress.isProUser) &&
        !progress.completedLessonIds.includes(l.id)
    );
    if (firstUnlockedUnfinished !== -1) return firstUnlockedUnfinished;
    return 0;
  }, [course.id, course.lessons, progress.completedLessonIds, progress.isProUser]);

  const [activeLessonId, setActiveLessonId] = useState<string>(
    course.lessons[defaultLessonIndex]?.id ?? course.lessons[0]?.id ?? ''
  );
  const [playerMode, setPlayerMode] = useState<'studio' | 'youtube'>('studio');
  const [activeTab, setActiveTab] = useState<'lessons' | 'products' | 'notes'>('lessons');
  const [noteDraft, setNoteDraft] = useState<string>(
    progress.personalNotes[activeLessonId] ?? ''
  );
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  const activeIndex = Math.max(
    0,
    course.lessons.findIndex((l) => l.id === activeLessonId)
  );
  const activeLesson = course.lessons[activeIndex] ?? course.lessons[0];
  const hasStudioWalkthrough = activeLesson?.id === 'l_bridal_01';

  const isBookmarked = progress.bookmarkedCourseIds.includes(course.id);
  const isLessonLocked = activeLesson ? activeLesson.isPremium && !progress.isProUser : false;
  const isLessonDone = activeLesson
    ? progress.completedLessonIds.includes(activeLesson.id)
    : false;
  const checkedList = activeLesson ? progress.checkedProducts[activeLesson.id] ?? [] : [];

  const handleSelectLesson = (lessonId: string, locked: boolean) => {
    if (locked) {
      onOpenUpgrade();
      return;
    }
    setActiveLessonId(lessonId);
    setNoteDraft(progress.personalNotes[lessonId] ?? '');
    setNoteSavedToast(false);
  };

  const handleSaveNote = () => {
    if (!activeLesson) return;
    onSavePersonalNote(activeLesson.id, noteDraft);
    setNoteSavedToast(true);
    window.setTimeout(() => setNoteSavedToast(false), 2000);
  };

  return (
    <div className="min-h-full bg-[#FFF9F6] pb-28 lg:pb-12">
      {/* Top Bar matching Screenshot 2 */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#F2E4DF] bg-[#FFF9F6]/95 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to courses"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#2D1B2E] transition-colors hover:bg-[#F5E6E1]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#2D1B2E] uppercase">
          GlamCraft Academy
        </span>

        <button
          type="button"
          onClick={() => onToggleBookmarkCourse(course.id)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark course'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#2D1B2E] transition-colors hover:bg-[#F5E6E1]"
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-[#C58371] text-[#C58371]' : ''}`} />
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left / Main Video & Meta Column */}
          <div className="lg:col-span-7">
            {hasStudioWalkthrough && !isLessonLocked && (
              <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-[#EBDAD4] bg-white p-1.5">
                <span className="pl-2 text-xs font-semibold text-[#5A4451]">
                  Lesson 1 Video Mode
                </span>
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPlayerMode('studio')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      playerMode === 'studio'
                        ? 'bg-[#3E1F34] text-white'
                        : 'text-[#6B5461] hover:bg-[#FAF0EC]'
                    }`}
                  >
                    12s Studio Walkthrough
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerMode('youtube')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      playerMode === 'youtube'
                        ? 'bg-[#3E1F34] text-white'
                        : 'text-[#6B5461] hover:bg-[#FAF0EC]'
                    }`}
                  >
                    YouTube Embed
                  </button>
                </div>
              </div>
            )}

            {activeLesson && !isLessonLocked ? (
              hasStudioWalkthrough && playerMode === 'studio' ? (
                <LessonWalkthroughPlayer />
              ) : (
                <YouTubeEmbed
                  videoId={activeLesson.youtubeVideoId}
                  title={`${course.title} — ${activeLesson.title}`}
                />
              )
            ) : (
              <div className="relative flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-[#2D1B2E] p-6 text-center text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Lock className="h-6 w-6 text-[#E6B8A8]" />
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">Pro Masterclass Lesson</h3>
                <p className="mt-1 max-w-sm text-xs text-[#E4D1DA]">
                  Upgrade to GlamCraft Pro to stream this lesson ad-free inside the studio player.
                </p>
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="mt-4 rounded-xl rose-gold-gradient px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Unlock All Pro Courses
                </button>
              </div>
            )}

            {/* Course Title & Metadata matching Screenshot 2 */}
            <div className="mt-4">
              <h1 className="font-display text-2xl sm:text-[28px] font-semibold leading-snug text-[#2D1B2E]">
                ‘{course.title}’
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-[#EBD2C8] px-3.5 py-1 text-xs font-semibold text-[#2D1B2E]">
                    {course.level === 'Expert' ? 'Beginner to Pro' : course.level}
                  </span>
                  <span className="text-sm text-[#4C3644] tabular-nums">
                    Lesson {activeIndex + 1} of {course.lessons.length}
                    {activeLesson ? ` (${activeLesson.duration})` : ''}
                  </span>
                </div>

                {activeLesson && !isLessonLocked && (
                  <button
                    type="button"
                    onClick={() => onToggleLessonComplete(activeLesson.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      isLessonDone
                        ? 'bg-[#3E1F34] text-white'
                        : 'border border-[#E2C9C0] bg-white text-[#2D1B2E] hover:bg-[#FAF0EC]'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{isLessonDone ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right / Tabs & Playlist Column matching Screenshot 2 */}
          <div className="lg:col-span-5">
            {/* 3 Underline Tabs: Lessons | Products Used | Notes */}
            <div className="grid grid-cols-3 border-b border-[#EBDAD4]">
              {(
                [
                  { id: 'lessons', label: 'Lessons' },
                  { id: 'products', label: 'Products Used' },
                  { id: 'notes', label: 'Notes' },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-3 text-center text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive ? 'text-[#B97664] font-semibold' : 'text-[#6A5461] hover:text-[#2D1B2E]'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#C58371]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Lessons Playlist */}
            {activeTab === 'lessons' && (
              <div className="mt-3 space-y-2.5">
                {course.lessons.map((lesson, idx) => {
                  const locked = lesson.isPremium && !progress.isProUser;
                  const isPlaying = activeLesson?.id === lesson.id;
                  const completed = progress.completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => handleSelectLesson(lesson.id, locked)}
                      className={`group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all ${
                        isPlaying
                          ? 'border border-[#D7A292] bg-[#FAF0EC] shadow-sm'
                          : 'border border-transparent hover:bg-white'
                      }`}
                    >
                      <span className="w-5 shrink-0 text-center text-sm font-medium text-[#4D3744] tabular-nums">
                        {idx + 1}.
                      </span>

                      <YouTubeThumbnail
                        videoId={lesson.youtubeVideoId}
                        alt={lesson.title}
                        compact
                        isLocked={locked}
                        className="h-12 w-20 shrink-0 rounded-lg"
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm ${
                            isPlaying ? 'font-bold text-[#2D1B2E]' : 'font-medium text-[#2D1B2E]'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}. {lesson.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#7A6572] tabular-nums">
                          {lesson.duration}
                          {lesson.isPremium && (
                            <span className="ml-2 font-semibold text-[#C89B3C]">PRO</span>
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 pl-1">
                        {locked ? (
                          <Lock className="h-4 w-4 text-[#C98E7E]" />
                        ) : isPlaying ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E1F34] text-white">
                            <Play className="h-3 w-3 fill-white ml-0.5" />
                          </span>
                        ) : completed ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E1F34] text-white">
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <Circle className="h-5 w-5 text-[#D5BEB6]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Products Used Checklist */}
            {activeTab === 'products' && activeLesson && (
              <div className="mt-4 rounded-2xl border border-[#F2E4DF] bg-white p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-[#2D1B2E]">
                    Kit Checklist for Lesson {activeIndex + 1}
                  </h2>
                  <span className="text-xs font-medium text-[#8C6458] tabular-nums">
                    {checkedList.length}/{activeLesson.productsUsed.length} ready
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#7A6572]">
                  Tap each cosmetic or brush as you assemble your vanity kit.
                </p>

                <ul className="mt-3 divide-y divide-[#F6EAE5]">
                  {activeLesson.productsUsed.map((product) => {
                    const checked = checkedList.includes(product);
                    return (
                      <li key={product}>
                        <button
                          type="button"
                          onClick={() => onToggleProductCheck(activeLesson.id, product)}
                          className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-[#FFF9F6]"
                        >
                          {checked ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#B97664]" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-[#D4BEB6]" />
                          )}
                          <span
                            className={`text-sm ${
                              checked ? 'text-[#8E7A85] line-through' : 'font-medium text-[#2D1B2E]'
                            }`}
                          >
                            {product}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Tab 3: Artist Notes & Personal Note Saver */}
            {activeTab === 'notes' && activeLesson && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-[#F2E4DF] bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B97664]">
                    Educator Key Takeaway
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#3D2735]">
                    {activeLesson.notes}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#F2E4DF] bg-white p-4">
                  <label
                    htmlFor="personal-lesson-note"
                    className="block text-xs font-semibold text-[#2D1B2E]"
                  >
                    Your Personal Study Notes
                  </label>
                  <textarea
                    id="personal-lesson-note"
                    rows={4}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Jot down brush angles, foundation shade mixes, or client prep reminders..."
                    className="mt-2 w-full rounded-xl border border-[#EBDAD4] bg-[#FFFDFB] p-3 text-sm text-[#2D1B2E] placeholder:text-[#9D8791] focus:border-[#D49A89] focus:outline-none"
                  />
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs text-[#8C6458]">
                      {noteSavedToast ? 'Saved to your profile!' : 'Saved locally on this device'}
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#3E1F34] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Monetization Area matching Screenshot 2 */}
            <div className="mt-6 space-y-3">
              <AdBannerSlot
                placement="player"
                monetization={monetization}
                isProUser={progress.isProUser}
                onUpgradeClick={onOpenUpgrade}
              />

              {!progress.isProUser && (
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="flex w-full items-center justify-center gap-2 rounded-xl rose-gold-metallic py-3.5 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.98] hover:opacity-95"
                >
                  <span>Unlock All Pro Courses</span>
                  <Lock className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
