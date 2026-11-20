export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Long';

export type ContentCategory = 'Makeup' | 'Hairstyles' | 'Mehndi';

export type MakeupSubCategory =
  | 'Bridal Makeup'
  | 'Party & Evening Glam'
  | 'Everyday / No-Makeup'
  | 'Dewy vs. Matte Base'
  | 'Eye Makeup Mastery'
  | 'Skin Prep & Color Correction';

export type ToolModelPreset =
  | 'contour_brush'
  | 'beauty_blender'
  | 'foundation_brush'
  | 'eyelash_curler'
  | 'eyeshadow_brush';

export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
  duration: string;
  isPremium: boolean;
  productsUsed: string[];
  notes: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: ContentCategory;
  subCategory: string;
  level: SkillLevel;
  faceShapes: FaceShape[];
  rating: number;
  isPremium: boolean;
  description: string;
  lessons: Lesson[];
}

export interface ShortVideo {
  id: string;
  title: string;
  category: 'Hairstyles' | 'Mehndi';
  subCategory: string;
  youtubeVideoId: string;
  duration: string;
  viewsLabel: string;
  isPremium: boolean;
}

export interface ToolHotspot {
  id: string;
  label: string;
  detail: string;
  careTip: string;
  anchor: [number, number, number];
  side: 'left' | 'right';
}

export interface Tool3D {
  id: string;
  name: string;
  shortName: string;
  modelPreset: ToolModelPreset;
  bestFor: string;
  usageTip: string;
  demoYoutubeId: string;
  hotspots: ToolHotspot[];
}

export interface MonetizationConfig {
  adsEnabled: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
  proBenefits: string[];
  homeBannerText: string;
  homeBannerLink: string;
  homeAdsenseSlotId: string;
  playerBannerText: string;
  playerBannerLink: string;
  playerAdsenseSlotId: string;
  shortsBannerText: string;
  shortsBannerLink: string;
  shortsAdsenseSlotId: string;
  customAdHtml: string;
}

export interface AcademyDatabase {
  courses: Course[];
  shorts: ShortVideo[];
  tools3D: Tool3D[];
  monetization: MonetizationConfig;
}

export interface UserProgress {
  completedLessonIds: string[];
  bookmarkedCourseIds: string[];
  bookmarkedToolIds: string[];
  personalNotes: Record<string, string>;
  checkedProducts: Record<string, string[]>;
  isProUser: boolean;
}

export type AppTab = 'home' | 'courses' | 'lab3d' | 'shorts' | 'profile';
