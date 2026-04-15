import {Box, Text} from 'ink';
import type {StageStatus} from '../engine/StageEngine.js';

const stageColors: Record<StageStatus, string> = {
	intro: 'blue',
	demo: 'cyan',
	quiz: 'yellow',
	practice: 'magenta',
	completed: 'green',
};

export default function TutorBanner({message, stage}: {message: string; stage: StageStatus}) {
	return (
		<Box
			height={2}
			paddingX={1}
			flexDirection="column"
			justifyContent="center"
		>
			<Text bold color="white" backgroundColor={stageColors[stage]}>
				{message}
			</Text>
		</Box>
	);
}
