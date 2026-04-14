import path from 'node:path';
import os from 'node:os';
import ts from 'typescript';

export const CONFIG = {
	AUTO_SAVE_INTERVAL_MS: 30_000,
	SIDEBAR_WIDTH: 18,
	CODE_EDITOR_HEIGHT: 12,
	DATA_DIR: path.join(os.homedir(), '.ts-tui-tutorial'),
	DEFAULT_COMPILER_OPTIONS: {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.CommonJS,
		strict: true,
		noEmit: true,
		skipLibCheck: true,
		esModuleInterop: true,
	} satisfies ts.CompilerOptions,
} as const;
