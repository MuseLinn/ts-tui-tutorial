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
		// Immediately after render, isInitialized is false
		expect(lastFrame()).toContain('TS Tutor');
		expect(lastFrame()).toContain('正在加载');
	});

	it('renders header and sidebar after init', async () => {
		const {lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		const frame = lastFrame();
		expect(frame).toContain('TS Tutor');
		expect(frame).toContain('课程导航');
		expect(frame).toContain('Hello world');
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

	it('switches views with right arrow', async () => {
		const {stdin, lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		// Starts at theory
		expect(lastFrame()).toContain('Hello world');
		// Move to code-demo
		stdin.write('\u001b[C');
		await delay(50);
		expect(lastFrame()).toContain('const x = 1;');
	});

	it('goes back with left arrow', async () => {
		const {stdin, lastFrame} = renderWithApp([mockLesson()]);
		await delay(100);
		// Move to code-demo then back to theory
		stdin.write('\u001b[C');
		await delay(50);
		stdin.write('\u001b[D');
		await delay(50);
		expect(lastFrame()).toContain('Hello world');
	});
});
