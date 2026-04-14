
import {Box, Text} from 'ink';
import {Select} from '@inkjs/ui';
import {useApp} from '../context/AppContext.js';
import type {QuizStep} from '../data/types.js';

export default function QuizView({step}: {step: QuizStep}) {
	const {state, dispatch} = useApp();
	const {selectedQuizOptions, lastResult} = state;

	const handleSubmit = (value: string) => {
		if (lastResult !== 'idle') return;
		const selected = [value];
		dispatch({type: 'SET_QUIZ_SELECTION', payload: selected});

		const correctValues = step.options.filter(o => o.isCorrect).map(o => o.value);
		const isCorrect =
			selected.length === correctValues.length &&
			selected.every(v => correctValues.includes(v));

		dispatch({type: 'SET_RESULT', payload: isCorrect ? 'correct' : 'incorrect'});
	};

	const selectedOption = step.options.find(
		o => o.value === selectedQuizOptions[0],
	);

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				<Text bold>{step.question}</Text>
			</Box>
			<Select
				options={step.options.map(o => ({
					label: o.label,
					value: o.value,
				}))}
				highlightText={lastResult === 'idle' ? 'true' : undefined}
				onChange={handleSubmit}
			/>
			{lastResult !== 'idle' && selectedOption && (
				<Box marginTop={1} flexDirection="column">
					<Text
						color={lastResult === 'correct' ? 'green' : 'red'}
						bold
					>
						{lastResult === 'correct' ? '✅ 回答正确！' : '❌ 回答错误'}
					</Text>
					<Text dimColor>{selectedOption.explanation}</Text>
					<Box marginTop={1}>
						<Text dimColor>按 → 进入下一步</Text>
					</Box>
				</Box>
			)}
		</Box>
	);
}
