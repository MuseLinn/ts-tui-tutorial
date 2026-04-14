
import {Box, Text} from 'ink';
import SyntaxHighlight from 'ink-syntax-highlight';
import type {CodeDemoStep} from '../data/types.js';

export default function CodeView({step}: {step: CodeDemoStep}) {
	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				<Text bold color="green">代码示例</Text>
			</Box>
			<Box borderStyle="round" borderColor="gray" paddingX={1} paddingY={1}>
				<SyntaxHighlight code={step.code} language="typescript" />
			</Box>
			<Box marginTop={1}>
				<Text bold color="yellow">逐行解释：</Text>
			</Box>
			{step.explanation.split('\n').map((line, i) => (
				<Box key={i} marginLeft={2}>
					<Text dimColor>{line}</Text>
				</Box>
			))}
		</Box>
	);
}
