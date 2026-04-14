import type ts from 'typescript';

// ========================================
// Lesson & Curriculum Types
// ========================================

export interface Lesson {
	id: string;
	title: string;
	description: string;
	tier: 'beginner' | 'intermediate' | 'advanced';
	steps: LessonStep[];
	prerequisites: string[];
	estimatedMinutes: number;
}

export type LessonStep =
	| TheoryStep
	| CodeDemoStep
	| QuizStep
	| ExerciseStep;

export interface TheoryStep {
	type: 'theory';
	content: string;
}

export interface CodeDemoStep {
	type: 'code-demo';
	code: string;
	focusLines?: number[];
	explanation: string;
}

export interface QuizOption {
	label: string;
	value: string;
	isCorrect: boolean;
	explanation?: string;
}

export interface QuizStep {
	type: 'quiz';
	question: string;
	options: QuizOption[];
	allowMultiple: boolean;
}

export interface ExerciseStep {
	type: 'exercise';
	instructions: string;
	initialCode: string;
	expectedCode?: string;
	validationMode: 'tsc' | 'exact-match' | 'contains';
	hints: string[];
	compilerOptions?: ts.CompilerOptions;
	containsPattern?: string; // regex string for contains mode
}

// ========================================
// Progress Types
// ========================================

export interface UserProgress {
	version: number;
	lastAccessedAt: string;
	currentLessonId: string;
	currentStepIndex: number;
	completedLessons: Record<string, LessonCompletion>;
	globalStats: {
		totalXp: number;
		streakDays: number;
		lastStudyDate: string;
	};
}

export interface LessonCompletion {
	lessonId: string;
	completedAt: string;
	score: number;
	attempts: number;
	hintsUsed: number;
	stepResults: StepResult[];
}

export interface StepResult {
	stepIndex: number;
	isCorrect: boolean;
	attempts: number;
	hintsUsed: number;
}

export interface AppSettings {
	theme: 'default' | 'dark' | 'high-contrast';
	showHintsByDefault: boolean;
}

// ========================================
// App State Types
// ========================================

export interface Diagnostic {
	line: number;
	column: number;
	message: string;
	code: number;
}

export type ViewType = 'theory' | 'code-demo' | 'quiz' | 'exercise';

export interface AppState {
	currentLessonId: string;
	currentStepIndex: number;
	currentView: ViewType;
	userCode: string;
	selectedQuizOptions: string[];
	showHint: boolean;
	hintIndex: number;
	diagnostics: Diagnostic[];
	lastResult: 'idle' | 'correct' | 'incorrect';
	progress: UserProgress;
	settings: AppSettings;
	lessons: Lesson[];
}

export type AppAction =
	| { type: 'INIT'; payload: { progress: UserProgress; lessons: Lesson[] } }
	| { type: 'SET_LESSON'; payload: string }
	| { type: 'NEXT_STEP' }
	| { type: 'PREV_STEP' }
	| { type: 'SET_VIEW'; payload: ViewType }
	| { type: 'SET_USER_CODE'; payload: string }
	| { type: 'SET_QUIZ_SELECTION'; payload: string[] }
	| { type: 'TOGGLE_HINT' }
	| { type: 'NEXT_HINT' }
	| { type: 'SET_DIAGNOSTICS'; payload: Diagnostic[] }
	| { type: 'SET_RESULT'; payload: 'idle' | 'correct' | 'incorrect' }
	| { type: 'SAVE_PROGRESS'; payload: UserProgress }
	| { type: 'RESET_EXERCISE'; payload: string }
	| { type: 'COMPLETE_LESSON'; payload: LessonCompletion };
