import {describe, it, expect} from 'vitest';
import {
	isLessonUnlocked,
	buildLessonCompletion,
} from '../../source/engine/LessonEngine.js';
import type {Lesson, UserProgress, StepResult} from '../../source/data/types.js';

const makeLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
	id: 'lesson-1',
	title: 'Test Lesson',
	description: 'A test lesson',
	tier: 'beginner',
	steps: [],
	prerequisites: [],
	estimatedMinutes: 5,
	...overrides,
});

const makeProgress = (
	completions: Record<string, {score: number}> = {},
): UserProgress => ({
	version: 1,
	lastAccessedAt: new Date().toISOString(),
	currentLessonId: 'lesson-1',
	currentStepIndex: 0,
	completedLessons: Object.fromEntries(
		Object.entries(completions).map(([id, data]) => [
			id,
			{
				lessonId: id,
				completedAt: new Date().toISOString(),
				score: data.score,
				attempts: 1,
				hintsUsed: 0,
				stepResults: [],
			},
		]),
	),
	globalStats: {
		totalXp: 0,
		streakDays: 0,
		lastStudyDate: new Date().toISOString(),
	},
});

const makeStepResult = (isCorrect: boolean): StepResult => ({
	stepIndex: 0,
	isCorrect,
	attempts: 1,
	hintsUsed: 0,
});

describe('LessonEngine', () => {
	describe('isLessonUnlocked', () => {
		it('returns true for lessons with no prerequisites', () => {
			const lesson = makeLesson({prerequisites: []});
			const progress = makeProgress();
			expect(isLessonUnlocked(lesson, progress)).toBe(true);
		});

		it('returns true when all prerequisites have score >= 60', () => {
			const lesson = makeLesson({prerequisites: ['lesson-a', 'lesson-b']});
			const progress = makeProgress({
				'lesson-a': {score: 60},
				'lesson-b': {score: 80},
			});
			expect(isLessonUnlocked(lesson, progress)).toBe(true);
		});

		it('returns false when any prerequisite has score < 60', () => {
			const lesson = makeLesson({prerequisites: ['lesson-a', 'lesson-b']});
			const progress = makeProgress({
				'lesson-a': {score: 60},
				'lesson-b': {score: 59},
			});
			expect(isLessonUnlocked(lesson, progress)).toBe(false);
		});

		it('returns false when a prerequisite is missing', () => {
			const lesson = makeLesson({prerequisites: ['lesson-a', 'lesson-b']});
			const progress = makeProgress({
				'lesson-a': {score: 100},
			});
			expect(isLessonUnlocked(lesson, progress)).toBe(false);
		});
	});

	describe('buildLessonCompletion', () => {
		it('calculates score correctly for 2/3 correct', () => {
			const lesson = makeLesson({id: 'lesson-1'});
			const stepResults = [
				makeStepResult(true),
				makeStepResult(true),
				makeStepResult(false),
			];
			const result = buildLessonCompletion(lesson, stepResults, 1, 2);
			expect(result.score).toBe(67);
			expect(result.lessonId).toBe('lesson-1');
			expect(result.attempts).toBe(2);
			expect(result.hintsUsed).toBe(1);
			expect(result.stepResults).toEqual(stepResults);
			expect(result.completedAt).toEqual(expect.any(String));
		});

		it('calculates score correctly for 3/3 correct', () => {
			const lesson = makeLesson({id: 'lesson-1'});
			const stepResults = [
				makeStepResult(true),
				makeStepResult(true),
				makeStepResult(true),
			];
			const result = buildLessonCompletion(lesson, stepResults, 0, 1);
			expect(result.score).toBe(100);
		});

		it('returns 100 when there are no step results', () => {
			const lesson = makeLesson({id: 'lesson-1'});
			const result = buildLessonCompletion(lesson, [], 0, 1);
			expect(result.score).toBe(100);
		});
	});
});
