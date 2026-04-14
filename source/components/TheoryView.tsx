import {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import type {TheoryStep} from '../data/types.js';
import {CONFIG} from '../config.js';

export default function TheoryView({step}: {step: TheoryStep}) {
	const lines = step.content.split('\n');
	const [scrollOffset, setScrollOffset] = useState(0);
	const maxVisible = CONFIG.CODE_EDITOR_HEIGHT;
	const maxScroll = Math.max(0, lines.length - maxVisible);

	useInput((_input, key) => {
		if (key.downArrow) {
			setScrollOffset(o => Math.min(o + 1, maxScroll));
		}

		if (key.upArrow) {
			setScrollOffset(o => Math.max(o - 1, 0));
		}
	});

	const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisible);

	return (
		<Box flexDirection="column" paddingY={1} overflow="hidden" height={maxVisible}>
			{visibleLines.map((line, i) => {
				const absoluteIndex = scrollOffset + i;
				if (line.startsWith('## ')) {
					return (
						<Box key={absoluteIndex} marginY={1}>
							<Text bold color="cyan">{line.slice(3)}</Text>
						</Box>
					);
				}

				if (line.startsWith('- ')) {
					return (
						<Box key={absoluteIndex} marginLeft={2}>
							<Text>• {line.slice(2)}</Text>
						</Box>
					);
				}

				if (line.trim() === '') {
					return <Box key={absoluteIndex} height={1} />;
				}

				return (
					<Box key={absoluteIndex}>
						<Text>{line}</Text>
					</Box>
				);
			})}
			{maxScroll > 0 && (
				<Box marginTop={1}>
					<Text dimColor>{scrollOffset + 1}/{lines.length} (↑/↓ 滚动)</Text>
				</Box>
			)}
		</Box>
	);
}
