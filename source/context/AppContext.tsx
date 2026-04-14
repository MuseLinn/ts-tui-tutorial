import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	type ReactNode,
	type Dispatch,
} from 'react';
import type {AppState, AppAction, Lesson, UserProgress} from '../data/types.js';
import {loadProgress, saveProgress, createDefaultProgress} from '../services/ProgressRepo.js';

function appReducer(state: AppState, action: AppAction): AppState {
	switch (action.type) {
		case 'INIT': {
			const firstLessonId = action.payload.lessons[0]?.id ?? '';
			const progress = action.payload.progress;
			const lessonId = progress.currentLessonId || firstLessonId;
			const lesson = action.payload.lessons.find(l => l.id === lessonId) ?? action.payload.lessons[0];
			const step = lesson?.steps[progress.currentStepIndex] ?? lesson?.steps[0];

			return {
				...state,
				lessons: action.payload.lessons,
				progress,
				currentLessonId: lessonId,
				currentStepIndex: progress.currentStepIndex,
				currentView: (step?.type as AppState['currentView']) || 'theory',
				userCode:
					step?.type === 'exercise'
						? step.initialCode
						: '',
			};
		}

		case 'SET_LESSON': {
			const lesson = state.lessons.find(l => l.id === action.payload);
			if (!lesson) return state;
			const step = lesson.steps[0];
			return {
				...state,
				currentLessonId: action.payload,
				currentStepIndex: 0,
				currentView: (step?.type as AppState['currentView']) || 'theory',
				userCode:
					step?.type === 'exercise'
						? step.initialCode
						: '',
				selectedQuizOptions: [],
				showHint: false,
				hintIndex: 0,
				diagnostics: [],
				lastResult: 'idle',
			};
		}

		case 'NEXT_STEP': {
			const lesson = state.lessons.find(l => l.id === state.currentLessonId);
			if (!lesson) return state;
			const nextIndex = Math.min(
				state.currentStepIndex + 1,
				lesson.steps.length - 1,
			);
			const step = lesson.steps[nextIndex];
			return {
				...state,
				currentStepIndex: nextIndex,
				currentView: (step?.type as AppState['currentView']) || state.currentView,
				userCode:
					step?.type === 'exercise'
						? step.initialCode
						: state.userCode,
				selectedQuizOptions: [],
				showHint: false,
				hintIndex: 0,
				diagnostics: [],
				lastResult: 'idle',
			};
		}

		case 'PREV_STEP': {
			const lesson = state.lessons.find(l => l.id === state.currentLessonId);
			if (!lesson) return state;
			const prevIndex = Math.max(state.currentStepIndex - 1, 0);
			const step = lesson.steps[prevIndex];
			return {
				...state,
				currentStepIndex: prevIndex,
				currentView: (step?.type as AppState['currentView']) || state.currentView,
				userCode:
					step?.type === 'exercise'
						? step.initialCode
						: state.userCode,
				selectedQuizOptions: [],
				showHint: false,
				hintIndex: 0,
				diagnostics: [],
				lastResult: 'idle',
			};
		}

		case 'SET_VIEW': {
			const lesson = state.lessons.find(l => l.id === state.currentLessonId);
			const step = lesson?.steps[state.currentStepIndex];
			return {
				...state,
				currentView: action.payload,
				userCode:
					step?.type === 'exercise'
						? step.initialCode
						: state.userCode,
			};
		}

		case 'SET_USER_CODE':
			return {...state, userCode: action.payload};

		case 'SET_QUIZ_SELECTION':
			return {...state, selectedQuizOptions: action.payload};

		case 'TOGGLE_HINT':
			return {...state, showHint: !state.showHint};

		case 'NEXT_HINT':
			return {...state, hintIndex: state.hintIndex + 1};

		case 'SET_DIAGNOSTICS':
			return {...state, diagnostics: action.payload};

		case 'SET_RESULT':
			return {...state, lastResult: action.payload};

		case 'SAVE_PROGRESS': {
			const progress = action.payload;
			saveProgress(progress);
			return {...state, progress};
		}

		case 'RESET_EXERCISE': {
			return {
				...state,
				userCode: action.payload,
				showHint: false,
				hintIndex: 0,
				diagnostics: [],
				lastResult: 'idle',
			};
		}

		case 'COMPLETE_LESSON': {
			const completion = action.payload;
			const progress: UserProgress = {
				...state.progress,
				lastAccessedAt: new Date().toISOString(),
				completedLessons: {
					...state.progress.completedLessons,
					[completion.lessonId]: completion,
				},
				globalStats: {
					...state.progress.globalStats,
					totalXp: state.progress.globalStats.totalXp + Math.round(completion.score),
				},
			};
			saveProgress(progress);
			return {...state, progress};
		}

		default:
			return state;
	}
}

type AppContextValue = {
	state: AppState;
	dispatch: Dispatch<AppAction>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
	children,
	lessons,
}: {
	children: ReactNode;
	lessons: Lesson[];
}) {
	const [state, dispatch] = useReducer(appReducer, {
		currentLessonId: '',
		currentStepIndex: 0,
		currentView: 'theory',
		userCode: '',
		selectedQuizOptions: [],
		showHint: false,
		hintIndex: 0,
		diagnostics: [],
		lastResult: 'idle',
		progress: createDefaultProgress(lessons),
		settings: {theme: 'default', showHintsByDefault: false},
		lessons,
	});

	useEffect(() => {
		const progress = loadProgress() ?? createDefaultProgress(lessons);
		dispatch({type: 'INIT', payload: {progress, lessons}});
	}, [lessons]);

	// Auto-save every 30 seconds
	useEffect(() => {
		const id = setInterval(() => {
			const progress: UserProgress = {
				...state.progress,
				lastAccessedAt: new Date().toISOString(),
				currentLessonId: state.currentLessonId,
				currentStepIndex: state.currentStepIndex,
			};
			saveProgress(progress);
		}, 30_000);
		return () => clearInterval(id);
	}, [state]);

	return (
		<AppContext.Provider value={{state, dispatch}}>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error('useApp must be used within AppProvider');
	return ctx;
}
