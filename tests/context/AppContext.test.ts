import {describe, it, expect} from 'vitest';
import {
	appReducer,
	getViewFromStep,
	createStepTransitionState,
} from '../../source/context/AppContext.js';
import type {AppState, Lesson, LessonStep} from '../../source/data/types.js';

const mockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
	id: 'lesson-1',
	title: 'Lesson 1',
	description: 'Desc',
	tier: 'beginner',
	prerequisites: [],
	estimatedMinutes: 5,
	steps: [
		{type: 'theory', content: 'Hello'},
		{type: 'code-demo', code: 'const x = 1;', explanation: 'Exp'},
	],
	...overrides,
});

const baseState = (overrides: Partial<AppState> = {}): AppState => ({
	currentLessonId: 'lesson-1',
	currentStepIndex: 0,
	currentView: 'theory',
	userCode: '',
	selectedQuizOptions: [],
	showHint: false,
	hintIndex: 0,
	exerciseAttempts: 0,
	diagnostics: [],
	lastResult: 'idle',
	progress: {
		version: 1,
		lastAccessedAt: new Date().toISOString(),
		currentLessonId: 'lesson-1',
		currentStepIndex: 0,
		completedLessons: {},
		globalStats: {totalXp: 0, streakDays: 0, lastStudyDate: new Date().toISOString()},
	},
	settings: {theme: 'default', showHintsByDefault: false},
	lessons: [mockLesson()],
	isInitialized: false,
	...overrides,
});

describe('getViewFromStep', () => {
	it('returns step type for known steps', () => {
		expect(getViewFromStep({type: 'quiz', question: '', options: [], allowMultiple: false})).toBe('quiz');
		expect(getViewFromStep({type: 'exercise', instructions: '', initialCode: '', validationMode: 'tsc', hints: []})).toBe('exercise');
	});

	it('falls back to theory for unknown step types', () => {
		expect(getViewFromStep(undefined)).toBe('theory');
		expect(getViewFromStep({type: 'unknown'} as unknown as LessonStep)).toBe('theory');
	});
});

describe('createStepTransitionState', () => {
	it('resets transient state when transitioning steps', () => {
		const state = baseState({userCode: 'foo', showHint: true, hintIndex: 2, diagnostics: [{line: 1, column: 1, message: 'err', code: 1}], lastResult: 'correct'});
		const result = createStepTransitionState(state, {type: 'theory', content: 'X'});
		expect(result.lastResult).toBe('idle');
		expect(result.showHint).toBe(false);
		expect(result.diagnostics).toEqual([]);
		expect(result.selectedQuizOptions).toEqual([]);
	});

	it('preserves userCode for non-exercise steps', () => {
		const state = baseState({userCode: 'foo'});
		const result = createStepTransitionState(state, {type: 'theory', content: 'X'});
		expect(result.userCode).toBe('foo');
	});

	it('sets initialCode for exercise steps', () => {
		const state = baseState({userCode: 'foo'});
		const result = createStepTransitionState(state, {type: 'exercise', instructions: '', initialCode: 'bar', validationMode: 'tsc', hints: []});
		expect(result.userCode).toBe('bar');
	});
});

