import { INITIAL_ACADEMY_DATA } from '../data/seedData';
import { AcademyDatabase, UserProgress } from '../types/academy';

const DB_STORAGE_KEY = 'glamcraft_academy_db_v1';
const PROGRESS_STORAGE_KEY = 'glamcraft_academy_progress_v1';

export const DEFAULT_USER_PROGRESS: UserProgress = {
  completedLessonIds: ['l_bridal_01', 'l_bridal_02', 'l_every_01', 'l_every_02'],
  bookmarkedCourseIds: ['course_bridal_01'],
  bookmarkedToolIds: ['tool_contour_brush'],
  personalNotes: {
    l_bridal_03: 'Remember to blend cream contour upward toward the upper ear with light stippling.',
  },
  checkedProducts: {
    l_bridal_03: ['Angled Contour Brush', 'Warm Cream Bronzer'],
  },
  isProUser: false,
};

/**
 * Modular Data Persistence Service
 * Currently backed by localStorage + JSON Export/Import for zero-backend GitHub Pages hosting.
 * All public methods are structured cleanly so swapping in Firebase Firestore requires changing only this file.
 */
export const dataService = {
  loadDatabase(): AcademyDatabase {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (!raw) return structuredClone(INITIAL_ACADEMY_DATA);
      const parsed = JSON.parse(raw) as Partial<AcademyDatabase>;
      if (!parsed || !Array.isArray(parsed.courses) || !Array.isArray(parsed.shorts) || !Array.isArray(parsed.tools3D)) {
        return structuredClone(INITIAL_ACADEMY_DATA);
      }
      return {
        courses: parsed.courses,
        shorts: parsed.shorts,
        tools3D: parsed.tools3D,
        monetization: {
          ...INITIAL_ACADEMY_DATA.monetization,
          ...(parsed.monetization ?? {}),
        },
      };
    } catch {
      return structuredClone(INITIAL_ACADEMY_DATA);
    }
  },

  saveDatabase(db: AcademyDatabase): void {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch {
      // Storage quota exceeded or unavailable; in-memory state remains authoritative
    }
  },

  resetDatabase(): AcademyDatabase {
    const fresh = structuredClone(INITIAL_ACADEMY_DATA);
    this.saveDatabase(fresh);
    return fresh;
  },

  exportDatabaseJson(db: AcademyDatabase): void {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'glamcraft-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  validateImportedDatabase(jsonText: string): { ok: true; data: AcademyDatabase } | { ok: false; error: string } {
    try {
      const parsed = JSON.parse(jsonText) as Partial<AcademyDatabase>;
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: 'JSON root must be an object.' };
      }
      if (!Array.isArray(parsed.courses) || !Array.isArray(parsed.shorts) || !Array.isArray(parsed.tools3D)) {
        return { ok: false, error: 'JSON must contain courses, shorts, and tools3D arrays.' };
      }
      return {
        ok: true,
        data: {
          courses: parsed.courses,
          shorts: parsed.shorts,
          tools3D: parsed.tools3D,
          monetization: {
            ...INITIAL_ACADEMY_DATA.monetization,
            ...(parsed.monetization ?? {}),
          },
        },
      };
    } catch {
      return { ok: false, error: 'Invalid JSON syntax. Please upload a valid glamcraft-data.json file.' };
    }
  },

  loadUserProgress(): UserProgress {
    try {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_USER_PROGRESS);
      const parsed = JSON.parse(raw) as Partial<UserProgress>;
      return {
        ...DEFAULT_USER_PROGRESS,
        ...parsed,
      };
    } catch {
      return structuredClone(DEFAULT_USER_PROGRESS);
    }
  },

  saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage failures
    }
  },
};
