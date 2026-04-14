import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

vi.mock('node:os', async () => {
	const actual = await vi.importActual('node:os') as typeof import('node:os');
	const tmpDir = path.join(actual.default.tmpdir(), `ts-tui-tutorial-test-${Date.now()}`);
	return {
		default: {
			...actual.default,
			homedir: () => tmpDir,
		},
	};
});

// Import after mocking os
const {
	loadProgress,
	saveProgress,
	loadSettings,
	saveSettings,
	defaultSettings,
	createDefaultProgress,
	ensureDataDir,
} = await import('../../source/services/ProgressRepo.js');

const dataDir = () => path.join(os.homedir(), '.ts-tui-tutorial');

describe('ProgressRepo', () => {
	beforeEach(() => {
		if (fs.existsSync(dataDir())) {
			fs.rmSync(dataDir(), {recursive: true});
		}
	});

	afterEach(() => {
		if (fs.existsSync(dataDir())) {
			fs.rmSync(dataDir(), {recursive: true});
		}
	});

	describe('ensureDataDir', () => {
		it('creates the data directory', () => {
			ensureDataDir();
			expect(fs.existsSync(dataDir())).toBe(true);
		});
	});

	describe('loadProgress / saveProgress', () => {
		it('returns null when no progress file exists', () => {
			expect(loadProgress()).toBeNull();
		});

		it('saves and loads valid progress', () => {
			const progress = createDefaultProgress([{id: 'l1'}]);
			saveProgress(progress);
			const loaded = loadProgress();
			expect(loaded).toEqual(progress);
		});

		it('returns null for corrupted JSON', () => {
			ensureDataDir();
			const progressFile = path.join(dataDir(), 'progress.json');
			fs.writeFileSync(progressFile, 'not-json', 'utf-8');
			expect(loadProgress()).toBeNull();
		});

		it('returns null for invalid schema', () => {
			ensureDataDir();
			const progressFile = path.join(dataDir(), 'progress.json');
			fs.writeFileSync(progressFile, JSON.stringify({version: 1, invalid: true}), 'utf-8');
			expect(loadProgress()).toBeNull();
		});
	});

	describe('loadSettings / saveSettings', () => {
		it('returns default settings when no config file exists', () => {
			expect(loadSettings()).toEqual(defaultSettings());
		});

		it('saves and loads valid settings', () => {
			const settings = {theme: 'dark' as const, showHintsByDefault: true};
			saveSettings(settings);
			expect(loadSettings()).toEqual(settings);
		});

		it('falls back to defaults for corrupted config', () => {
			ensureDataDir();
			const configFile = path.join(dataDir(), 'config.json');
			fs.writeFileSync(configFile, 'bad-json', 'utf-8');
			expect(loadSettings()).toEqual(defaultSettings());
		});

		it('falls back to defaults for invalid schema', () => {
			ensureDataDir();
			const configFile = path.join(dataDir(), 'config.json');
			fs.writeFileSync(configFile, JSON.stringify({theme: 'purple'}), 'utf-8');
			expect(loadSettings()).toEqual(defaultSettings());
		});
	});

	describe('createDefaultProgress', () => {
		it('uses first lesson id', () => {
			const p = createDefaultProgress([{id: 'a'}, {id: 'b'}]);
			expect(p.currentLessonId).toBe('a');
		});

		it('handles empty lessons array', () => {
			const p = createDefaultProgress([]);
			expect(p.currentLessonId).toBe('');
		});
	});
});