describe('appReducer', () => {
	it('INIT sets up state from progress', () => {
		const lessons = [mockLesson()];
		const progress = baseState().progress;
		const state = appReducer(baseState({lessons}), {type: 'INIT', payload: {progress, lessons}});
		expect(state.isInitialized).toBe(true);
		expect(state.currentLessonId).toBe('lesson-1');
		expect(state.currentView).toBe('theory');
	});

	it('SET_LESSON switches lesson and resets step state', () => {
		const lessons = [mockLesson(), mockLesson({id: 'lesson-2'})];
		const state = appReducer(baseState({lessons}), {type: 'SET_LESSON', payload: 'lesson-2'});
		expect(state.currentLessonId).toBe('lesson-2');
		expect(state.currentStepIndex).toBe(0);
		expect(state.lastResult).toBe('idle');
	});

	it('NEXT_STEP advances within bounds', () => {
		const state = appReducer(baseState(), {type: 'NEXT_STEP'});
		expect(state.currentStepIndex).toBe(1);
		expect(state.currentView).toBe('code-demo');
	});

	it('NEXT_STEP does not exceed last step', () => {
		let state = baseState();
		state = appReducer(state, {type: 'NEXT_STEP'});
		state = appReducer(state, {type: 'NEXT_STEP'});
		expect(state.currentStepIndex).toBe(1);
	});

	it('PREV_STEP goes back within bounds', () => {
		let state = baseState({currentStepIndex: 1});
		state = appReducer(state, {type: 'PREV_STEP'});
		expect(state.currentStepIndex).toBe(0);
	});

	it('PREV_STEP does not go below 0', () => {
		const state = appReducer(baseState(), {type: 'PREV_STEP'});
		expect(state.currentStepIndex).toBe(0);
	});

	it('SET_USER_CODE updates code', () => {
		const state = appReducer(baseState(), {type: 'SET_USER_CODE', payload: 'hello'});
		expect(state.userCode).toBe('hello');
	});

	it('SET_QUIZ_SELECTION stores options', () => {
		const state = appReducer(baseState(), {type: 'SET_QUIZ_SELECTION', payload: ['a']});
		expect(state.selectedQuizOptions).toEqual(['a']);
	});

	it('TOGGLE_HINT toggles hint visibility', () => {
		const state = appReducer(baseState({showHint: false}), {type: 'TOGGLE_HINT'});
		expect(state.showHint).toBe(true);
	});

	it('NEXT_HINT increments hint index', () => {
		const state = appReducer(baseState({hintIndex: 0}), {type: 'NEXT_HINT'});
		expect(state.hintIndex).toBe(1);
	});

	it('SET_DIAGNOSTICS stores diagnostics', () => {
		const d = [{line: 1, column: 1, message: 'err', code: 1}];
		const state = appReducer(baseState(), {type: 'SET_DIAGNOSTICS', payload: d});
		expect(state.diagnostics).toEqual(d);
	});

	it('SET_RESULT stores result', () => {
		const state = appReducer(baseState(), {type: 'SET_RESULT', payload: 'correct'});
		expect(state.lastResult).toBe('correct');
	});

	it('SET_RESULT increments exerciseAttempts on incorrect exercise', () => {
		const state = appReducer(baseState({currentView: 'exercise', exerciseAttempts: 2}), {type: 'SET_RESULT', payload: 'incorrect'});
		expect(state.exerciseAttempts).toBe(3);
	});

	it('SET_RESULT does not increment exerciseAttempts on incorrect quiz', () => {
		const state = appReducer(baseState({currentView: 'quiz', exerciseAttempts: 2}), {type: 'SET_RESULT', payload: 'incorrect'});
		expect(state.exerciseAttempts).toBe(2);
	});

	it('RESET_EXERCISE resets exercise state', () => {
		const state = appReducer(
			baseState({userCode: 'foo', showHint: true, hintIndex: 1, exerciseAttempts: 3, diagnostics: [{line: 1, column: 1, message: 'err', code: 1}], lastResult: 'correct'}),
			{type: 'RESET_EXERCISE', payload: 'bar'},
		);
		expect(state.userCode).toBe('bar');
		expect(state.showHint).toBe(false);
		expect(state.hintIndex).toBe(0);
		expect(state.exerciseAttempts).toBe(0);
		expect(state.diagnostics).toEqual([]);
		expect(state.lastResult).toBe('idle');
	});

	it('COMPLETE_LESSON records completion and adds XP', () => {
		const completion = {
			lessonId: 'lesson-1',
			completedAt: new Date().toISOString(),
			score: 100,
			attempts: 1,
			hintsUsed: 0,
			stepResults: [],
		};
		const state = appReducer(baseState(), {type: 'COMPLETE_LESSON', payload: completion});
		expect(state.progress.completedLessons['lesson-1']).toBeDefined();
		expect(state.progress.globalStats.totalXp).toBe(100);
	});

	it('SAVE_PROGRESS replaces progress object', () => {
		const newProgress = {...baseState().progress, currentStepIndex: 99};
		const state = appReducer(baseState(), {type: 'SAVE_PROGRESS', payload: newProgress});
		expect(state.progress.currentStepIndex).toBe(99);
	});
});
