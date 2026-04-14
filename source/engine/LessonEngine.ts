import type {Lesson, UserProgress, LessonCompletion, StepResult} from '../data/types.js';

export function isLessonUnlocked(
	lesson: Lesson,
	progress: UserProgress,
): boolean {
	if (lesson.prerequisites.length === 0) return true;
	return lesson.prerequisites.every(
		id => (progress.completedLessons[id]?.score ?? 0) >= 60,
	);
}

export function buildLessonCompletion(
	lesson: Lesson,
	stepResults: StepResult[],
	hintsUsed: number,
	attempts: number,
): LessonCompletion {
	const correctCount = stepResults.filter(r => r.isCorrect).length;
	const total = stepResults.length;
	const score = total > 0 ? Math.round((correctCount / total) * 100) : 100;

	return {
		lessonId: lesson.id,
		completedAt: new Date().toISOString(),
		score,
		attempts,
		hintsUsed,
		stepResults,
	};
}
