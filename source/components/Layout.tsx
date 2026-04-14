
import {useEffect, useState} from 'react';
import {Box, useInput, Text} from 'ink';
import {useApp} from '../context/AppContext.js';
import Header from './Header.js';
import Footer from './Footer.js';
import Sidebar from './Sidebar.js';
import TheoryView from './TheoryView.js';
import CodeView from './CodeView.js';
import QuizView from './QuizView.js';
import ExerciseView from './ExerciseView.js';
import HelpOverlay from './HelpOverlay.js';
import {buildLessonCompletion} from '../engine/LessonEngine.js';

export default function Layout() {
	const {state, dispatch} = useApp();
	const {lessons, currentLessonId, currentStepIndex, currentView, isInitialized} =
		state;
	const [showHelp, setShowHelp] = useState(false);

	const lesson = lessons.find(l => l.id === currentLessonId);
	const step = lesson?.steps[currentStepIndex];

	useAutoCompleteLesson();

	useInput((input, key) => {
		if (input === 'q') {
			process.exit(0);
		}

		if (input === '?') {
			setShowHelp(v => !v);
			return;
		}

		if (showHelp) return;

		if (key.leftArrow) {
			dispatch({type: 'PREV_STEP'});
		}

		if (key.rightArrow) {
			dispatch({type: 'NEXT_STEP'});
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

	return (
		<Box flexDirection="column" height="100%">
			<Header />
			<Box flexGrow={1} flexDirection="row" overflow="hidden">
				<Sidebar />
				<Box flexGrow={1} flexDirection="column" paddingX={2} overflow="hidden">
					{step?.type === 'theory' && currentView === 'theory' && (
						<TheoryView step={step} />
					)}
					{step?.type === 'code-demo' && currentView === 'code-demo' && (
						<CodeView step={step} />
					)}
					{step?.type === 'quiz' && currentView === 'quiz' && (
						<QuizView step={step} />
					)}
					{step?.type === 'exercise' && currentView === 'exercise' && (
						<ExerciseView step={step} />
					)}
				</Box>
			</Box>
			<Footer view={currentView} />
			{showHelp && <HelpOverlay />}
		</Box>
	);
}

function useAutoCompleteLesson() {
	const {state, dispatch} = useApp();
	const {currentLessonId, currentStepIndex, lastResult, progress, lessons} = state;
	const lesson = lessons.find(l => l.id === currentLessonId);

	useEffect(() => {
		if (
			lesson &&
			currentStepIndex >= lesson.steps.length - 1 &&
			lastResult === 'correct' &&
			!progress.completedLessons[lesson.id]
		) {
			const completion = buildLessonCompletion(
				lesson,
				[],
				state.hintIndex,
				1,
			);
			dispatch({type: 'COMPLETE_LESSON', payload: completion});
		}
	}, [lesson, currentStepIndex, lastResult, progress.completedLessons, state.hintIndex, dispatch]);
}
