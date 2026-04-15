
import {useEffect, useState} from 'react';
import {Box, useInput, Text, useApp as useInkApp} from 'ink';
import {useApp} from '../context/AppContext.js';
import Header from './Header.js';
import Footer from './Footer.js';
import Sidebar from './Sidebar.js';
import TheoryView from './TheoryView.js';
import CodeView from './CodeView.js';
import QuizView from './QuizView.js';
import ExerciseView from './ExerciseView.js';
import HelpOverlay from './HelpOverlay.js';
import TutorBanner from './TutorBanner.js';
import {buildLessonCompletion, isLessonUnlocked} from '../engine/LessonEngine.js';
import {canAdvanceStage, getTutorMessage} from '../engine/StageEngine.js';
import type {StepResult} from '../data/types.js';

export default function Layout() {
	const {state, dispatch} = useApp();
	const {lessons, currentLessonId, currentStepIndex, currentView, stageStatus, isInitialized, lastResult} =
		state;
	const [showHelp, setShowHelp] = useState(false);
	const {exit} = useInkApp();

	const lesson = lessons.find(l => l.id === currentLessonId);
	const step = lesson?.steps[currentStepIndex];

	useAutoCompleteLesson();

	// Auto-advance on quiz/exercise success after a brief delay
	useEffect(() => {
		let t: ReturnType<typeof setTimeout> | undefined;
		if (
			(stageStatus === 'quiz' || stageStatus === 'practice') &&
			lastResult === 'correct'
		) {
			t = setTimeout(() => {
				dispatch({type: 'ADVANCE_STAGE'});
			}, 1200);
		}

		return () => {
			if (t) clearTimeout(t);
		};
	}, [stageStatus, lastResult, dispatch]);

	useInput((input, key) => {
		if (input === 'q') {
			exit();
			return;
		}

		if (input === '?') {
			setShowHelp(v => !v);
			return;
		}

		if (showHelp) return;

		if (key.return) {
			if (stageStatus === 'completed') {
				const currentIdx = lessons.findIndex(l => l.id === currentLessonId);
				for (let i = currentIdx + 1; i < lessons.length; i++) {
					const nextLesson = lessons[i]!;
					if (isLessonUnlocked(nextLesson, state.progress)) {
						dispatch({type: 'SET_LESSON', payload: nextLesson.id});
						return;
					}
				}

				return;
			}

			if (stageStatus === 'quiz' && lastResult === 'incorrect') {
				dispatch({type: 'SET_RESULT', payload: 'idle'});
				dispatch({type: 'SET_QUIZ_SELECTION', payload: []});
				return;
			}

			if (canAdvanceStage(stageStatus, lastResult)) {
				dispatch({type: 'ADVANCE_STAGE'});
			}
		}
	});

	if (!isInitialized) {
		return (
			<Box flexDirection="column" height="100%" alignItems="center" justifyContent="center">
				<Text bold color="cyan">TS Tutor</Text>
				<Text dimColor>正在加载学习进度...</Text>
			</Box>
		);
	}

	const tutorMessage = lesson
		? getTutorMessage(stageStatus, lesson.title, lastResult)
		: '';

	return (
		<Box flexDirection="column" height="100%">
			<Header />
			<TutorBanner message={tutorMessage} stage={stageStatus} />
			<Box flexGrow={1} flexDirection="row" overflow="hidden">
				<Sidebar showHelp={showHelp} />
				<Box flexGrow={1} flexDirection="column" paddingX={2} overflow="hidden">
					{stageStatus === 'completed' && (
						<Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
							<Text bold color="green">🎉 课程完成！</Text>
							<Box height={1} />
							<Text dimColor>按 Enter 继续下一课</Text>
						</Box>
					)}
					{stageStatus !== 'completed' && step?.type === 'theory' && currentView === 'theory' && (
						<TheoryView step={step} />
					)}
					{stageStatus !== 'completed' && step?.type === 'code-demo' && currentView === 'code-demo' && (
						<CodeView step={step} />
					)}
					{stageStatus !== 'completed' && step?.type === 'quiz' && currentView === 'quiz' && (
						<QuizView step={step} />
					)}
					{stageStatus !== 'completed' && step?.type === 'exercise' && currentView === 'exercise' && (
						<ExerciseView step={step} />
					)}
				</Box>
			</Box>
			<Footer stageStatus={stageStatus} lastResult={lastResult} />
			{showHelp && <HelpOverlay />}
		</Box>
	);
}

function useAutoCompleteLesson() {
	const {state, dispatch} = useApp();
	const {currentLessonId, progress, lessons, hintIndex, exerciseAttempts, stageStatus} = state;
	const lesson = lessons.find(l => l.id === currentLessonId);

	useEffect(() => {
		if (
			lesson &&
			stageStatus === 'completed' &&
			!progress.completedLessons[lesson.id]
		) {
			const stepResults: StepResult[] = lesson.steps.map((_step, idx) => ({
				stepIndex: idx,
				isCorrect: true,
				attempts: idx === lesson.steps.length - 1 ? Math.max(1, exerciseAttempts + 1) : 1,
				hintsUsed: idx === lesson.steps.length - 1 ? hintIndex : 0,
			}));
			const completion = buildLessonCompletion(
				lesson,
				stepResults,
				hintIndex,
				Math.max(1, exerciseAttempts + 1),
			);
			dispatch({type: 'COMPLETE_LESSON', payload: completion});
		}
	}, [lesson, stageStatus, progress.completedLessons, hintIndex, exerciseAttempts, dispatch]);
}
