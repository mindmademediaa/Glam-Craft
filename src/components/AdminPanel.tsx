import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Box,
  Check,
  Crown,
  Database,
  DollarSign,
  Download,
  Eye,
  Film,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  Youtube,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import {
  AcademyDatabase,
  Course,
  FaceShape,
  Lesson,
  ShortVideo,
  SkillLevel,
  Tool3D,
  ToolModelPreset,
} from '../types/academy';
import { extractYouTubeVideoId } from '../utils/youtube';
import { YouTubeEmbed, YouTubeThumbnail } from './YouTubeMedia';

interface AdminPanelProps {
  db: AcademyDatabase;
  isProPreview: boolean;
  onUpdateDb: (next: AcademyDatabase) => void;
  onSetProPreview: (isPro: boolean) => void;
  onExit: () => void;
}

type AdminSection = 'overview' | 'courses' | 'shorts' | 'tools' | 'monetization' | 'database';

const ADMIN_DEMO_PIN = '1234';
const ALL_FACE_SHAPES: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Long'];
const TOOL_PRESETS: Array<{ value: ToolModelPreset; label: string }> = [
  { value: 'contour_brush', label: 'Angled Contour Brush' },
  { value: 'beauty_blender', label: 'Beauty Blender Sponge' },
  { value: 'foundation_brush', label: 'Flat-Top Foundation Brush' },
  { value: 'eyelash_curler', label: 'Ergonomic Eyelash Curler' },
  { value: 'eyeshadow_brush', label: 'Tapered Eyeshadow Brush' },
];

