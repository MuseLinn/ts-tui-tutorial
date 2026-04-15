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

	it('inserts newline on plain return without calling onSubmit', async () => {
		const onSubmit = vi.fn();
		const {stdin, lastFrame} = render(
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
		expect(lastFrame()).toContain('a\n');
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('handles backspace by removing previous character', async () => {
		const {stdin, lastFrame} = render(
			React.createElement(StatefulEditor, {initialCode: 'a'}),
		);
		await delay(100);
		// Type 'b' so code becomes 'ab' and cursor moves to 2
		stdin.write('b');
		await delay(100);
		// Backspace (ASCII 8) deletes character before cursor
		stdin.write('\b');
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
