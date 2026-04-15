import type {Lesson, ViewType} from '../data/types.js';

export type StageStatus = 'intro' | 'demo' | 'quiz' | 'practice' | 'completed';

const stageToStepType: Record<Exclude<StageStatus, 'completed'>, Lesson['steps'][number]['type']> = {
	intro: 'theory',
	demo: 'code-demo',
	quiz: 'quiz',
	practice: 'exercise',
};

export function getViewForStage(stage: StageStatus): ViewType {
	if (stage === 'completed') return 'theory';
	return stageToStepType[stage];
}

export function getStepIndexForStage(lesson: Lesson, stage: StageStatus): number {
	if (stage === 'completed') {
		return Math.max(0, lesson.steps.length - 1);
	}

	const targetType = stageToStepType[stage];
	const idx = lesson.steps.findIndex(s => s.type === targetType);
	return idx >= 0 ? idx : 0;
}

export function getStageFromStepIndex(lesson: Lesson, stepIndex: number): StageStatus {
	const step = lesson.steps[stepIndex];
	if (!step) return 'intro';
	switch (step.type) {
		case 'theory':
			return 'intro';
		case 'code-demo':
			return 'demo';
		case 'quiz':
			return 'quiz';
		case 'exercise':
			return 'practice';
		default:
			return 'intro';
	}
}

export function deriveStageStatus(
	lesson: Lesson,
	stepIndex: number,
	isCompleted: boolean,
): StageStatus {
	if (isCompleted) return 'completed';
	return getStageFromStepIndex(lesson, stepIndex);
}

export function nextStageStatus(lesson: Lesson, current: StageStatus): StageStatus {
	if (current === 'completed') return 'completed';

	const flow: Exclude<StageStatus, 'completed'>[] = ['intro', 'demo', 'quiz', 'practice'];
	const currentIdx = flow.indexOf(current);
	for (let i = currentIdx + 1; i < flow.length; i++) {
		const stage = flow[i]!;
		const targetType = stageToStepType[stage];
		if (lesson.steps.some(s => s.type === targetType)) {
			return stage;
		}
	}

	return 'completed';
}

export function canAdvanceStage(
	stage: StageStatus,
	lastResult: 'idle' | 'correct' | 'incorrect',
): boolean {
	switch (stage) {
		case 'intro':
		case 'demo':
			return true;
		case 'quiz':
			return lastResult === 'correct';
		case 'practice':
			return lastResult === 'correct';
		case 'completed':
			return true;
	}
}

export function getTutorMessage(
	stage: StageStatus,
	lessonTitle: string,
	lastResult: 'idle' | 'correct' | 'incorrect',
): string {
	switch (stage) {
		case 'intro':
			return `📖 ${lessonTitle} — 先了解一下理论知识，准备好后按 Enter 继续`;
		case 'demo':
			return `💡 看看代码演示，理解后按 Enter 进入测验`;
		case 'quiz': {
			if (lastResult === 'incorrect') return '❌ 答错了，再想想看？（任意键或 Enter 后继续）';
			if (lastResult === 'correct') return '🎉 答对了！准备进入练习环节';
			return '📝 小测验：选择正确的答案，按 Enter 确认';
		}

		case 'practice': {
			if (lastResult === 'incorrect') return '💪 还有错误，继续修改后按 Ctrl+Enter 提交';
			if (lastResult === 'correct') return '✅ 练习通过！太棒了';
			return '💪 动手练习：修改代码后按 Ctrl+Enter 提交';
		}

		case 'completed':
			return '🎉 本课已完成！按 Enter 进入下一课';
	}
}
