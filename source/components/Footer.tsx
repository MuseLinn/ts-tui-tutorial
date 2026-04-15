import {Box, Text} from 'ink';
import type {StageStatus} from '../engine/StageEngine.js';

export default function Footer({stageStatus, lastResult}: {stageStatus: StageStatus; lastResult: 'idle' | 'correct' | 'incorrect'}) {
	let hint = '';
	switch (stageStatus) {
		case 'intro':
		case 'demo':
			hint = '[Enter] 继续';
			break;
		case 'quiz': {
			if (lastResult === 'incorrect') {
				hint = '[Enter] 再试一次';
			} else if (lastResult === 'correct') {
				hint = '✅ 正确！即将进入练习...';
			} else {
				hint = '[↑/↓] 选择 [Enter] 确认';
			}

			break;
		}

		case 'practice': {
			if (lastResult === 'incorrect') {
				hint = '💪 继续修改，Ctrl+Enter 提交';
			} else if (lastResult === 'correct') {
				hint = '✅ 通过！即将完成本课...';
			} else {
				hint = '[Ctrl+Enter] 提交 [Ctrl+H] 提示 [Ctrl+R] 重置';
			}

			break;
		}

		case 'completed':
			hint = '[Enter] 进入下一课';
			break;
	}

	return (
		<Box
			height={1}
			paddingX={1}
			borderStyle="single"
			borderTop
			borderLeft={false}
			borderRight={false}
			borderBottom={false}
			borderColor="gray"
		>
			<Text dimColor>{hint}</Text>
		</Box>
	);
}
