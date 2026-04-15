#!/usr/bin/env node

import {render} from 'ink';
import App from './app.js';

function handleFatalError(error: unknown) {
	if (process.stdin.isTTY) {
		process.stdin.setRawMode(false);
	}
	console.error('发生致命错误，应用已退出。');
	console.error(error);
	process.exit(1);
}

try {
	const {waitUntilExit} = render(<App />);
	waitUntilExit().catch(handleFatalError);
} catch (error) {
	handleFatalError(error);
}
