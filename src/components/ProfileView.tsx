import React from 'react';
import {
  Award,
  Bookmark,
  Box,
  CheckCircle2,
  ChevronRight,
  Crown,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Course, Tool3D, UserProgress } from '../types/academy';
import { YouTubeThumbnail } from './YouTubeMedia';

interface ProfileViewProps {
  courses: Course[];
  tools3D: Tool3D[];
  progress: UserProgress;
  onOpenCourse: (courseId: string) => void;
  onOpen3DLab: () => void;
  onOpenAdmin: () => void;
  onOpenUpgrade: () => void;
}

export function ProfileView({
  courses,
  tools3D,
  progress,
  onOpenCourse,
  onOpen3DLab,
  onOpenAdmin,
  onOpenUpgrade,
}: ProfileViewProps) {
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = progress.completedLessonIds.length;
  const pct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const currentRank =
    pct >= 70 ? 'Expert Bridal Artist' : pct >= 25 ? 'Intermediate Stylist' : 'Fresh Beginner';

  const bookmarkedCourses = courses.filter((c) => progress.bookmarkedCourseIds.includes(c.id));
  const bookmarkedTools = tools3D.filter((t) => progress.bookmarkedToolIds.includes(t.id));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      {/* Profile Hero Banner */}
      <section className="overflow-hidden rounded-[26px] border border-[#DFC0B6] bg-white shadow-[0_10px_28px_rgba(61,31,52,0.06)]">
        <div className="bg-[#3E1F34] px-6 py-6 text-white sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E6B8A8] to-[#B87462] font-display text-2xl font-bold text-[#2D1B2E] shadow-md">
              GC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white">Academy Member</h1>
                {progress.isProUser && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#C89B3C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    <Crown className="h-3 w-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-[#E5CDD8]">{currentRank}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenUpgrade}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl rose-gold-gradient px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
          >
            <Crown className="h-4 w-4" />
            <span>{progress.isProUser ? 'Manage Pro Plan' : 'Upgrade to Pro'}</span>
          </button>
        </div>

        {/* Progress Metrics Row */}
        <div className="grid grid-cols-3 divide-x divide-[#F2E4DF] border-t border-[#F2E4DF] bg-[#FFFDFB]">
          <div className="px-4 py-4 text-center">
            <p className="font-display text-2xl font-bold text-[#2D1B2E] tabular-nums">
              {completedLessons}
            </p>
            <p className="mt-0.5 text-xs text-[#7A6572]">Lessons Done</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="font-display text-2xl font-bold text-[#2D1B2E] tabular-nums">
              {pct}%
            </p>
            <p className="mt-0.5 text-xs text-[#7A6572]">Mastery Path</p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="font-display text-2xl font-bold text-[#2D1B2E] tabular-nums">
              {bookmarkedCourses.length + bookmarkedTools.length}
            </p>
            <p className="mt-0.5 text-xs text-[#7A6572]">Saved Items</p>
          </div>
        </div>
      </section>

      {/* Dedicated Admin Panel Entry Card (PRD Section 3) */}
      <section className="mt-6 rounded-2xl border border-[#D8B4A7] bg-gradient-to-r from-[#FDF1EC] to-[#FFF9F6] p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3E1F34] text-[#E8B8A9]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                Academy Admin Panel &amp; YouTube CMS
              </h2>
              <p className="mt-0.5 text-xs leading-relaxed text-[#6B5461]">
                Import YouTube tutorials &amp; Shorts with one paste, edit 3D Tools, manage Ad-Tags &amp; Pro locks, and export your JSON database.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3E1F34] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] hover:bg-[#522A45]"
          >
            <Lock className="h-4 w-4 text-[#E6B8A8]" />
            <span>Open Admin Panel</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Two-Column Saved Collections */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Saved Courses */}
        <section className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#2D1B2E]">Bookmarked Courses</h2>
            <Bookmark className="h-4 w-4 text-[#C58371]" />
          </div>

          {bookmarkedCourses.length === 0 ? (
            <p className="mt-4 text-sm text-[#7A6572]">
              Tap the bookmark icon inside any course player to save it here for quick studio review.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {bookmarkedCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => onOpenCourse(course.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#F2E4DF] p-2.5 text-left transition-colors hover:bg-[#FFF6F2]"
                >
                  <YouTubeThumbnail
                    videoId={course.lessons[0]?.youtubeVideoId ?? '5O0YDHiosD0'}
                    alt={course.title}
                    compact
                    className="h-14 w-24 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#2D1B2E]">{course.title}</p>
                    <p className="mt-0.5 text-xs text-[#7A6572]">
                      {course.level} · {course.lessons.length} Lessons
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#B97664]" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Saved 3D Tools & Certification Progress */}
        <section className="space-y-5">
          <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#2D1B2E]">Saved 3D Tools</h2>
              <Box className="h-4 w-4 text-[#C58371]" />
            </div>

            {bookmarkedTools.length === 0 ? (
              <p className="mt-3 text-sm text-[#7A6572]">
                Bookmark brushes and tools inside the 3D Lab to keep them in your quick reference kit.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {bookmarkedTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={onOpen3DLab}
                    className="flex w-full items-center justify-between rounded-xl border border-[#F2E4DF] px-3.5 py-2.5 text-left hover:bg-[#FFF6F2]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#2D1B2E]">{tool.name}</p>
                      <p className="text-xs text-[#7A6572]">{tool.bestFor}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#B97664]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#C89B3C]" />
              <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                Fresh to Expert Milestones
              </h2>
            </div>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-[#2D1B2E]">
                  <CheckCircle2 className="h-4 w-4 text-[#B97664]" />
                  Beginner Foundations
                </span>
                <span className="text-[#7A6572]">Unlocked</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-[#2D1B2E]">
                  <Sparkles className="h-4 w-4 text-[#D49A89]" />
                  Intermediate Artistry
                </span>
                <span className="text-[#7A6572] tabular-nums">
                  {completedLessons >= 2 ? 'In Progress' : 'Complete 2 lessons'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-[#2D1B2E]">
                  <Crown className="h-4 w-4 text-[#C89B3C]" />
                  Expert Pro Bridal Certification
                </span>
                <span className="text-[#7A6572] tabular-nums">{pct}%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
