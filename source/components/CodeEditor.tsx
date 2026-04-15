import {useState, useCallback, useMemo, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';

export interface CodeEditorProps {
	code: string;
	onChange: (code: string) => void;
	height?: number;
	showLineNumbers?: boolean;
	focus?: boolean;
	onSubmit?: (code: string) => void;
}

function indexToLineCol(code: string, index: number): {line: number; column: number} {
	let line = 0;
	let column = 0;
	const clampedIndex = Math.max(0, Math.min(index, code.length));
	for (let i = 0; i < clampedIndex; i++) {
		if (code[i] === '\n') {
			line++;
			column = 0;
		} else {
			column++;
		}
	}
	return {line, column};
}

function lineColToIndex(code: string, line: number, column: number): number {
	const lines = code.split('\n');
	let index = 0;
	for (let i = 0; i < line && i < lines.length; i++) {
		index += (lines[i] ?? '').length + 1; // +1 for newline
	}
	const targetLine = lines[line];
	if (targetLine !== undefined) {
		index += Math.min(column, targetLine.length);
	}
	return Math.min(index, code.length);
}

export default function CodeEditor({
	code,
	onChange,
	height = 10,
	showLineNumbers = true,
	focus = true,
	onSubmit,
}: CodeEditorProps) {
	const [cursorIndex, setCursorIndex] = useState(code.length);
	const [scrollOffset, setScrollOffset] = useState(0);

	useEffect(() => {
		setCursorIndex(prev => Math.min(prev, code.length));
	}, [code]);

	const lines = useMemo(() => code.split('\n'), [code]);
	const {line: cursorLine, column: cursorColumn} = useMemo(
		() => indexToLineCol(code, cursorIndex),
		[code, cursorIndex],
	);

	const updateCursorAndScroll = useCallback(
		(newIndex: number, targetCode: string) => {
			const clampedIndex = Math.max(0, Math.min(newIndex, targetCode.length));
			setCursorIndex(clampedIndex);

			const {line} = indexToLineCol(targetCode, clampedIndex);
			let newScroll = scrollOffset;
			if (line < scrollOffset) {
				newScroll = line;
			} else if (line >= scrollOffset + height) {
				newScroll = line - height + 1;
			}
			setScrollOffset(Math.max(0, newScroll));
		},
		[height, scrollOffset],
	);

	useInput(
		(input, key) => {
			if (key.upArrow) {
				if (cursorLine > 0) {
					const prevLine = lines[cursorLine - 1];
					const newColumn = Math.min(cursorColumn, prevLine?.length ?? 0);
					const newIndex = lineColToIndex(code, cursorLine - 1, newColumn);
					updateCursorAndScroll(newIndex, code);
				}
				return;
			}

			if (key.downArrow) {
				if (cursorLine < lines.length - 1) {
					const nextLine = lines[cursorLine + 1];
					const newColumn = Math.min(cursorColumn, nextLine?.length ?? 0);
					const newIndex = lineColToIndex(code, cursorLine + 1, newColumn);
					updateCursorAndScroll(newIndex, code);
				}
				return;
			}

			if (key.leftArrow) {
				updateCursorAndScroll(cursorIndex - 1, code);
				return;
			}

			if (key.rightArrow) {
				updateCursorAndScroll(cursorIndex + 1, code);
				return;
			}

			if (key.backspace) {
				if (cursorIndex > 0) {
					const newCode = code.slice(0, cursorIndex - 1) + code.slice(cursorIndex);
					onChange(newCode);
					updateCursorAndScroll(cursorIndex - 1, newCode);
				}
				return;
			}

			if (key.delete) {
				if (cursorIndex < code.length) {
					const newCode = code.slice(0, cursorIndex) + code.slice(cursorIndex + 1);
					onChange(newCode);
					updateCursorAndScroll(cursorIndex, newCode);
				}
				return;
			}

			if (key.return && (key.ctrl || key.meta)) {
				onSubmit?.(code);
				return;
			}

			if (key.return) {
				const newCode = code.slice(0, cursorIndex) + '\n' + code.slice(cursorIndex);
				onChange(newCode);
				updateCursorAndScroll(cursorIndex + 1, newCode);
				return;
			}

			if (input === '\t' || key.tab) {
				const indent = '    ';
				const newCode = code.slice(0, cursorIndex) + indent + code.slice(cursorIndex);
				onChange(newCode);
				updateCursorAndScroll(cursorIndex + indent.length, newCode);
				return;
			}

			// Regular character input
			if (input && !key.ctrl && !key.meta) {
				const newCode = code.slice(0, cursorIndex) + input + code.slice(cursorIndex);
				onChange(newCode);
				updateCursorAndScroll(cursorIndex + input.length, newCode);
			}
		},
		{isActive: focus},
	);

	const visibleLines = lines.slice(scrollOffset, scrollOffset + height);
	const lineNumberWidth = String(lines.length).length;

	return (
		<Box flexDirection="column" width="100%">
			{visibleLines.map((line, visibleIndex) => {
				const actualLineIndex = scrollOffset + visibleIndex;
				const isCursorLine = actualLineIndex === cursorLine;

				return (
					<Box key={actualLineIndex} flexDirection="row">
						{showLineNumbers && (
							<Box width={lineNumberWidth + 2} marginRight={1}>
								<Text dimColor color="gray">
									{String(actualLineIndex + 1).padStart(lineNumberWidth, ' ')}
								</Text>
							</Box>
						)}
						<Box flexDirection="row" flexGrow={1}>
							{isCursorLine ? (
								<>
									<Text>{line.slice(0, cursorColumn)}</Text>
									{cursorColumn >= line.length ? (
										<Text inverse backgroundColor="white" color="black">
											{' '}
										</Text>
									) : (
										<Text inverse backgroundColor="white" color="black">
											{line[cursorColumn]}
										</Text>
									)}
									<Text>{line.slice(cursorColumn + 1)}</Text>
								</>
							) : (
								<Text>{line}</Text>
							)}
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}
