
import {Box, Text, useInput} from 'ink';
import SyntaxHighlight from 'ink-syntax-highlight';
import {useApp} from '../context/AppContext.js';
import {validateExercise} from '../engine/ExerciseEngine.js';
import {i18n} from '../i18n/zh-CN.js';
import type {ExerciseStep, Diagnostic} from '../data/types.js';
import CodeEditor from './CodeEditor.js';

export default function ExerciseView({step}: {step: ExerciseStep}) {
	const {state, dispatch} = useApp();
	const {userCode, showHint, hintIndex, diagnostics, lastResult} = state;

	const handleSubmit = (code: string) => {
		const result = validateExercise(step, code);
		dispatch({type: 'SET_DIAGNOSTICS', payload: result.diagnostics});
		dispatch({
			type: 'SET_RESULT',
			payload: result.passed ? 'correct' : 'incorrect',
		});
	};

	useInput((input, key) => {
		if (lastResult === 'correct') return;
		if (key.ctrl || key.meta) {
			if (input === 'h') {
				if (!showHint) {
					dispatch({type: 'TOGGLE_HINT'});
				} else if (hintIndex < step.hints.length - 1) {
					dispatch({type: 'NEXT_HINT'});
				}
			}

			if (input === 'r') {
				dispatch({type: 'RESET_EXERCISE', payload: step.initialCode});
			}
		}
	});

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				<Text bold color="yellow">练习：修复类型错误</Text>
			</Box>
			<Box marginBottom={1}>
				<Text>{step.instructions}</Text>
			</Box>
			<Box borderStyle="round" borderColor="gray" paddingX={1} paddingY={1}>
				{lastResult === 'correct' ? (
					<SyntaxHighlight code={userCode} language="typescript" />
				) : (
					<CodeEditor
						code={userCode}
						onChange={newCode => dispatch({type: 'SET_USER_CODE', payload: newCode})}
						onSubmit={handleSubmit}
						height={10}
						showLineNumbers
						focus
					/>
				)}
			</Box>

			{diagnostics.length > 0 && lastResult !== 'correct' && (
				<Box marginTop={1} flexDirection="column">
					<Text bold color="red">类型错误：</Text>
					{diagnostics.map((d: Diagnostic, i: number) => (
						<Box key={i} marginLeft={2}>
							<Text color="red">
								第{d.line}行, 第{d.column}列: {d.message}
							</Text>
						</Box>
					))}
				</Box>
			)}

			{lastResult === 'correct' && (
				<Box marginTop={1}>
					<Text color="green" bold>{i18n.exercise.tscSuccess}</Text>
					<Box marginTop={1}>
						<Text dimColor>按 → 进入下一步</Text>
					</Box>
				</Box>
			)}

			{showHint && (
				<Box marginTop={1}>
					<Text color="yellow">{step.hints[hintIndex] ?? ''}</Text>
				</Box>
			)}
		</Box>
	);
}
