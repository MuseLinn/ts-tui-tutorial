import {TscService} from '../services/TscService.js';
import type {ExerciseStep, Diagnostic} from '../data/types.js';

const tscService = new TscService();

export interface ExerciseResult {
	passed: boolean;
	diagnostics: Diagnostic[];
	message?: string;
}

export function validateExercise(
	step: ExerciseStep,
	userCode: string,
): ExerciseResult {
	switch (step.validationMode) {
		case 'tsc': {
			const diagnostics = tscService.check(userCode, step.compilerOptions);
			const typeErrors = diagnostics.filter(d => d.code !== 2304); // ignore "cannot find name console"
			return {
				passed: typeErrors.length === 0,
				diagnostics,
				message:
					typeErrors.length === 0
						? '✅ 太棒了！代码没有任何类型错误。'
						: `❌ 还有 ${typeErrors.length} 个类型错误需要修复。`,
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
						? '✅ 答案完全正确！'
						: '❌ 答案不完全匹配，请再检查一下。',
			};
		}

		case 'contains': {
			const pattern = step.containsPattern || '';
			const regex = new RegExp(pattern);
			return {
				passed: regex.test(userCode),
				diagnostics: [],
				message: regex.test(userCode)
					? '✅ 代码中包含了要求的模式。'
					: '❌ 代码中缺少要求的模式，请再检查一下。',
			};
		}

		default:
			return {passed: false, diagnostics: [], message: '未知的校验模式'};
	}
}
