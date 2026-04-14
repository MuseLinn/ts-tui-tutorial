#!/usr/bin/env node

import {render} from 'ink';
import App from './app.js';

try {
	render(<App />);
} catch (error) {
	if (process.stdin.isTTY) {
		process.stdin.setRawMode(false);
	}
	console.error('发生致命错误，应用已退出。');
	console.error(error);
	process.exit(1);
}
