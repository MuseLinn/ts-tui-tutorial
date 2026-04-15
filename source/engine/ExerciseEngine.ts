import {TscService} from '../services/TscService.js';
import {i18n} from '../i18n/zh-CN.js';
import type {ExerciseStep, Diagnostic} from '../data/types.js';

const defaultTscService = new TscService();

export interface ExerciseResult {
	passed: boolean;
	diagnostics: Diagnostic[];
	message?: string;
}

export function validateExercise(
	step: ExerciseStep,
	userCode: string,
	tscService: TscService = defaultTscService,
): ExerciseResult {
	switch (step.validationMode) {
		case 'tsc': {
			const diagnostics = tscService.check(userCode, step.compilerOptions);
			return {
				passed: diagnostics.length === 0,
				diagnostics,
				message:
					diagnostics.length === 0
						? i18n.exercise.tscSuccess
						: i18n.exercise.tscFailure(diagnostics.length),
			};
		}

		case 'exact-match': {
			const normalizedUser = userCode.replace(/\s+/g, ' ').trim();
			const normalizedExpected = (step.expectedCode || '')
				.replace(/\s+/g, ' ')
				.trim();
			return {
				passed: normalizedUser === normalizedExpected,
				diagnostics: [],
				message:
					normalizedUser === normalizedExpected
						? i18n.exercise.exactMatchSuccess
						: i18n.exercise.exactMatchFailure,
			};
		}

		case 'contains': {
			const pattern = step.containsPattern || '';
			try {
				const regex = new RegExp(pattern);
				return {
					passed: regex.test(userCode),
					diagnostics: [],
					message: regex.test(userCode)
						? i18n.exercise.containsSuccess
						: i18n.exercise.containsFailure,
				};
			} catch {
				return {
					passed: false,
					diagnostics: [],
					message: i18n.exercise.containsInvalidPattern,
				};
			}
		}

		default:
			return {passed: false, diagnostics: [], message: i18n.exercise.unknownValidationMode};
	}
}
