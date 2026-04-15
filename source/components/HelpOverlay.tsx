import {Box, Text} from 'ink';
import {i18n} from '../i18n/zh-CN.js';

export default function HelpOverlay() {
	const {help} = i18n;

	return (
		<Box
			flexDirection="column"
			position="absolute"
			width="100%"
			height="100%"
			paddingX={4}
			paddingY={2}
		>
			<Box marginBottom={1}>
				<Text bold color="white">{help.title}</Text>
			</Box>

			<Section title={help.globalNav}>
				<KeyLine keys={help.keys.upDown} desc={help.keys.lessonSwitch} />
				<KeyLine keys={help.keys.leftRight} desc={help.keys.stepSwitch} />
				<KeyLine keys={help.keys.enter} desc={help.keys.confirm} />
				<KeyLine keys={help.keys.ctrlEnter} desc={help.keys.submitExercise} />
				<KeyLine keys={help.keys.q} desc={help.keys.quit} />
			</Section>

			<Section title={help.exerciseMode}>
				<KeyLine keys={help.keys.tab} desc={help.keys.indent} />
				<KeyLine keys={help.keys.ctrlH} desc={help.keys.hint} />
				<KeyLine keys={help.keys.ctrlR} desc={help.keys.reset} />
			</Section>

			<Box marginTop={2}>
				<Text color="white">按 {help.keys.questionMark} {help.keys.toggleHelp}</Text>
			</Box>
		</Box>
	);
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
	return (
		<Box flexDirection="column" marginY={1}>
			<Text bold color="cyan">{title}</Text>
			<Box marginLeft={2} flexDirection="column">{children}</Box>
		</Box>
	);
}

function KeyLine({keys, desc}: {keys: string; desc: string}) {
	return (
		<Box>
			<Text color="yellow" bold>{keys.padEnd(20)}</Text>
			<Text> {desc}</Text>
		</Box>
	);
}
