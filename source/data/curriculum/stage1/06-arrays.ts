import type {Lesson} from '../../types.js';

export const lesson06Arrays: Lesson = {
	id: '06-arrays',
	title: '数组基础',
	description: '学习 TypeScript 中的数组类型表示法，以及常用的数组方法。',
	tier: 'beginner',
	prerequisites: ['05-loops'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 数组\n\n' +
				'数组是用来存放一组相同类型数据的"列表"。\n\n' +
				'在 TypeScript 中，我们用 `类型[]` 来表示数组。例如：\n\n' +
				'- `number[]` 表示数字数组\n' +
				'- `string[]` 表示字符串数组\n\n' +
				'常用的数组方法有 `push`（添加元素）、`length`（获取长度）等。',
		},
		{
			type: 'code-demo',
			code: `const scores: number[] = [85, 90, 78];
const names: string[] = ["Alice", "Bob"];

scores.push(92); // 添加新分数
console.log(scores.length); // 4

console.log(names[0]); // "Alice"`,
			explanation:
				'- `number[]` 表示这个数组里只能放数字\n' +
				'- `push` 可以在数组末尾添加新元素\n' +
				'- 用 `[索引]` 可以访问数组中的某个元素，索引从 0 开始',
		},
		{
			type: 'quiz',
			question: '如何声明一个只能存放字符串的数组？',
			allowMultiple: false,
			options: [
				{
					label: 'const items: string[] = ["a", "b"];',
					value: 'a',
					isCorrect: true,
					explanation: '正确！`string[]` 表示字符串数组。',
				},
				{
					label: 'const items: array(string) = ["a", "b"];',
					value: 'b',
					isCorrect: false,
					explanation: '错误。TypeScript 中数组的写法是 `类型[]`，不是 `array(类型)`。',
				},
				{
					label: 'const items: String = ["a", "b"];',
					value: 'c',
					isCorrect: false,
					explanation: '错误。`String` 表示单个字符串，不是数组。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请修复类型错误。`ages` 是一个 `number[]` 数组，但代码中尝试向它 push 一个字符串。',
			initialCode: `const ages: number[] = [10, 20, 30];
ages.push("40");
console.log(ages.length);`,
			expectedCode: `const ages: number[] = [10, 20, 30];
ages.push(40);
console.log(ages.length);`,
			validationMode: 'tsc',
			hints: [
				'提示 1：`ages` 的类型是 `number[]`。',
				'提示 2：`"40"` 是一个字符串，不能放入数字数组。',
				'答案：把 `"40"` 改成 `40`。',
			],
		},
	],
};
