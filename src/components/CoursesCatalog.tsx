import React, { useMemo, useState } from 'react';
import { Search, Star, X } from 'lucide-react';
import { Course, SkillLevel, UserProgress } from '../types/academy';
import { YouTubeThumbnail } from './YouTubeMedia';

interface CoursesCatalogProps {
  courses: Course[];
  progress: UserProgress;
  selectedLevel: SkillLevel | 'All';
  onSelectLevel: (level: SkillLevel | 'All') => void;
  onOpenCourse: (courseId: string) => void;
}

const LEVELS: Array<SkillLevel | 'All'> = ['All', 'Beginner', 'Intermediate', 'Expert'];

const MAKEUP_TYPES = [
  'All Types',
  'Bridal Makeup',
  'Party & Evening Glam',
  'Everyday / No-Makeup',
  'Dewy vs. Matte Base',
  'Eye Makeup Mastery',
  'Skin Prep & Color Correction',
];

export function CoursesCatalog({
  courses,
  progress,
  selectedLevel,
  onSelectLevel,
  onOpenCourse,
}: CoursesCatalogProps) {
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [query, setQuery] = useState('');

  const availableTypes = useMemo(() => {
    const set = new Set(MAKEUP_TYPES);
    courses.forEach((c) => {
      if (c.subCategory) set.add(c.subCategory);
    });
    return Array.from(set);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (selectedLevel !== 'All' && course.level !== selectedLevel) return false;
      if (selectedType !== 'All Types' && course.subCategory !== selectedType) return false;
      if (q) {
        const hay = `${course.title} ${course.subCategory} ${course.instructor} ${course.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [courses, selectedLevel, selectedType, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B97664]">
            Makeup Types Encyclopedia
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-[#2D1B2E]">
            Academy Masterclasses
          </h1>
          <p className="mt-1 text-sm text-[#7A6572]">
            Filter by skill stage or artistry discipline — from Everyday skin prep to Pro Bridal glam.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter courses..."
            aria-label="Filter courses"
            className="w-full rounded-full border border-[#EFE0DB] bg-white py-2.5 pl-4 pr-10 text-sm text-[#2D1B2E] placeholder:text-[#967D84] focus:border-[#D49A89] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear filter"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6572]"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A78277]" />
          )}
        </div>
      </div>

      {/* Skill Level Segmented Filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {LEVELS.map((level) => {
          const active = selectedLevel === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelectLevel(level)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                active
                  ? 'bg-[#3E1F34] text-white shadow-sm'
                  : 'border border-[#E7D4CD] bg-white text-[#5A4451] hover:border-[#D49A89] hover:text-[#2D1B2E]'
              }`}
            >
              {level === 'All' ? 'All Levels' : level}
            </button>
          );
        })}
      </div>

      {/* Makeup Type Horizontal Filter Bar */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {availableTypes.map((type) => {
          const active = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'rose-gold-gradient text-white shadow-sm'
                  : 'border border-[#EFE0DB] bg-[#FFFDFB] text-[#6B5461] hover:border-[#D49A89]'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-[#F2E4DF] bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-[#2D1B2E]">
            No courses match these filters
          </p>
          <p className="mt-1 text-sm text-[#7A6572]">
            Try resetting the skill level or makeup category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectLevel('All');
              setSelectedType('All Types');
              setQuery('');
            }}
            className="mt-4 rounded-xl rose-gold-gradient px-5 py-2.5 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const coverVideoId = course.lessons[0]?.youtubeVideoId ?? '5O0YDHiosD0';
            const completed = course.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const pct = course.lessons.length
              ? Math.round((completed / course.lessons.length) * 100)
              : 0;

            return (
              <article
                key={course.id}
                onClick={() => onOpenCourse(course.id)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#F2E4DF] bg-white p-3 shadow-[0_8px_22px_rgba(61,31,52,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DFB7AA] hover:shadow-md"
              >
                <YouTubeThumbnail
                  videoId={coverVideoId}
                  alt={course.title}
                  showPlayButton
                  isPremiumBadge={course.isPremium}
                  className="aspect-video w-full rounded-2xl"
                />

                <div className="mt-3 flex flex-1 flex-col px-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#9C6555]">
                    <span className="font-semibold">{course.subCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.level}</span>
                  </div>

                  <h2 className="mt-1 font-display text-lg font-bold leading-snug text-[#2D1B2E] group-hover:text-[#9D5E4C] transition-colors">
                    {course.title}
                  </h2>

                  <p className="mt-1.5 text-xs leading-relaxed text-[#6E5965] line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between text-xs text-[#5A4451]">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-[#D49A89] text-[#D49A89]" />
                        <span className="font-semibold tabular-nums">{course.rating.toFixed(1)}</span>
                        <span className="text-[#9E8A94]">·</span>
                        <span className="tabular-nums">{course.lessons.length} Lessons</span>
                      </div>
                      <span className="font-medium text-[#8C6458] tabular-nums">
                        {pct > 0 ? `${pct}% complete` : 'Start'}
                      </span>
                    </div>

                    {pct > 0 && (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F5E6E1]">
                        <div
                          className="h-full rounded-full rose-gold-gradient transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
