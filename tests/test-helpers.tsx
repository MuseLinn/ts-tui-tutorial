import {EventEmitter} from 'node:events';
import {render as inkRender} from 'ink-testing-library';

// Monkey-patch globally once so Ink's App component doesn't crash
(EventEmitter.prototype as any).ref = () => {};
(EventEmitter.prototype as any).unref = () => {};

export function render(tree: React.ReactElement) {
	const result = inkRender(tree);
	const queue: string[] = [];

	(result.stdin as any).read = () => queue.shift() ?? null;
	const originalWrite = (result.stdin as any).write.bind(result.stdin);
	(result.stdin as any).write = (data: string) => {
		queue.push(data);
		result.stdin.emit('readable');
		originalWrite(data);
	};

	return result;
}

export function delay(ms = 50) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
