import ts from 'typescript';
import type {Diagnostic} from '../data/types.js';

export class TscService {
	private defaultOptions: ts.CompilerOptions = {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.CommonJS,
		strict: true,
		noEmit: true,
		skipLibCheck: true,
		esModuleInterop: true,
	};

	private lastCode?: string;
	private cachedProgram?: ts.Program;
	private cachedOptions?: ts.CompilerOptions;

	check(code: string, overrideOptions?: ts.CompilerOptions): Diagnostic[] {
		const fileName = 'virtual:///exercise.ts';
		const options = {...this.defaultOptions, ...overrideOptions};

		if (
			this.lastCode === code &&
			this.cachedProgram &&
			this.cachedOptions &&
			JSON.stringify(this.cachedOptions) === JSON.stringify(options)
		) {
			const diagnostics = ts.getPreEmitDiagnostics(this.cachedProgram);
			return diagnostics.map(d => this.friendlyDiagnostic(d));
		}

		const host = ts.createCompilerHost(options);
		const originalGetSourceFile = host.getSourceFile.bind(host);

		host.getSourceFile = (name, target, ...args) => {
			if (name === fileName) {
				return ts.createSourceFile(name, code, target);
			}

			return originalGetSourceFile(name, target, ...args);
		};

		const originalReadFile = host.readFile?.bind(host);
		host.readFile = name => {
			if (name === fileName) return code;
			return originalReadFile ? originalReadFile(name) : ts.sys.readFile(name);
		};

		const originalFileExists = host.fileExists?.bind(host);
		host.fileExists = name => {
			if (name === fileName) return true;
			return originalFileExists
				? originalFileExists(name)
				: ts.sys.fileExists(name);
		};

		const program = ts.createProgram([fileName], options, host);
		const diagnostics = ts.getPreEmitDiagnostics(program);

		this.lastCode = code;
		this.cachedProgram = program;
		this.cachedOptions = options;

		return diagnostics.map(d => this.friendlyDiagnostic(d));
	}

	private friendlyDiagnostic(d: ts.Diagnostic): Diagnostic {
		const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
		const file = d.file;
		let line = 0;
		let column = 0;

		if (file && d.start !== undefined) {
			const pos = file.getLineAndCharacterOfPosition(d.start);
			line = pos.line + 1;
			column = pos.character + 1;
		}

		return {
			line,
			column,
			message: this.translate(message),
			code: d.code,
		};
	}

	private translate(msg: string): string {
		// Simple friendly translations for common TS errors
		const translations: Record<string, string> = {
			"Type 'string' is not assignable to type 'number'.":
				"错误：不能把字符串赋值给数字类型的变量。请检查类型注解是否正确。",
			"Type 'number' is not assignable to type 'string'.":
				"错误：不能把数字赋值给字符串类型的变量。请检查类型注解是否正确。",
			"Parameter 'x' implicitly has an 'any' type.":
				"错误：参数 'x' 缺少类型注解。请为它添加一个类型，比如 `: string`。",
		};

		for (const [pattern, translation] of Object.entries(translations)) {
			if (msg.includes(pattern)) {
				return translation;
			}
		}

		// Fallback: keep original but prefix with friendly note
		return msg;
	}
}