export function AdminPanel({
  db,
  isProPreview,
  onUpdateDb,
  onSetProPreview,
  onExit,
}: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [section, setSection] = useState<AdminSection>('overview');
  const [toast, setToast] = useState<string | null>(null);

  // Selected Course state for lesson management
  const [selectedCourseId, setSelectedCourseId] = useState<string>(db.courses[0]?.id ?? '');

  // New Course form state
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('Ananya Verma · Master Artist');
  const [newCourseSubCategory, setNewCourseSubCategory] = useState('Bridal Makeup');
  const [newCourseLevel, setNewCourseLevel] = useState<SkillLevel>('Beginner');
  const [newCourseFaceShapes, setNewCourseFaceShapes] = useState<FaceShape[]>(['Oval', 'Round']);
  const [newCoursePremium, setNewCoursePremium] = useState(false);
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // One-Click YouTube Lesson Importer state
  const [lessonUrl, setLessonUrl] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('12:30');
  const [lessonProducts, setLessonProducts] = useState('Hydrating Primer, Angled Contour Brush, Satin Blush');
  const [lessonNotes, setLessonNotes] = useState('');
  const [lessonPremium, setLessonPremium] = useState(false);
  const [showLessonPreview, setShowLessonPreview] = useState(false);

  // Shorts Quick-Add state
  const [shortUrl, setShortUrl] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [shortCategory, setShortCategory] = useState<'Hairstyles' | 'Mehndi'>('Hairstyles');
  const [shortSubCategory, setShortSubCategory] = useState('Bridal Braids');
  const [shortDuration, setShortDuration] = useState('00:58');
  const [shortViews, setShortViews] = useState('1.2k views');
  const [shortPremium, setShortPremium] = useState(false);
  const [showShortPreview, setShowShortPreview] = useState(false);

  // 3D Tools Manager state
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [toolName, setToolName] = useState('');
  const [toolShortName, setToolShortName] = useState('');
  const [toolPreset, setToolPreset] = useState<ToolModelPreset>('contour_brush');
  const [toolBestFor, setToolBestFor] = useState('');
  const [toolUsageTip, setToolUsageTip] = useState('');
  const [toolDemoUrl, setToolDemoUrl] = useState('');
  const [toolHotspotsText, setToolHotspotsText] = useState(
    'Synthetic Bristles | Ultra-soft fibers pick up pigment evenly | Wash weekly with gentle soap\nMetal Ferrule | Rose-gold crimping prevents shedding | Keep water below seam\nErgonomic Handle | Balanced grip for wrist precision | Hold midway for airbrushed finish'
  );

  // Import JSON ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const flashToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  // KPI Metrics
  const metrics = useMemo(() => {
    const totalLessons = db.courses.reduce((sum, c) => sum + c.lessons.length, 0);
    const proLessons = db.courses.reduce(
      (sum, c) => sum + c.lessons.filter((l) => l.isPremium).length,
      0
    );
    const proShorts = db.shorts.filter((s) => s.isPremium).length;
    const totalItems = totalLessons + db.shorts.length;
    const proItems = proLessons + proShorts;
    const proRatio = totalItems ? Math.round((proItems / totalItems) * 100) : 0;
    const activeAdCount = db.monetization.adsEnabled
      ? [
          db.monetization.homeBannerText,
          db.monetization.playerBannerText,
          db.monetization.shortsBannerText,
        ].filter(Boolean).length
      : 0;

    return {
      totalCourses: db.courses.length,
      totalLessons,
      totalShorts: db.shorts.length,
      totalTools: db.tools3D.length,
      freeRatio: 100 - proRatio,
      proRatio,
      activeAdCount,
    };
  }, [db]);

  const parsedLessonVideoId = extractYouTubeVideoId(lessonUrl);
  const parsedShortVideoId = extractYouTubeVideoId(shortUrl);
  const parsedToolVideoId = extractYouTubeVideoId(toolDemoUrl);

  const selectedCourse = db.courses.find((c) => c.id === selectedCourseId) ?? db.courses[0];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_DEMO_PIN) {
      setAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Use demo PIN 1234.');
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: newCourseTitle.trim(),
      instructor: newCourseInstructor.trim() || 'GlamCraft Lead Educator',
      category: 'Makeup',
      subCategory: newCourseSubCategory.trim() || 'Bridal Makeup',
      level: newCourseLevel,
      faceShapes: newCourseFaceShapes.length ? newCourseFaceShapes : ['Oval'],
      rating: 4.9,
      isPremium: newCoursePremium,
      description:
        newCourseDesc.trim() ||
        'Step-by-step luxury makeup masterclass curated inside GlamCraft Academy.',
      lessons: [],
    };
    onUpdateDb({ ...db, courses: [newCourse, ...db.courses] });
    setSelectedCourseId(newCourse.id);
    setNewCourseTitle('');
    setNewCourseDesc('');
    flashToast(`Created course "${newCourse.title}"`);
  };

  const handleDeleteCourse = (courseId: string) => {
    const nextCourses = db.courses.filter((c) => c.id !== courseId);
    onUpdateDb({ ...db, courses: nextCourses });
    if (selectedCourseId === courseId) {
      setSelectedCourseId(nextCourses[0]?.id ?? '');
    }
    flashToast('Course removed');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !parsedLessonVideoId || !lessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `lesson_${Date.now()}`,
      title: lessonTitle.trim(),
      youtubeVideoId: parsedLessonVideoId,
      duration: lessonDuration.trim() || '10:00',
      isPremium: lessonPremium,
      productsUsed: lessonProducts
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      notes:
        lessonNotes.trim() ||
        'Follow educator brush angles carefully and allow each skin-prep layer to settle.',
    };

    const updatedCourses = db.courses.map((c) =>
      c.id === selectedCourse.id ? { ...c, lessons: [...c.lessons, newLesson] } : c
    );
    onUpdateDb({ ...db, courses: updatedCourses });
    setLessonUrl('');
    setLessonTitle('');
    setLessonNotes('');
    setShowLessonPreview(false);
    flashToast(`Added lesson "${newLesson.title}" via YouTube ID ${parsedLessonVideoId}`);
  };

  const handleMoveLesson = (courseId: string, idx: number, dir: -1 | 1) => {
    const updatedCourses = db.courses.map((c) => {
      if (c.id !== courseId) return c;
      const target = idx + dir;
      if (target < 0 || target >= c.lessons.length) return c;
      const copy = [...c.lessons];
      const [moved] = copy.splice(idx, 1);
      copy.splice(target, 0, moved);
      return { ...c, lessons: copy };
    });
    onUpdateDb({ ...db, courses: updatedCourses });
  };

  const handleToggleLessonPro = (courseId: string, lessonId: string) => {
    const updatedCourses = db.courses.map((c) => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        lessons: c.lessons.map((l) =>
          l.id === lessonId ? { ...l, isPremium: !l.isPremium } : l
        ),
      };
    });
    onUpdateDb({ ...db, courses: updatedCourses });
  };

  const handleDeleteLesson = (courseId: string, lessonId: string) => {
    const updatedCourses = db.courses.map((c) => {
      if (c.id !== courseId) return c;
      return { ...c, lessons: c.lessons.filter((l) => l.id !== lessonId) };
    });
    onUpdateDb({ ...db, courses: updatedCourses });
    flashToast('Lesson deleted');
  };

  const handleAddShort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedShortVideoId || !shortTitle.trim()) return;
    const nextShort: ShortVideo = {
      id: `short_${Date.now()}`,
      title: shortTitle.trim(),
      category: shortCategory,
      subCategory: shortSubCategory.trim() || (shortCategory === 'Hairstyles' ? 'Bridal Updos' : 'Arabic'),
      youtubeVideoId: parsedShortVideoId,
      duration: shortDuration.trim() || '00:55',
      viewsLabel: shortViews.trim() || '1.1k views',
      isPremium: shortPremium,
    };
    onUpdateDb({ ...db, shorts: [nextShort, ...db.shorts] });
    setShortUrl('');
    setShortTitle('');
    setShowShortPreview(false);
    flashToast(`Published Short "${nextShort.title}"`);
  };

  const handleDeleteShort = (shortId: string) => {
    onUpdateDb({ ...db, shorts: db.shorts.filter((s) => s.id !== shortId) });
    flashToast('Short removed');
  };

  const handleToggleShortPro = (shortId: string) => {
    onUpdateDb({
      ...db,
      shorts: db.shorts.map((s) =>
        s.id === shortId ? { ...s, isPremium: !s.isPremium } : s
      ),
    });
  };

  const handleEditToolStart = (tool: Tool3D) => {
    setEditingToolId(tool.id);
    setToolName(tool.name);
    setToolShortName(tool.shortName);
    setToolPreset(tool.modelPreset);
    setToolBestFor(tool.bestFor);
    setToolUsageTip(tool.usageTip);
    setToolDemoUrl(`https://youtu.be/${tool.demoYoutubeId}`);
    setToolHotspotsText(
      tool.hotspots.map((h) => `${h.label} | ${h.detail} | ${h.careTip}`).join('\n')
    );
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !toolBestFor.trim()) return;

    const demoId = parsedToolVideoId ?? '5O0YDHiosD0';
    const defaultAnchors: Array<[number, number, number]> = [
      [-0.2, 1.2, 0.14],
      [0.05, 0.5, 0.14],
      [0.25, -0.58, 0.12],
    ];

    const parsedHotspots = toolHotspotsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((line, i) => {
        const [label, detail, careTip] = line.split('|').map((s) => s.trim());
        return {
          id: `hs_${Date.now()}_${i}`,
          label: label || `Part ${i + 1}`,
          detail: detail || 'Precision engineered salon component.',
          careTip: careTip || 'Clean regularly with gentle brush cleanser.',
          anchor: defaultAnchors[i % defaultAnchors.length],
          side: 'right' as const,
        };
      });

    const payload: Tool3D = {
      id: editingToolId ?? `tool_${Date.now()}`,
      name: toolName.trim(),
      shortName: toolShortName.trim() || toolName.trim(),
      modelPreset: toolPreset,
      bestFor: toolBestFor.trim(),
      usageTip: toolUsageTip.trim() || 'Use gentle feather-light strokes for even blending.',
      demoYoutubeId: demoId,
      hotspots: parsedHotspots,
    };

    const nextTools = editingToolId
      ? db.tools3D.map((t) => (t.id === editingToolId ? payload : t))
      : [...db.tools3D, payload];

    onUpdateDb({ ...db, tools3D: nextTools });
    setEditingToolId(null);
    setToolName('');
    setToolShortName('');
    setToolBestFor('');
    setToolUsageTip('');
    setToolDemoUrl('');
    flashToast(editingToolId ? `Updated 3D tool "${payload.name}"` : `Added 3D tool "${payload.name}"`);
  };

  const handleDeleteTool = (toolId: string) => {
    if (db.tools3D.length <= 1) {
      flashToast('Keep at least 1 tool in the 3D Lab');
      return;
    }
    onUpdateDb({ ...db, tools3D: db.tools3D.filter((t) => t.id !== toolId) });
    flashToast('3D Tool deleted');
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = dataService.validateImportedDatabase(String(reader.result ?? ''));
      if (result.ok) {
        onUpdateDb(result.data);
        flashToast('Imported glamcraft-data.json successfully!');
      } else {
        flashToast(result.error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // PIN Login Gate
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6] px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#DFC0B6] bg-white shadow-xl">
          <div className="bg-[#3E1F34] px-6 py-6 text-white">
            <button
              type="button"
              onClick={onExit}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#E8B8A9] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Academy App</span>
            </button>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-[#E6B8A8]" />
              <h1 className="font-display text-2xl font-bold">Admin Studio Login</h1>
            </div>
            <p className="mt-1 text-xs text-[#E4D1DA]">
              Zero-backend CMS protected by PIN (Firebase Auth ready).
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="p-6">
            <label htmlFor="admin-pin" className="block text-xs font-semibold text-[#2D1B2E]">
              Enter Admin PIN
            </label>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-digit PIN (Demo: 1234)"
              autoFocus
              className="mt-2 w-full rounded-xl border border-[#E5CFC7] bg-[#FFFDFB] px-4 py-3 text-center text-lg font-semibold tracking-[0.4em] text-[#2D1B2E] focus:border-[#C58371] focus:outline-none"
            />
            {pinError && <p className="mt-2 text-xs font-medium text-[#B8434E]">{pinError}</p>}

            <button
              type="submit"
              className="mt-5 w-full rounded-xl rose-gold-gradient py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Unlock Admin Dashboard
            </button>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FAF2EE] px-3.5 py-2.5 text-xs text-[#6B5461]">
              <span>Demo PIN: <strong className="text-[#2D1B2E]">1234</strong></span>
              <button
                type="button"
                onClick={() => {
                  setPinInput(ADMIN_DEMO_PIN);
                  setAuthenticated(true);
                }}
                className="font-semibold text-[#B97664] hover:underline"
              >
                Quick Fill &amp; Enter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const navItems: Array<{ id: AdminSection; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'courses', label: 'Courses & Lessons', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'shorts', label: 'Shorts Hub', icon: <Film className="h-4 w-4" /> },
    { id: 'tools', label: '3D Tools Lab', icon: <Box className="h-4 w-4" /> },
    { id: 'monetization', label: 'Ads & Pro Plans', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'database', label: 'JSON Export', icon: <Database className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F6] pb-16">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#4E2A42] bg-[#3E1F34] px-4 py-3 text-white shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Live App</span>
            </button>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight">
                GlamCraft CMS Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Instant Free vs Pro User Mode Preview Toggle */}
            <div className="inline-flex items-center rounded-lg bg-white/10 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onSetProPreview(false)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  !isProPreview ? 'bg-white text-[#2D1B2E]' : 'text-white/80 hover:text-white'
                }`}
              >
                Free Preview
              </button>
              <button
                type="button"
                onClick={() => onSetProPreview(true)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  isProPreview ? 'bg-[#C89B3C] text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                Pro Preview
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAuthenticated(false)}
              title="Lock Admin Session"
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#3E1F34] px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <Check className="h-4 w-4 text-[#E6B8A8]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Admin Navigation Pills */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {navItems.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'rose-gold-gradient text-white shadow-sm'
                    : 'border border-[#EBDAD4] bg-white text-[#523B49] hover:border-[#D49A89]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* SECTION 1: OVERVIEW KPI DASHBOARD */}
        {section === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <p className="text-xs font-medium text-[#7A6572]">Total Courses</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2D1B2E] tabular-nums">
                  {metrics.totalCourses}
                </p>
                <p className="mt-1 text-xs text-[#9C6555]">Zero-load YouTube architecture</p>
              </div>
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <p className="text-xs font-medium text-[#7A6572]">Total Video Lessons</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2D1B2E] tabular-nums">
                  {metrics.totalLessons}
                </p>
                <p className="mt-1 text-xs text-[#9C6555]">Embedded natively in-app</p>
              </div>
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <p className="text-xs font-medium text-[#7A6572]">Hairstyles &amp; Mehndi Shorts</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2D1B2E] tabular-nums">
                  {metrics.totalShorts}
                </p>
                <p className="mt-1 text-xs text-[#9C6555]">Instant modal YouTube player</p>
              </div>
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <p className="text-xs font-medium text-[#7A6572]">Interactive 3D Tools</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2D1B2E] tabular-nums">
                  {metrics.totalTools}
                </p>
                <p className="mt-1 text-xs text-[#9C6555]">Procedural Three.js WebGL models</p>
              </div>
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <p className="text-xs font-medium text-[#7A6572]">Free vs. Pro Content Ratio</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2D1B2E] tabular-nums">
                  {metrics.freeRatio}% / {metrics.proRatio}%
                </p>
                <p className="mt-1 text-xs text-[#9C6555]">Balanced funnel for Pro upgrades</p>
              </div>
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <p className="text-xs font-medium text-[#7A6572]">Active Ad Slots</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2D1B2E] tabular-nums">
                  {db.monetization.adsEnabled ? `${metrics.activeAdCount} Live` : 'Paused'}
                </p>
                <p className="mt-1 text-xs text-[#9C6555]">
                  Hidden automatically for Pro members
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E7CFC6] bg-white p-6">
              <h2 className="font-display text-xl font-bold text-[#2D1B2E]">Quick Studio Actions</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSection('courses')}
                  className="inline-flex items-center gap-2 rounded-xl rose-gold-gradient px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <Youtube className="h-4 w-4" />
                  <span>Import YouTube Lesson</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSection('shorts')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3E1F34] px-4 py-2.5 text-xs font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Hairstyle / Mehndi Short</span>
                </button>
                <button
                  type="button"
                  onClick={() => dataService.exportDatabaseJson(db)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DFC0B6] bg-[#FFF9F6] px-4 py-2.5 text-xs font-semibold text-[#2D1B2E] hover:bg-[#FAF0EC]"
                >
                  <Download className="h-4 w-4 text-[#B97664]" />
                  <span>Export glamcraft-data.json</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: COURSES & ONE-CLICK YOUTUBE LESSON IMPORTER */}
        {section === 'courses' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Course List + Create Course */}
            <div className="space-y-5 lg:col-span-5">
              <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                  Existing Courses ({db.courses.length})
                </h2>
                <div className="mt-3 space-y-2">
                  {db.courses.map((course) => {
                    const active = selectedCourse?.id === course.id;
                    return (
                      <div
                        key={course.id}
                        className={`flex items-center justify-between gap-2 rounded-xl border p-3 transition-colors ${
                          active
                            ? 'border-[#C58371] bg-[#FDF1EC]'
                            : 'border-[#F2E4DF] hover:bg-[#FFF9F6]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCourseId(course.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-semibold text-[#2D1B2E]">
                            {course.title}
                          </p>
                          <p className="text-xs text-[#7A6572]">
                            {course.level} · {course.subCategory} · {course.lessons.length} lessons
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id)}
                          aria-label={`Delete ${course.title}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9A7A82] hover:bg-white hover:text-[#B8434E]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Create New Course Form */}
              <form
                onSubmit={handleCreateCourse}
                className="rounded-2xl border border-[#F2E4DF] bg-white p-5 space-y-3"
              >
                <h3 className="font-display text-lg font-bold text-[#2D1B2E]">Create New Course</h3>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="e.g., Airbrush HD Bridal Mastery"
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#5A4451]">Skill Level</label>
                    <select
                      value={newCourseLevel}
                      onChange={(e) => setNewCourseLevel(e.target.value as SkillLevel)}
                      className="mt-1 w-full rounded-xl border border-[#EBDAD4] bg-white px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5A4451]">Sub-Category</label>
                    <input
                      type="text"
                      value={newCourseSubCategory}
                      onChange={(e) => setNewCourseSubCategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Instructor</label>
                  <input
                    type="text"
                    value={newCourseInstructor}
                    onChange={(e) => setNewCourseInstructor(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Face Shape Tags</label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ALL_FACE_SHAPES.map((shape) => {
                      const active = newCourseFaceShapes.includes(shape);
                      return (
                        <button
                          key={shape}
                          type="button"
                          onClick={() =>
                            setNewCourseFaceShapes((prev) =>
                              prev.includes(shape)
                                ? prev.filter((s) => s !== shape)
                                : [...prev, shape]
                            )
                          }
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            active
                              ? 'bg-[#3E1F34] text-white'
                              : 'border border-[#EBDAD4] text-[#6B5461]'
                          }`}
                        >
                          {shape}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Description</label>
                  <textarea
                    rows={2}
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    placeholder="Short overview of techniques covered..."
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#2D1B2E]">
                  <input
                    type="checkbox"
                    checked={newCoursePremium}
                    onChange={(e) => setNewCoursePremium(e.target.checked)}
                    className="accent-[#C58371]"
                  />
                  Mark course as PRO badge
                </label>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#3E1F34] py-2.5 text-xs font-semibold text-white hover:bg-[#542C47]"
                >
                  Create Course
                </button>
              </form>
            </div>

            {/* Right Column: Smart YouTube URL Lesson Importer & Playlist Editor */}
            <div className="space-y-5 lg:col-span-7">
              {selectedCourse ? (
                <>
                  <form
                    onSubmit={handleAddLesson}
                    className="rounded-2xl border border-[#DFB7AA] bg-white p-5 space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B97664]">
                          One-Click YouTube Link Importer
                        </p>
                        <h3 className="font-display text-lg font-bold text-[#2D1B2E]">
                          Add Lesson to “{selectedCourse.title}”
                        </h3>
                      </div>
                      <Youtube className="h-6 w-6 text-[#C58371]" />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5A4451]">
                        Paste YouTube URL (watch, youtu.be, or shorts)
                      </label>
                      <div className="relative mt-1">
                        <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9D828A]" />
                        <input
                          type="text"
                          required
                          value={lessonUrl}
                          onChange={(e) => setLessonUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                          className="w-full rounded-xl border border-[#EBDAD4] pl-9 pr-3 py-2.5 text-sm focus:border-[#C58371] focus:outline-none"
                        />
                      </div>
                      {lessonUrl && (
                        <p
                          className={`mt-1 text-xs font-medium ${
                            parsedLessonVideoId ? 'text-[#2D6A4F]' : 'text-[#B8434E]'
                          }`}
                        >
                          {parsedLessonVideoId
                            ? `Extracted Video ID: ${parsedLessonVideoId}`
                            : 'Could not extract a valid 11-character YouTube Video ID.'}
                        </p>
                      )}
                    </div>

                    {/* Auto-Fetched Thumbnail & Live Preview */}
                    {parsedLessonVideoId && (
                      <div className="rounded-xl border border-[#F2E4DF] bg-[#FFF9F6] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <YouTubeThumbnail
                              videoId={parsedLessonVideoId}
                              alt="YouTube preview"
                              compact
                              className="h-14 w-24 rounded-lg"
                            />
                            <div>
                              <p className="text-xs font-semibold text-[#2D1B2E]">
                                Auto-Fetched YouTube Thumbnail
                              </p>
                              <p className="text-[11px] text-[#7A6572]">
                                ID: {parsedLessonVideoId}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowLessonPreview((v) => !v)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E5CFC7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2D1B2E]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{showLessonPreview ? 'Hide Player' : 'Live Preview'}</span>
                          </button>
                        </div>
                        {showLessonPreview && (
                          <div className="mt-3">
                            <YouTubeEmbed
                              videoId={parsedLessonVideoId}
                              title="Lesson embed preview"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#5A4451]">Lesson Title</label>
                        <input
                          type="text"
                          required
                          value={lessonTitle}
                          onChange={(e) => setLessonTitle(e.target.value)}
                          placeholder="e.g., Dewy Bridal Highlighting"
                          className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#5A4451]">Duration</label>
                        <input
                          type="text"
                          value={lessonDuration}
                          onChange={(e) => setLessonDuration(e.target.value)}
                          placeholder="14:20"
                          className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5A4451]">
                        Products Used (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={lessonProducts}
                        onChange={(e) => setLessonProducts(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5A4451]">Written Artist Notes</label>
                      <textarea
                        rows={2}
                        value={lessonNotes}
                        onChange={(e) => setLessonNotes(e.target.value)}
                        placeholder="Key technique notes shown in the Notes tab..."
                        className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1B2E]">
                        <input
                          type="checkbox"
                          checked={lessonPremium}
                          onChange={(e) => setLessonPremium(e.target.checked)}
                          className="accent-[#C58371]"
                        />
                        Lock Lesson for PRO Members Only
                      </label>

                      <button
                        type="submit"
                        disabled={!parsedLessonVideoId || !lessonTitle.trim()}
                        className="rounded-xl rose-gold-gradient px-5 py-2.5 text-xs font-semibold text-white shadow-sm disabled:opacity-45"
                      >
                        Add Lesson to Course
                      </button>
                    </div>
                  </form>

                  {/* Lesson Reorder & Access List */}
                  <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5">
                    <h3 className="font-display text-lg font-bold text-[#2D1B2E]">
                      Course Lessons ({selectedCourse.lessons.length})
                    </h3>
                    {selectedCourse.lessons.length === 0 ? (
                      <p className="mt-3 text-sm text-[#7A6572]">
                        No lessons yet. Paste a YouTube link above to publish the first lesson!
                      </p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {selectedCourse.lessons.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 rounded-xl border border-[#F2E4DF] p-2.5"
                          >
                            <YouTubeThumbnail
                              videoId={lesson.youtubeVideoId}
                              alt={lesson.title}
                              compact
                              className="h-11 w-20 shrink-0 rounded-lg"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#2D1B2E]">
                                {idx + 1}. {lesson.title}
                              </p>
                              <p className="text-[11px] text-[#7A6572] tabular-nums">
                                ID: {lesson.youtubeVideoId} · {lesson.duration}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleLessonPro(selectedCourse.id, lesson.id)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                                lesson.isPremium
                                  ? 'bg-[#C89B3C] text-white'
                                  : 'bg-[#F5E6E1] text-[#2D1B2E]'
                              }`}
                            >
                              {lesson.isPremium ? 'PRO' : 'FREE'}
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveLesson(selectedCourse.id, idx, -1)}
                                disabled={idx === 0}
                                aria-label="Move lesson up"
                                className="rounded p-1.5 text-[#7A6572] hover:bg-[#FAF0EC] disabled:opacity-30"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveLesson(selectedCourse.id, idx, 1)}
                                disabled={idx === selectedCourse.lessons.length - 1}
                                aria-label="Move lesson down"
                                className="rounded p-1.5 text-[#7A6572] hover:bg-[#FAF0EC] disabled:opacity-30"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(selectedCourse.id, lesson.id)}
                                aria-label="Delete lesson"
                                className="rounded p-1.5 text-[#9A7A82] hover:text-[#B8434E]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-[#F2E4DF] bg-white p-8 text-center text-sm text-[#7A6572]">
                  Create or select a course on the left to add YouTube lessons.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: SHORTS MANAGER (HAIRSTYLES & MEHNDI) */}
        {section === 'shorts' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <form
              onSubmit={handleAddShort}
              className="rounded-2xl border border-[#DFB7AA] bg-white p-5 space-y-3.5 lg:col-span-5"
            >
              <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                Quick-Add Hairstyle / Mehndi Short
              </h2>
              <div>
                <label className="text-xs font-semibold text-[#5A4451]">
                  YouTube Short or Video URL
                </label>
                <input
                  type="text"
                  required
                  value={shortUrl}
                  onChange={(e) => setShortUrl(e.target.value)}
                  placeholder="https://youtube.com/shorts/..."
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2.5 text-sm focus:border-[#C58371] focus:outline-none"
                />
                {shortUrl && (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      parsedShortVideoId ? 'text-[#2D6A4F]' : 'text-[#B8434E]'
                    }`}
                  >
                    {parsedShortVideoId
                      ? `Extracted Video ID: ${parsedShortVideoId}`
                      : 'Invalid YouTube link'}
                  </p>
                )}
              </div>

              {parsedShortVideoId && (
                <div className="rounded-xl border border-[#F2E4DF] bg-[#FFF9F6] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <YouTubeThumbnail
                      videoId={parsedShortVideoId}
                      alt="Short preview"
                      compact
                      className="h-14 w-24 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowShortPreview((v) => !v)}
                      className="rounded-lg border border-[#E5CFC7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2D1B2E]"
                    >
                      {showShortPreview ? 'Hide Player' : 'Test Embed'}
                    </button>
                  </div>
                  {showShortPreview && (
                    <div className="mt-3">
                      <YouTubeEmbed videoId={parsedShortVideoId} title="Short embed preview" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">Title</label>
                <input
                  type="text"
                  required
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="e.g., Gulf Bridal Mehndi Palm Pattern"
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Category</label>
                  <select
                    value={shortCategory}
                    onChange={(e) => setShortCategory(e.target.value as 'Hairstyles' | 'Mehndi')}
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] bg-white px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  >
                    <option value="Hairstyles">Hairstyles</option>
                    <option value="Mehndi">Mehndi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Sub-Category</label>
                  <input
                    type="text"
                    value={shortSubCategory}
                    onChange={(e) => setShortSubCategory(e.target.value)}
                    placeholder="Bridal Braids / Arabic"
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Duration</label>
                  <input
                    type="text"
                    value={shortDuration}
                    onChange={(e) => setShortDuration(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Views Label</label>
                  <input
                    type="text"
                    value={shortViews}
                    onChange={(e) => setShortViews(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1B2E]">
                <input
                  type="checkbox"
                  checked={shortPremium}
                  onChange={(e) => setShortPremium(e.target.checked)}
                  className="accent-[#C58371]"
                />
                PRO Exclusive Short
              </label>

              <button
                type="submit"
                disabled={!parsedShortVideoId || !shortTitle.trim()}
                className="w-full rounded-xl rose-gold-gradient py-3 text-xs font-semibold text-white shadow-sm disabled:opacity-45"
              >
                Publish Immediately to Live Feed
              </button>
            </form>

            <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5 lg:col-span-7">
              <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                Published Shorts ({db.shorts.length})
              </h2>
              <div className="mt-3 space-y-2.5">
                {db.shorts.map((short) => (
                  <div
                    key={short.id}
                    className="flex items-center gap-3 rounded-xl border border-[#F2E4DF] p-2.5"
                  >
                    <YouTubeThumbnail
                      videoId={short.youtubeVideoId}
                      alt={short.title}
                      category={short.category}
                      compact
                      className="h-12 w-20 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#2D1B2E]">{short.title}</p>
                      <p className="text-xs text-[#7A6572]">
                        {short.category} · {short.subCategory} · {short.duration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleShortPro(short.id)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                        short.isPremium
                          ? 'bg-[#C89B3C] text-white'
                          : 'bg-[#F5E6E1] text-[#2D1B2E]'
                      }`}
                    >
                      {short.isPremium ? 'PRO' : 'FREE'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteShort(short.id)}
                      aria-label={`Delete ${short.title}`}
                      className="rounded p-1.5 text-[#9A7A82] hover:text-[#B8434E]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: 3D TOOLS LAB MANAGER */}
        {section === 'tools' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <form
              onSubmit={handleSaveTool}
              className="rounded-2xl border border-[#DFB7AA] bg-white p-5 space-y-3 lg:col-span-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                  {editingToolId ? 'Edit 3D Tool Entry' : 'Add New 3D Tool Entry'}
                </h2>
                {editingToolId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingToolId(null);
                      setToolName('');
                      setToolShortName('');
                      setToolBestFor('');
                      setToolUsageTip('');
                      setToolDemoUrl('');
                    }}
                    className="text-xs font-semibold text-[#B97664]"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Full Tool Name</label>
                  <input
                    type="text"
                    required
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="Angled Contour Brush"
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Carousel Label</label>
                  <input
                    type="text"
                    value={toolShortName}
                    onChange={(e) => setToolShortName(e.target.value)}
                    placeholder="Contour Brush"
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">3D Procedural Preset Model</label>
                <select
                  value={toolPreset}
                  onChange={(e) => setToolPreset(e.target.value as ToolModelPreset)}
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] bg-white px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                >
                  {TOOL_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">“Best For” Headline</label>
                <input
                  type="text"
                  required
                  value={toolBestFor}
                  onChange={(e) => setToolBestFor(e.target.value)}
                  placeholder="Cheekbone Contouring & Bronzing"
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">Usage Description</label>
                <textarea
                  rows={2}
                  value={toolUsageTip}
                  onChange={(e) => setToolUsageTip(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">
                  Linked 1-Min YouTube Demo URL
                </label>
                <input
                  type="text"
                  value={toolDemoUrl}
                  onChange={(e) => setToolDemoUrl(e.target.value)}
                  placeholder="https://youtu.be/..."
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">
                  Callout Hotspots (one per line: Label | Material Detail | Care Tip)
                </label>
                <textarea
                  rows={4}
                  value={toolHotspotsText}
                  onChange={(e) => setToolHotspotsText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 font-mono text-xs focus:border-[#C58371] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl rose-gold-gradient py-2.5 text-xs font-semibold text-white"
              >
                {editingToolId ? 'Save 3D Tool Changes' : 'Add Tool to 3D Lab'}
              </button>
            </form>

            <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5 lg:col-span-6">
              <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                3D Lab Tools ({db.tools3D.length})
              </h2>
              <div className="mt-3 space-y-2.5">
                {db.tools3D.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#F2E4DF] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#2D1B2E]">{tool.name}</p>
                      <p className="truncate text-xs text-[#7A6572]">
                        {tool.bestFor} · {tool.hotspots.length} pins
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditToolStart(tool)}
                        className="rounded-lg border border-[#EBDAD4] px-3 py-1 text-xs font-semibold text-[#2D1B2E] hover:bg-[#FAF0EC]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTool(tool.id)}
                        className="rounded p-1.5 text-[#9A7A82] hover:text-[#B8434E]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: MONETIZATION, SUBSCRIPTION & AD-TAG MANAGER */}
        {section === 'monetization' && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Ad-Tag Controls */}
            <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                    In-App Ad-Tag &amp; Promo Banners
                  </h2>
                  <p className="text-xs text-[#7A6572]">
                    Configure AdSense slot IDs or luxury affiliate banner text.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateDb({
                      ...db,
                      monetization: {
                        ...db.monetization,
                        adsEnabled: !db.monetization.adsEnabled,
                      },
                    });
                    flashToast(
                      !db.monetization.adsEnabled ? 'Ads enabled for Free users' : 'All ads paused'
                    );
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                    db.monetization.adsEnabled
                      ? 'bg-[#3E1F34] text-white'
                      : 'bg-[#F2E4DF] text-[#7A6572]'
                  }`}
                >
                  {db.monetization.adsEnabled ? 'Ads ON' : 'Ads OFF'}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">
                    1. Home Feed Ad Banner Text
                  </label>
                  <input
                    type="text"
                    value={db.monetization.homeBannerText}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, homeBannerText: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={db.monetization.homeAdsenseSlotId}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, homeAdsenseSlotId: e.target.value },
                      })
                    }
                    placeholder="AdSense Slot ID (e.g. ca-pub-...)"
                    className="mt-1.5 w-full rounded-xl border border-[#EFE0DB] bg-[#FFFDFB] px-3 py-1.5 font-mono text-xs focus:border-[#C58371] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">
                    2. Course Player Ad Banner Text
                  </label>
                  <input
                    type="text"
                    value={db.monetization.playerBannerText}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, playerBannerText: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={db.monetization.playerAdsenseSlotId}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, playerAdsenseSlotId: e.target.value },
                      })
                    }
                    placeholder="Course Player AdSense Slot ID"
                    className="mt-1.5 w-full rounded-xl border border-[#EFE0DB] bg-[#FFFDFB] px-3 py-1.5 font-mono text-xs focus:border-[#C58371] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">
                    3. Shorts Feed Ad Slot Text
                  </label>
                  <input
                    type="text"
                    value={db.monetization.shortsBannerText}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, shortsBannerText: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={db.monetization.shortsAdsenseSlotId}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, shortsAdsenseSlotId: e.target.value },
                      })
                    }
                    placeholder="Shorts Feed AdSense Slot ID"
                    className="mt-1.5 w-full rounded-xl border border-[#EFE0DB] bg-[#FFFDFB] px-3 py-1.5 font-mono text-xs focus:border-[#C58371] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Premium Subscription Manager */}
            <div className="rounded-2xl border border-[#F2E4DF] bg-white p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#C89B3C]" />
                <h2 className="font-display text-lg font-bold text-[#2D1B2E]">
                  Premium Subscription Pricing &amp; Preview
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Monthly Pro Price</label>
                  <input
                    type="text"
                    value={db.monetization.monthlyPrice}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, monthlyPrice: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm font-semibold focus:border-[#C58371] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5A4451]">Yearly Pro Price</label>
                  <input
                    type="text"
                    value={db.monetization.yearlyPrice}
                    onChange={(e) =>
                      onUpdateDb({
                        ...db,
                        monetization: { ...db.monetization, yearlyPrice: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm font-semibold focus:border-[#C58371] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4451]">
                  Pro Membership Benefits (one bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={db.monetization.proBenefits.join('\n')}
                  onChange={(e) =>
                    onUpdateDb({
                      ...db,
                      monetization: {
                        ...db.monetization,
                        proBenefits: e.target.value
                          .split('\n')
                          .map((b) => b.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#EBDAD4] px-3 py-2 text-sm focus:border-[#C58371] focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-[#E7CFC6] bg-[#FDF4F0] p-4">
                <p className="text-xs font-bold text-[#2D1B2E]">Instant User Access Simulator</p>
                <p className="mt-1 text-xs text-[#6B5461]">
                  Toggle between Free and Pro mode to test locked lessons and ad-free playback across the live app.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSetProPreview(false);
                      flashToast('Switched app to Free User Preview');
                    }}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                      !isProPreview
                        ? 'bg-[#3E1F34] text-white'
                        : 'border border-[#E2C9C0] bg-white text-[#2D1B2E]'
                    }`}
                  >
                    Preview as Free User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSetProPreview(true);
                      flashToast('Switched app to Pro User Preview');
                    }}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
                      isProPreview
                        ? 'bg-[#C89B3C] text-white'
                        : 'border border-[#E2C9C0] bg-white text-[#2D1B2E]'
                    }`}
                  >
                    Preview as Pro User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: ZERO-BACKEND DATABASE EXPORT / IMPORT / RESET */}
        {section === 'database' && (
          <div className="mt-6 max-w-3xl space-y-5">
            <div className="rounded-2xl border border-[#F2E4DF] bg-white p-6">
              <h2 className="font-display text-xl font-bold text-[#2D1B2E]">
                GitHub Pages &amp; Firebase-Ready JSON Database
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#6B5461]">
                Every change you make in the Admin Panel updates the live app immediately and persists in local storage. Export your database as a lightweight JSON file to commit directly to GitHub Pages, or import a saved backup anytime.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    dataService.exportDatabaseJson(db);
                    flashToast('Downloaded glamcraft-data.json');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl rose-gold-gradient px-5 py-3 text-xs font-semibold text-white shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Export JSON Database</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3E1F34] px-5 py-3 text-xs font-semibold text-white"
                >
                  <Upload className="h-4 w-4" />
                  <span>Import JSON File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportJsonFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => {
                    const reset = dataService.resetDatabase();
                    onUpdateDb(reset);
                    flashToast('Restored default luxury demo dataset');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DFC0B6] bg-white px-5 py-3 text-xs font-semibold text-[#7A444F] hover:bg-[#FAF0EC]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#F2E4DF] bg-[#2D1B2E] p-5 text-[#F6E4DE]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E6B8A8]">
                Live JSON Snapshot Preview
              </p>
              <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-black/25 p-3.5 font-mono text-[11px] leading-relaxed">
                {JSON.stringify(db, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
