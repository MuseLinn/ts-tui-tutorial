import {describe, it, expect, vi, beforeEach} from 'vitest';
import React from 'react';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import {render, delay} from '../test-helpers.js';
import {AppProvider} from '../../source/context/AppContext.js';
import QuizView from '../../source/components/QuizView.js';
import type {QuizStep, Lesson} from '../../source/data/types.js';

vi.mock('node:os', async () => {
	const actual = await vi.importActual('node:os') as typeof import('node:os');
	const tmpDir = path.join(actual.default.tmpdir(), `ts-tui-test-quiz-${Date.now()}`);
	return {
		default: {
			...actual.default,
			homedir: () => tmpDir,
		},
	};
});

const mockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
	id: 'lesson-1',
	title: 'Lesson 1',
	description: 'Desc',
	tier: 'beginner',
	prerequisites: [],
	estimatedMinutes: 5,
	steps: [],
	...overrides,
});

const mockQuizStep = (overrides: Partial<QuizStep> = {}): QuizStep => ({
	type: 'quiz',
	question: 'What is the type of 42?',
	options: [
		{label: 'string', value: 'string', isCorrect: false, explanation: 'Numbers are not strings.'},
		{label: 'number', value: 'number', isCorrect: true, explanation: '42 is a number.'},
	],
	allowMultiple: false,
	...overrides,
});

function renderWithApp(step: QuizStep) {
	const lessons = [mockLesson({steps: [step]})];
	return render(
		React.createElement(AppProvider, {lessons},
			React.createElement(QuizView, {step}),
		),
	);
}

describe('QuizView', () => {
	beforeEach(() => {
		const tmpDir = path.join(os.homedir(), '.ts-tui-tutorial');
		if (fs.existsSync(tmpDir)) {
			fs.rmSync(tmpDir, {recursive: true});
		}
	});

	it('renders the question', async () => {
		const step = mockQuizStep();
		const {lastFrame} = renderWithApp(step);
		await delay(100);
		expect(lastFrame()).toContain(step.question);
	});

	it('renders all options', async () => {
		const step = mockQuizStep();
		const {lastFrame} = renderWithApp(step);
		await delay(100);
		expect(lastFrame()).toContain('string');
		expect(lastFrame()).toContain('number');
	});
});
