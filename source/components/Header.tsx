
import {Box, Text} from 'ink';

export default function Header() {
	return (
		<Box
			height={1}
			paddingX={1}
			borderStyle="single"
			borderTop={false}
			borderLeft={false}
			borderRight={false}
			borderBottom
			borderColor="cyan"
		>
			<Text bold color="cyan">TS Tutor</Text>
			<Box flexGrow={1} />
			<Text dimColor>沉浸式 TypeScript 学习终端</Text>
			<Box flexGrow={1} />
			<Text dimColor>[?] 帮助</Text>
		</Box>
	);
}
