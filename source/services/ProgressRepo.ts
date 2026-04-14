import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type {UserProgress, AppSettings} from '../data/types.js';

const DATA_DIR = path.join(os.homedir(), '.ts-tui-tutorial');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

export function ensureDataDir(): void {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, {recursive: true});
	}
}

export function loadProgress(): UserProgress | null {
	ensureDataDir();
	if (!fs.existsSync(PROGRESS_FILE)) return null;
	try {
		const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
		return JSON.parse(raw) as UserProgress;
	} catch {
		return null;
	}
}

export function saveProgress(progress: UserProgress): void {
	ensureDataDir();
	fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

export function loadSettings(): AppSettings {
	ensureDataDir();
	if (!fs.existsSync(CONFIG_FILE)) {
		return defaultSettings();
	}

	try {
		const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
		return {...defaultSettings(), ...(JSON.parse(raw) as AppSettings)};
	} catch {
		return defaultSettings();
	}
}

export function saveSettings(settings: AppSettings): void {
	ensureDataDir();
	fs.writeFileSync(CONFIG_FILE, JSON.stringify(settings, null, 2));
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
		version: 1,
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
