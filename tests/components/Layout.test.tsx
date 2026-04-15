import {describe, it, expect, vi, beforeEach} from 'vitest';
import React from 'react';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import {render, delay} from '../test-helpers.js';
import {AppProvider} from '../../source/context/AppContext.js';
import Layout from '../../source/components/Layout.js';
import type {Lesson} from '../../source/data/types.js';

vi.mock('node:os', async () => {
	const actual = await vi.importActual('node:os') as typeof import('node:os');
	const tmpDir = path.join(actual.default.tmpdir(), `ts-tui-test-layout-${Date.now()}`);
	return {
		default: {
			...actual.default,
			homedir: () => tmpDir,
		},
	};
});

const mockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
	id: 'lesson-1',
	title: 'Lesson 1',
	description: 'Desc',
	tier: 'beginner',
	prerequisites: [],
	estimatedMinutes: 5,
	steps: [
		{type: 'theory', content: 'Hello world'},
		{type: 'code-demo', code: 'const x = 1;', explanation: 'Demo'},
		{type: 'quiz', question: 'Q1', options: [{label: 'A', value: 'a', isCorrect: true}], allowMultiple: false},
		{type: 'exercise', instructions: 'Fix it.', initialCode: '', validationMode: 'tsc', hints: []},
	],
	...overrides,
});

function renderWithApp(lessons: Lesson[]) {
	return render(
		React.createElement(AppProvider, {lessons},
			React.createElement(Layout),
		),
	);
}

describe('Layout', () => {
	beforeEach(() => {
		const tmpDir = path.join(os.homedir(), '.ts-tui-tutorial');
		if (fs.existsSync(tmpDir)) {
			fs.rmSync(tmpDir, {recursive: true});
		}
	});

	it('shows loading state before initialization', async () => {
		const {lastFrame} = renderWithApp([mockLesson()]);
		expect(lastFrame()).toContain('TS Tutor');
		expect(lastFrame()).toContain('正在加载');
	});

	it('renders header, tutor banner, and sidebar after init', async () => {
		const {lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		const frame = lastFrame();
		expect(frame).toContain('TS Tutor');
		expect(frame).toContain('课程导航');
		expect(frame).toContain('Hello world');
		expect(frame).toContain('📖 Lesson 1');
	});

	it('toggles help overlay with ? key', async () => {
		const {stdin, lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		stdin.write('?');
		await delay(50);
		expect(lastFrame()).toContain('快捷键帮助');
		stdin.write('?');
		await delay(50);
		expect(lastFrame()).not.toContain('快捷键帮助');
	});

	it('advances stage with Enter key', async () => {
		const {stdin, lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		// Starts at intro (theory)
		expect(lastFrame()).toContain('Hello world');
		expect(lastFrame()).toContain('📖 Lesson 1');
		// Advance to demo
		stdin.write('\r');
		await delay(100);
		expect(lastFrame()).toContain('const x = 1;');
		expect(lastFrame()).toContain('💡');
	});

	it('advances through quiz to practice with Enter on correct quiz', async () => {
		const {stdin, lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		// Advance to demo
		stdin.write('\r');
		await delay(50);
		// Advance to quiz
		stdin.write('\r');
		await delay(100);
		expect(lastFrame()).toContain('Q1');
		// Select correct quiz option (a)
		stdin.write('\r');
		await delay(100);
		expect(lastFrame()).toContain('✅ 回答正确');
		// Wait for auto-advance
		await delay(1500);
		expect(lastFrame()).toContain('Fix it.');
	});
});
