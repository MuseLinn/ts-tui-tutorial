import {describe, it, expect, vi, beforeEach} from 'vitest';
import React from 'react';
import {render, delay} from '../test-helpers.js';
import ExerciseView from '../../source/components/ExerciseView.js';
import type {ExerciseStep, AppState, Diagnostic} from '../../source/data/types.js';

const mockDispatch = vi.fn();

function mockAppState(overrides: Partial<AppState> = {}): AppState {
	return {
		currentLessonId: 'lesson-1',
		currentStepIndex: 0,
		currentView: 'exercise',
		userCode: overrides.userCode ?? '',
		selectedQuizOptions: [],
		showHint: overrides.showHint ?? false,
		hintIndex: overrides.hintIndex ?? 0,
		exerciseAttempts: overrides.exerciseAttempts ?? 0,
		diagnostics: (overrides.diagnostics as Diagnostic[]) ?? [],
		lastResult: overrides.lastResult ?? 'idle',
		progress: {
			version: 1,
			lastAccessedAt: new Date().toISOString(),
			currentLessonId: 'lesson-1',
			currentStepIndex: 0,
			completedLessons: {},
			globalStats: {totalXp: 0, streakDays: 0, lastStudyDate: new Date().toISOString()},
		},
		settings: {theme: 'default', showHintsByDefault: false},
		lessons: [],
		isInitialized: true,
		...overrides,
	} as AppState;
}

vi.mock('../../source/context/AppContext.js', () => ({
	useApp: () => ({state: mockAppState(), dispatch: mockDispatch}),
	AppProvider: ({children}: {children: React.ReactNode}) => React.createElement(React.Fragment, null, children),
}));

const mockExerciseStep = (overrides: Partial<ExerciseStep> = {}): ExerciseStep => ({
	type: 'exercise',
	instructions: 'Fix the type error.',
	initialCode: 'const x: number = "hello";',
	validationMode: 'tsc',
	hints: ['Check the type annotation.', 'Use a number.'],
	...overrides,
});

describe('ExerciseView', () => {
	beforeEach(() => {
		mockDispatch.mockClear();
	});

	it('renders instructions and editor', async () => {
		const {lastFrame} = render(React.createElement(ExerciseView, {step: mockExerciseStep()}));
		await delay(100);
		const frame = lastFrame();
		expect(frame).toContain('练习：修复类型错误');
		expect(frame).toContain('Fix the type error.');
	});

	it('shows diagnostics when lastResult is incorrect', async () => {
		const step = mockExerciseStep();
		const diagnostics = [{line: 1, column: 1, message: 'Type error here', code: 1}];
		vi.mocked(await import('../../source/context/AppContext.js')).useApp = () => ({
			state: mockAppState({lastResult: 'incorrect', diagnostics, userCode: step.initialCode}),
			dispatch: mockDispatch,
		});
		const {lastFrame} = render(React.createElement(ExerciseView, {step}));
		await delay(100);
		expect(lastFrame()).toContain('类型错误');
		expect(lastFrame()).toContain('Type error here');
	});

	it('shows success when lastResult is correct', async () => {
		const step = mockExerciseStep({initialCode: 'const x: number = 42;'});
		vi.mocked(await import('../../source/context/AppContext.js')).useApp = () => ({
			state: mockAppState({lastResult: 'correct', userCode: step.initialCode}),
			dispatch: mockDispatch,
		});
		const {lastFrame} = render(React.createElement(ExerciseView, {step}));
		await delay(100);
		expect(lastFrame()).toContain('太棒了');
	});

	it('shows hint when showHint is true', async () => {
		const step = mockExerciseStep();
		vi.mocked(await import('../../source/context/AppContext.js')).useApp = () => ({
			state: mockAppState({showHint: true, hintIndex: 0, userCode: step.initialCode}),
			dispatch: mockDispatch,
		});
		const {lastFrame} = render(React.createElement(ExerciseView, {step}));
		await delay(100);
		expect(lastFrame()).toContain(step.hints[0]!);
	});

	it('shows second hint when hintIndex is 1', async () => {
		const step = mockExerciseStep();
		vi.mocked(await import('../../source/context/AppContext.js')).useApp = () => ({
			state: mockAppState({showHint: true, hintIndex: 1, userCode: step.initialCode}),
			dispatch: mockDispatch,
		});
		const {lastFrame} = render(React.createElement(ExerciseView, {step}));
		await delay(100);
		expect(lastFrame()).toContain(step.hints[1]!);
	});
});
