import {describe, it, expect, vi, beforeEach} from 'vitest';
import React from 'react';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import {render, delay} from '../test-helpers.js';
import {AppProvider} from '../../source/context/AppContext.js';
import ExerciseView from '../../source/components/ExerciseView.js';
import type {ExerciseStep, Lesson} from '../../source/data/types.js';

vi.mock('node:os', async () => {
	const actual = await vi.importActual('node:os') as typeof import('node:os');
	const tmpDir = path.join(actual.default.tmpdir(), `ts-tui-test-exercise-${Date.now()}`);
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
	steps: [],
	...overrides,
});

const mockExerciseStep = (overrides: Partial<ExerciseStep> = {}): ExerciseStep => ({
	type: 'exercise',
	instructions: 'Fix the type error.',
	initialCode: 'const x: number = "hello";',
	validationMode: 'tsc',
	hints: ['Check the type annotation.', 'Use a number.'],
	...overrides,
});

function renderWithApp(step: ExerciseStep) {
	const lessons = [mockLesson({steps: [step]})];
	return render(
		React.createElement(AppProvider, {lessons},
			React.createElement(ExerciseView, {step}),
		),
	);
}

describe('ExerciseView', () => {
	beforeEach(() => {
		const tmpDir = path.join(os.homedir(), '.ts-tui-tutorial');
		if (fs.existsSync(tmpDir)) {
			fs.rmSync(tmpDir, {recursive: true});
		}
	});

	it('renders instructions and editor', async () => {
		const {lastFrame} = renderWithApp(mockExerciseStep());
		await delay(100);
		const frame = lastFrame();
		expect(frame).toContain('练习：修复类型错误');
		expect(frame).toContain('Fix the type error.');
	});

	it('shows diagnostics after submitting invalid code', async () => {
		const step = mockExerciseStep({validationMode: 'tsc'});
		const {stdin, lastFrame} = renderWithApp(step);
		await delay(100);
		// Submit the initial code (which has a type error)
		stdin.write('\r');
		await delay(100);
		const frame = lastFrame();
		expect(frame).toContain('类型错误');
	});

	it('shows success after submitting valid code', async () => {
		const step = mockExerciseStep({validationMode: 'tsc', initialCode: 'const x: number = 42;'});
		const {stdin, lastFrame} = renderWithApp(step);
		await delay(100);
		stdin.write('\r');
		await delay(100);
		const frame = lastFrame();
		expect(frame).toContain('太棒了');
	});

	it('toggles hints on h key', async () => {
		const step = mockExerciseStep();
		const {stdin, lastFrame} = renderWithApp(step);
		await delay(100);
		stdin.write('h');
		await delay(100);
		expect(lastFrame()).toContain(step.hints[0]!);
	});

	it('cycles through hints on repeated h key', async () => {
		const step = mockExerciseStep();
		const {stdin, lastFrame} = renderWithApp(step);
		await delay(100);
		stdin.write('h');
		await delay(50);
		stdin.write('h');
		await delay(50);
		expect(lastFrame()).toContain(step.hints[1]!);
	});
});
