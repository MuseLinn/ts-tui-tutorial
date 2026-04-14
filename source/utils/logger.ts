type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

const currentLevel: LogLevel =
	(process.env['TS_TUI_LOG'] as LogLevel) || 'warn';

function shouldLog(level: LogLevel): boolean {
	return LEVELS[level] >= LEVELS[currentLevel];
}

function format(level: LogLevel, message: string): string {
	return `[${level.toUpperCase()}] ${message}`;
}

export const logger = {
	debug: (message: string) => {
		if (shouldLog('debug')) console.debug(format('debug', message));
	},
	info: (message: string) => {
		if (shouldLog('info')) console.info(format('info', message));
	},
	warn: (message: string) => {
		if (shouldLog('warn')) console.warn(format('warn', message));
	},
	error: (message: string) => {
		if (shouldLog('error')) console.error(format('error', message));
	},
};
