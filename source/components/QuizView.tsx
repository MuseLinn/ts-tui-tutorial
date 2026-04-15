
import {Box, Text} from 'ink';
import {Select, MultiSelect} from '@inkjs/ui';
import {useApp} from '../context/AppContext.js';
import type {QuizStep} from '../data/types.js';

export default function QuizView({step}: {step: QuizStep}) {
	const {state, dispatch} = useApp();
	const {selectedQuizOptions, lastResult} = state;

	const correctValues = step.options.filter(o => o.isCorrect).map(o => o.value);

	const checkCorrect = (selected: string[]) =>
		selected.length === correctValues.length &&
		selected.every(v => correctValues.includes(v));

	const handleSingleSubmit = (value: string) => {
		if (lastResult !== 'idle') return;
		const selected = [value];
		dispatch({type: 'SET_QUIZ_SELECTION', payload: selected});
		dispatch({type: 'SET_RESULT', payload: checkCorrect(selected) ? 'correct' : 'incorrect'});
	};

	const handleMultiSubmit = (values: string[]) => {
		if (lastResult !== 'idle') return;
		dispatch({type: 'SET_QUIZ_SELECTION', payload: values});
		dispatch({type: 'SET_RESULT', payload: checkCorrect(values) ? 'correct' : 'incorrect'});
	};

	const selectOptions = step.options.map(o => ({
		label: o.label,
		value: o.value,
	}));

	const selectedOption = step.options.find(
		o => o.value === selectedQuizOptions[0],
	);

	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				<Text bold>{step.question}</Text>
			</Box>
			{step.allowMultiple ? (
				<MultiSelect
					options={selectOptions}
					defaultValue={selectedQuizOptions}
					onSubmit={handleMultiSubmit}
					isDisabled={lastResult !== 'idle'}
				/>
			) : (
				<Select
					options={selectOptions}
					onChange={handleSingleSubmit}
					isDisabled={lastResult !== 'idle'}
				/>
			)}
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
