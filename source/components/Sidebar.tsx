
import {Box, Text, useInput} from 'ink';
import {useApp} from '../context/AppContext.js';
import {isLessonUnlocked} from '../engine/LessonEngine.js';

export default function Sidebar({showHelp}: {showHelp: boolean}) {
	const {state, dispatch} = useApp();
	const {lessons, progress, currentLessonId} = state;

	useInput((input, key) => {
		if (showHelp) return;
		const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
		if (key.upArrow || input === 'k') {
			for (let i = currentIndex - 1; i >= 0; i--) {
				if (isLessonUnlocked(lessons[i]!, progress)) {
					dispatch({type: 'SET_LESSON', payload: lessons[i]!.id});
					break;
				}
			}
		}

		if (key.downArrow || input === 'j') {
			for (let i = currentIndex + 1; i < lessons.length; i++) {
				if (isLessonUnlocked(lessons[i]!, progress)) {
					dispatch({type: 'SET_LESSON', payload: lessons[i]!.id});
					break;
				}
			}
		}
	});

	return (
		<Box
			width={18}
			flexDirection="column"
			borderStyle="single"
			borderTop={false}
			borderBottom={false}
			borderLeft={false}
			borderColor="gray"
			paddingX={1}
		>
			<Text bold underline>课程导航</Text>
			<Box height={1} />
			{lessons.map((lesson, idx) => {
				const isCompleted = progress.completedLessons[lesson.id];
				const isActive = lesson.id === currentLessonId;
				const unlocked = isLessonUnlocked(lesson, progress);
				const icon = isCompleted ? '✅' : isActive ? '▶️' : unlocked ? '○' : '🔒';
				const color = isActive ? 'cyan' : unlocked ? 'white' : 'gray';

				return (
					<Box key={lesson.id}>
						<Text color={color} dimColor={!isActive && !unlocked}>
							{icon} {String(idx + 1).padStart(2, '0')} {lesson.title.slice(0, 8)}
						</Text>
					</Box>
				);
			})}
		</Box>
	);
}
