
import {Box, Text} from 'ink';
import type {TheoryStep} from '../data/types.js';

export default function TheoryView({step}: {step: TheoryStep}) {
	const lines = step.content.split('\n');

	return (
		<Box flexDirection="column" paddingY={1}>
			{lines.map((line, i) => {
				if (line.startsWith('## ')) {
					return (
						<Box key={i} marginY={1}>
							<Text bold color="cyan">{line.slice(3)}</Text>
						</Box>
					);
				}

				if (line.startsWith('- ')) {
					return (
						<Box key={i} marginLeft={2}>
							<Text>• {line.slice(2)}</Text>
						</Box>
					);
				}

				if (line.trim() === '') {
					return <Box key={i} height={1} />;
				}

				return (
					<Box key={i}>
						<Text>{line}</Text>
					</Box>
				);
			})}
		</Box>
	);
}
