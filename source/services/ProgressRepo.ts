import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {z} from 'zod';
import type {UserProgress, AppSettings} from '../data/types.js';

const DATA_DIR = path.join(os.homedir(), '.ts-tui-tutorial');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// ========================================
// Zod Schemas for Runtime Validation
// ========================================

const StepResultSchema = z.object({
	stepIndex: z.number().nonnegative(),
	isCorrect: z.boolean(),
	attempts: z.number().nonnegative(),
	hintsUsed: z.number().nonnegative(),
});

const LessonCompletionSchema = z.object({
	lessonId: z.string(),
	completedAt: z.string(),
	score: z.number().nonnegative().max(100),
	attempts: z.number().nonnegative(),
	hintsUsed: z.number().nonnegative(),
	stepResults: z.array(StepResultSchema),
});

const UserProgressSchema = z.object({
	version: z.number().nonnegative(),
	lastAccessedAt: z.string(),
	currentLessonId: z.string(),
	currentStepIndex: z.number().nonnegative(),
	completedLessons: z.record(z.string(), LessonCompletionSchema),
	globalStats: z.object({
		totalXp: z.number().nonnegative(),
		streakDays: z.number().nonnegative(),
		lastStudyDate: z.string(),
	}),
});

const AppSettingsSchema = z.object({
	theme: z.enum(['default', 'dark', 'high-contrast']),
	showHintsByDefault: z.boolean(),
});

// ========================================
// File System Helpers
// ========================================

export function ensureDataDir(): void {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, {recursive: true});
	}
}

function writeFileAtomic(filePath: string, data: string): void {
	const tmpPath = `${filePath}.tmp`;
	fs.writeFileSync(tmpPath, data, 'utf-8');
	fs.renameSync(tmpPath, filePath);
}

// ========================================
// Migration
// ========================================

const CURRENT_PROGRESS_VERSION = 1;

function migrateProgress(data: unknown): UserProgress | null {
	if (typeof data !== 'object' || data === null) return null;

	const version = (data as {version?: number}).version ?? 0;
	if (version > CURRENT_PROGRESS_VERSION) {
		// Future version we don't understand yet
		return null;
	}

		if (version === CURRENT_PROGRESS_VERSION) {
			const result = UserProgressSchema.safeParse(data);
			return result.success ? result.data : null;
		}

		// Version 0 -> 1 migration placeholder
		// Add future migrations here
		return null;
}

// ========================================
// Progress API
// ========================================

export function loadProgress(): UserProgress | null {
	ensureDataDir();
	if (!fs.existsSync(PROGRESS_FILE)) return null;
	try {
		const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
		const parsed = JSON.parse(raw);
		const migrated = migrateProgress(parsed);
		if (!migrated) return null;
		const result = UserProgressSchema.safeParse(migrated);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}

export function saveProgress(progress: UserProgress): void {
	try {
		ensureDataDir();
		const validated = UserProgressSchema.parse(progress);
		writeFileAtomic(PROGRESS_FILE, JSON.stringify(validated, null, 2));
	} catch {
		// Fail silently to avoid crashing the TUI
	}
}

// ========================================
// Settings API
// ========================================

export function loadSettings(): AppSettings {
	ensureDataDir();
	if (!fs.existsSync(CONFIG_FILE)) {
		return defaultSettings();
	}

	try {
		const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
		const parsed = JSON.parse(raw);
		const result = AppSettingsSchema.safeParse(parsed);
		return result.success ? result.data : defaultSettings();
	} catch {
		return defaultSettings();
	}
}

export function saveSettings(settings: AppSettings): void {
	try {
		ensureDataDir();
		const validated = AppSettingsSchema.parse(settings);
		writeFileAtomic(CONFIG_FILE, JSON.stringify(validated, null, 2));
	} catch {
		// Fail silently to avoid crashing the TUI
	}
}

export function defaultSettings(): AppSettings {
	return {
		theme: 'default',
		showHintsByDefault: false,
	};
}

export function createDefaultProgress(lessons: {id: string}[]): UserProgress {
	const now = new Date().toISOString();
	return {
		version: CURRENT_PROGRESS_VERSION,
		lastAccessedAt: now,
		currentLessonId: lessons[0]?.id ?? '',
		currentStepIndex: 0,
		completedLessons: {},
		globalStats: {
			totalXp: 0,
			streakDays: 0,
			lastStudyDate: now,
		},
	};
}
