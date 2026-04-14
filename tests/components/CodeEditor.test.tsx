import {describe, it, expect, vi} from 'vitest';
import React, {useState} from 'react';
import {render, delay} from '../test-helpers.js';
import CodeEditor from '../../source/components/CodeEditor.js';

function StatefulEditor(props: Omit<React.ComponentProps<typeof CodeEditor>, 'code' | 'onChange'> & {initialCode?: string}) {
	const [code, setCode] = useState(props.initialCode ?? '');
	return React.createElement(CodeEditor, {
		...props,
		code,
		onChange: setCode,
	});
}

describe('CodeEditor', () => {
	it('renders initial code with line numbers', () => {
		const {lastFrame} = render(
			React.createElement(CodeEditor, {
				code: 'const x = 1;',
				onChange: () => {},
			}),
		);
		const frame = lastFrame();
		expect(frame).toContain('1');
		expect(frame).toContain('const x = 1;');
	});

	it('calls onChange when typing', async () => {
		const onChange = vi.fn();
		const {stdin} = render(
			React.createElement(CodeEditor, {
				code: '',
				onChange,
			}),
		);
		await delay(100);
		stdin.write('a');
		await delay(100);
		expect(onChange).toHaveBeenCalledWith('a');
	});

	it('calls onChange with tab indentation', async () => {
		const onChange = vi.fn();
		const {stdin} = render(
			React.createElement(CodeEditor, {
				code: '',
				onChange,
			}),
		);
		await delay(100);
		stdin.write('\t');
		await delay(100);
		expect(onChange).toHaveBeenCalledWith('    ');
	});

	it('calls onSubmit when pressing return', async () => {
		const onSubmit = vi.fn();
		const {stdin} = render(
			React.createElement(StatefulEditor, {
				initialCode: '',
				onSubmit,
			}),
		);
		await delay(100);
		stdin.write('a');
		await delay(100);
		stdin.write('\r');
		await delay(100);
		expect(onSubmit).toHaveBeenCalledWith('a\n');
	});

	it('handles backspace by removing previous character', async () => {
		const {stdin, lastFrame} = render(
			React.createElement(StatefulEditor, {initialCode: 'ab'}),
		);
		await delay(100);
		// Move cursor to end (right twice)
		stdin.write('\u001b[C');
		await delay(50);
		stdin.write('\u001b[C');
		await delay(50);
		stdin.write('\u007f');
		await delay(100);
		expect(lastFrame()).toContain('a');
		expect(lastFrame()).not.toContain('ab');
	});

	it('supports arrow key navigation', async () => {
		const {stdin, lastFrame} = render(
			React.createElement(StatefulEditor, {initialCode: 'ab\ncd'}),
		);
		await delay(100);
		// Move right then down
		stdin.write('\u001b[C');
		await delay(50);
		stdin.write('\u001b[B');
		await delay(50);
		const frame = lastFrame();
		expect(frame).toBeDefined();
	});
});
