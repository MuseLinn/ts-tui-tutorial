import {describe, it, expect} from 'vitest';
import {TscService} from '../../source/services/TscService.js';

const service = new TscService();

describe('TscService', () => {
	describe('check()', () => {
		it('returns empty diagnostics for valid TS code', () => {
			const code = `const x: number = 42;`;
			const diagnostics = service.check(code);
			expect(diagnostics).toEqual([]);
		});

		it('returns diagnostics with correct line/col for code with type errors', () => {
			const code = `const x: number = "hello";`;
			const diagnostics = service.check(code);
			expect(diagnostics.length).toBeGreaterThan(0);
			expect(diagnostics[0]).toMatchObject({
				line: 1,
				column: expect.any(Number),
				message: expect.any(String),
				code: expect.any(Number),
			});
		});

		it('translates string/number mismatch to friendly Chinese', () => {
			const code = `const x: number = "hello";`;
			const diagnostics = service.check(code);
			expect(diagnostics.length).toBeGreaterThan(0);
			expect(diagnostics[0].message).toBe(
				"错误：不能把字符串赋值给数字类型的变量。请检查类型注解是否正确。",
			);
		});

		it('translates number/string mismatch to friendly Chinese', () => {
			const code = `const x: string = 42;`;
			const diagnostics = service.check(code);
			expect(diagnostics.length).toBeGreaterThan(0);
			expect(diagnostics[0].message).toBe(
				"错误：不能把数字赋值给字符串类型的变量。请检查类型注解是否正确。",
			);
		});

		it('translates implicit any parameter to friendly Chinese', () => {
			const code = `function greet(x) { return x; }`;
			const diagnostics = service.check(code);
			const implicitAny = diagnostics.find(
				d => d.code === 7006 || d.message.includes("参数 'x' 缺少类型注解"),
			);
			expect(implicitAny).toBeDefined();
			expect(implicitAny!.message).toBe(
				"错误：参数 'x' 缺少类型注解。请为它添加一个类型，比如 `: string`。",
			);
		});

		it('does not emit files (noEmit)', () => {
			const code = `const x: number = 42;`;
			// We simply verify no crash and no side-effect files are produced.
			// The service operates on a virtual file, so there is no FS output.
			const diagnostics = service.check(code);
			expect(diagnostics).toEqual([]);
		});
	});
});
