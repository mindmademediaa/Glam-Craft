import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Box,
  Crown,
  Film,
  Home,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { CoursePlayerView } from './components/CoursePlayerView';
import { CoursesCatalog } from './components/CoursesCatalog';
import { FaceShapeAndShortsView } from './components/FaceShapeAndShortsView';
import { HomeDashboard } from './components/HomeDashboard';
import { GlamCraftWordmark } from './components/Icons';
import { PremiumModal } from './components/PremiumModal';
import { ProfileView } from './components/ProfileView';
import { Tools3DLabView } from './components/Tools3DLabView';
import { YouTubePlayerModal } from './components/YouTubeMedia';
import { dataService } from './services/dataService';
import {
  AcademyDatabase,
  AppTab,
  ShortVideo,
  SkillLevel,
  UserProgress,
} from './types/academy';

export default function App() {
  const [db, setDb] = useState<AcademyDatabase>(() => dataService.loadDatabase());
  const [progress, setProgress] = useState<UserProgress>(() => dataService.loadUserProgress());

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseLevelFilter, setCourseLevelFilter] = useState<SkillLevel | 'All'>('All');
  const [shortsPresetCategory, setShortsPresetCategory] = useState<'All' | 'Hairstyles' | 'Mehndi'>('All');
  const [shortsFocusSection, setShortsFocusSection] = useState<'face' | 'shorts'>('face');
  const [searchQuery, setSearchQuery] = useState('');

  const [adminOpen, setAdminOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [quickShortModal, setQuickShortModal] = useState<ShortVideo | null>(null);

  useEffect(() => {
    dataService.saveDatabase(db);
  }, [db]);

  useEffect(() => {
    dataService.saveUserProgress(progress);
  }, [progress]);

  const activeCourse = selectedCourseId
    ? db.courses.find((c) => c.id === selectedCourseId) ?? null
    : null;

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: AppTab) => {
    setSelectedCourseId(null);
    setActiveTab(tab);
    if (tab === 'shorts') {
      setShortsPresetCategory('All');
      setShortsFocusSection('face');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategory = (
    category: 'makeup' | 'lab3d' | 'faceTypes' | 'hairstyles' | 'mehndi'
  ) => {
    setSelectedCourseId(null);
    if (category === 'makeup') {
      setCourseLevelFilter('All');
      setActiveTab('courses');
    } else if (category === 'lab3d') {
      setActiveTab('lab3d');
    } else if (category === 'faceTypes') {
      setShortsPresetCategory('All');
      setShortsFocusSection('face');
      setActiveTab('shorts');
    } else if (category === 'hairstyles') {
      setShortsPresetCategory('Hairstyles');
      setShortsFocusSection('shorts');
      setActiveTab('shorts');
    } else if (category === 'mehndi') {
      setShortsPresetCategory('Mehndi');
      setShortsFocusSection('shorts');
      setActiveTab('shorts');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLevelFromHero = (level: SkillLevel) => {
    setCourseLevelFilter(level);
    setSelectedCourseId(null);
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmarkCourse = (courseId: string) => {
    setProgress((prev) => ({
      ...prev,
      bookmarkedCourseIds: prev.bookmarkedCourseIds.includes(courseId)
        ? prev.bookmarkedCourseIds.filter((id) => id !== courseId)
        : [...prev.bookmarkedCourseIds, courseId],
    }));
  };

  const handleToggleBookmarkTool = (toolId: string) => {
    setProgress((prev) => ({
      ...prev,
      bookmarkedToolIds: prev.bookmarkedToolIds.includes(toolId)
        ? prev.bookmarkedToolIds.filter((id) => id !== toolId)
        : [...prev.bookmarkedToolIds, toolId],
    }));
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedLessonIds: prev.completedLessonIds.includes(lessonId)
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId],
    }));
  };

  const handleToggleProductCheck = (lessonId: string, product: string) => {
    setProgress((prev) => {
      const current = prev.checkedProducts[lessonId] ?? [];
      const next = current.includes(product)
        ? current.filter((p) => p !== product)
        : [...current, product];
      return {
        ...prev,
        checkedProducts: { ...prev.checkedProducts, [lessonId]: next },
      };
    });
  };

  const handleSavePersonalNote = (lessonId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      personalNotes: { ...prev.personalNotes, [lessonId]: note },
    }));
  };

  const handleSetProMode = (isPro: boolean) => {
    setProgress((prev) => ({ ...prev, isProUser: isPro }));
  };

  if (adminOpen) {
    return (
      <AdminPanel
        db={db}
        isProPreview={progress.isProUser}
        onUpdateDb={setDb}
        onSetProPreview={handleSetProMode}
        onExit={() => setAdminOpen(false)}
      />
    );
  }

  const navItems: Array<{ id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'lab3d', label: '3D Lab', icon: Box },
    { id: 'shorts', label: 'Shorts', icon: Film },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#2D1B2E] lg:flex">
      {/* Sleek Left Desktop Sidebar (adapts mobile bottom nav on lg+) */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-[#F0E1DC] lg:bg-white lg:sticky lg:top-0 lg:h-screen">
        <div className="px-6 pt-7 pb-6">
          <button type="button" onClick={() => handleSelectTab('home')} className="text-left">
            <GlamCraftWordmark compact />
          </button>
          <p className="mt-1 text-xs text-[#8D7580]">Luxury Beautician Academy</p>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = !activeCourse && activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#3E1F34] text-white shadow-sm'
                    : 'text-[#5A4451] hover:bg-[#FAF0EC] hover:text-[#2D1B2E]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2.5 border-t border-[#F2E4DF]">
          {!progress.isProUser ? (
            <button
              type="button"
              onClick={() => setUpgradeModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl rose-gold-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-95"
            >
              <Crown className="h-4 w-4" />
              <span>Unlock Pro Studio</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FDF4EC] px-3 py-2 text-xs font-semibold text-[#9A6F22] border border-[#EED9B1]">
              <Crown className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span>Pro Member Active</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBDAD4] bg-[#FFFDFB] px-4 py-2.5 text-xs font-semibold text-[#3E1F34] hover:border-[#D49A89] hover:bg-[#FAF0EC]"
          >
            <ShieldCheck className="h-4 w-4 text-[#B97664]" />
            <span>Admin CMS Panel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="min-w-0 flex-1">
        {activeCourse ? (
          <CoursePlayerView
            course={activeCourse}
            monetization={db.monetization}
            progress={progress}
            onBack={() => setSelectedCourseId(null)}
            onToggleBookmarkCourse={handleToggleBookmarkCourse}
            onToggleLessonComplete={handleToggleLessonComplete}
            onToggleProductCheck={handleToggleProductCheck}
            onSavePersonalNote={handleSavePersonalNote}
            onOpenUpgrade={() => setUpgradeModalOpen(true)}
          />
        ) : activeTab === 'home' ? (
          <HomeDashboard
            courses={db.courses}
            shorts={db.shorts}
            tools3D={db.tools3D}
            monetization={db.monetization}
            progress={progress}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectLevel={handleSelectLevelFromHero}
            onOpenCourse={handleOpenCourse}
            onOpenCategory={handleOpenCategory}
            onOpenShort={(short) => {
              if (short.isPremium && !progress.isProUser) {
                setUpgradeModalOpen(true);
              } else {
                setQuickShortModal(short);
              }
            }}
            onOpenProfile={() => handleSelectTab('profile')}
            onOpenAdmin={() => setAdminOpen(true)}
            onOpenUpgrade={() => setUpgradeModalOpen(true)}
          />
        ) : activeTab === 'courses' ? (
          <CoursesCatalog
            courses={db.courses}
            progress={progress}
            selectedLevel={courseLevelFilter}
            onSelectLevel={setCourseLevelFilter}
            onOpenCourse={handleOpenCourse}
          />
        ) : activeTab === 'lab3d' ? (
          <Tools3DLabView
            tools={db.tools3D}
            bookmarkedToolIds={progress.bookmarkedToolIds}
            onToggleBookmarkTool={handleToggleBookmarkTool}
            onBack={() => handleSelectTab('home')}
          />
        ) : activeTab === 'shorts' ? (
          <FaceShapeAndShortsView
            key={`${shortsPresetCategory}-${shortsFocusSection}`}
            courses={db.courses}
            shorts={db.shorts}
            monetization={db.monetization}
            progress={progress}
            initialShortCategory={shortsPresetCategory}
            focusSection={shortsFocusSection}
            onBack={() => handleSelectTab('home')}
            onOpenProfile={() => handleSelectTab('profile')}
            onOpenCourse={handleOpenCourse}
            onOpenUpgrade={() => setUpgradeModalOpen(true)}
          />
        ) : (
          <ProfileView
            courses={db.courses}
            tools3D={db.tools3D}
            progress={progress}
            onOpenCourse={handleOpenCourse}
            onOpen3DLab={() => handleSelectTab('lab3d')}
            onOpenAdmin={() => setAdminOpen(true)}
            onOpenUpgrade={() => setUpgradeModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Mobile Bottom Navigation Bar matching Screenshot 4 */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#EBDAD4] bg-[#FFF9F6]/95 backdrop-blur-md lg:hidden pb-safe"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = !activeCourse && activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 py-2 transition-colors ${
                  active ? 'text-[#3E1F34]' : 'text-[#7A6572] hover:text-[#2D1B2E]'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? 'stroke-[2.3] text-[#3E1F34]' : 'stroke-[1.75]'
                  }`}
                />
                <span
                  className={`text-[11px] leading-none ${
                    active ? 'font-bold text-[#3E1F34]' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick Short Modal (when launched from Home Search) */}
      {quickShortModal && (
        <YouTubePlayerModal
          videoId={quickShortModal.youtubeVideoId}
          title={quickShortModal.title}
          subtitle={`${quickShortModal.category} · ${quickShortModal.subCategory}`}
          onClose={() => setQuickShortModal(null)}
        />
      )}

      {/* Pro Subscription Upgrade Modal */}
      {upgradeModalOpen && (
        <PremiumModal
          monetization={db.monetization}
          isProUser={progress.isProUser}
          onActivatePro={() => handleSetProMode(true)}
          onDeactivatePro={() => handleSetProMode(false)}
          onClose={() => setUpgradeModalOpen(false)}
        />
      )}
    </div>
  );
}
