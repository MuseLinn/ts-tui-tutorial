import {describe, it, expect} from 'vitest';
import {validateExercise} from '../../source/engine/ExerciseEngine.js';
import type {ExerciseStep} from '../../source/data/types.js';

const baseStep = (overrides: Partial<ExerciseStep> = {}): ExerciseStep => ({
	type: 'exercise',
	instructions: 'Test exercise',
	initialCode: '',
	validationMode: 'tsc',
	hints: [],
	...overrides,
});

describe('ExerciseEngine', () => {
	describe('validationMode: tsc', () => {
		it('passes for valid code', () => {
			const step = baseStep({validationMode: 'tsc'});
			const userCode = 'const x: number = 42;';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(true);
			expect(result.diagnostics).toEqual([]);
			expect(result.message).toContain('太棒了');
		});

		it('fails for invalid code', () => {
			const step = baseStep({validationMode: 'tsc'});
			const userCode = 'const x: number = "hello";';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(false);
			expect(result.diagnostics.length).toBeGreaterThan(0);
			expect(result.message).toContain('类型错误');
		});
	});

	describe('validationMode: exact-match', () => {
		it('passes when user code matches expected code ignoring whitespace', () => {
			const step = baseStep({
				validationMode: 'exact-match',
				expectedCode: 'const x = 42;',
			});
			const userCode = 'const   x   =   42;';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(true);
			expect(result.message).toContain('答案完全正确');
		});

		it('fails when user code does not match expected code', () => {
			const step = baseStep({
				validationMode: 'exact-match',
				expectedCode: 'const x = 42;',
			});
			const userCode = 'const x = 100;';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(false);
			expect(result.message).toContain('不完全匹配');
		});

		it('handles empty code', () => {
			const step = baseStep({
				validationMode: 'exact-match',
				expectedCode: '',
			});
			const userCode = '';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(true);
		});

		it('handles extra whitespace in exact-match', () => {
			const step = baseStep({
				validationMode: 'exact-match',
				expectedCode: 'function add(a: number, b: number) { return a + b; }',
			});
			const userCode = 'function   add(a: number,    b: number)   {    return a + b;   }';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(true);
		});
	});

	describe('validationMode: contains', () => {
		it('passes when regex matches user code', () => {
			const step = baseStep({
				validationMode: 'contains',
				containsPattern: 'const\\s+x',
			});
			const userCode = 'const x = 10;';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(true);
			expect(result.message).toContain('包含了要求的模式');
		});

		it('fails when regex does not match user code', () => {
			const step = baseStep({
				validationMode: 'contains',
				containsPattern: 'let\\s+y',
			});
			const userCode = 'const x = 10;';
			const result = validateExercise(step, userCode);
			expect(result.passed).toBe(false);
			expect(result.message).toContain('缺少要求的模式');
		});
	});
});
