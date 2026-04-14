import {Box, Text} from 'ink';
import {i18n} from '../i18n/zh-CN.js';

export default function Footer({view}: {view: string}) {
	const hint =
		i18n.footer[view as keyof typeof i18n.footer] ?? i18n.footer.theory;

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
