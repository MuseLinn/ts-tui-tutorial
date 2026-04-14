
import {Box, Text} from 'ink';

export default function Footer({view}: {view: string}) {
	const hints: Record<string, string> = {
		theory: '[←/→] 切换 | [↓/j] 下一条 | [q] 退出',
		'code-demo': '[←/→] 切换 | [q] 退出',
		quiz: '[↑/↓] 选择 | [Enter] 确认 | [←/→] 切换',
		exercise: '[h] 提示 | [r] 重置 | [Enter] 提交 | [←/→] 切换',
	};

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
			<Text dimColor>{hints[view] ?? '[q] 退出'}</Text>
		</Box>
	);
}
