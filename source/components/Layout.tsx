
import {Box, useInput} from 'ink';
import {useApp} from '../context/AppContext.js';
import Header from './Header.js';
import Footer from './Footer.js';
import Sidebar from './Sidebar.js';
import TheoryView from './TheoryView.js';
import CodeView from './CodeView.js';
import QuizView from './QuizView.js';
import ExerciseView from './ExerciseView.js';
import {buildLessonCompletion} from '../engine/LessonEngine.js';

export default function Layout() {
	const {state, dispatch} = useApp();
	const {lessons, currentLessonId, currentStepIndex, currentView, lastResult} =
		state;

	const lesson = lessons.find((l: {id: string}) => l.id === currentLessonId);
	const step = lesson?.steps[currentStepIndex];

	useInput((input, key) => {
		if (input === 'q') {
			process.exit(0);
		}

		if (key.leftArrow) {
			const views: typeof currentView[] = ['theory', 'code-demo', 'quiz', 'exercise'];
			const idx = views.indexOf(currentView);
			if (idx > 0) dispatch({type: 'SET_VIEW', payload: views[idx - 1]!});
			else dispatch({type: 'PREV_STEP'});
		}

		if (key.rightArrow) {
			if (lastResult === 'correct' || lastResult === 'incorrect') {
				dispatch({type: 'NEXT_STEP'});
			} else {
				const views: typeof currentView[] = ['theory', 'code-demo', 'quiz', 'exercise'];
				const idx = views.indexOf(currentView);
				if (idx >= 0 && idx < views.length - 1) {
					dispatch({type: 'SET_VIEW', payload: views[idx + 1]!});
				} else {
					dispatch({type: 'NEXT_STEP'});
				}
			}
		}
	});

	// Auto-complete lesson when reaching the end
	if (
		lesson &&
		currentStepIndex >= lesson.steps.length - 1 &&
		lastResult === 'correct' &&
		!state.progress.completedLessons[lesson.id]
	) {
		const completion = buildLessonCompletion(
			lesson,
			[], // simplified step results
			state.hintIndex,
			1,
		);
		dispatch({type: 'COMPLETE_LESSON', payload: completion});
	}

	return (
		<Box flexDirection="column" height="100%">
			<Header />
			<Box flexGrow={1} flexDirection="row">
				<Sidebar />
				<Box flexGrow={1} flexDirection="column" paddingX={2}>
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
		</Box>
	);
}
