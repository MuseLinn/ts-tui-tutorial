import type {Lesson} from '../../types.js';

export const lesson01Variables: Lesson = {
	id: '01-variables',
	title: '变量与类型注解',
	description: '学习什么是变量，以及如何用类型注解为变量贴上安全标签。',
	tier: 'beginner',
	prerequisites: [],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 什么是变量？\n\n' +
				'变量就像是程序里的"盒子"，用来存放数据。\n\n' +
				'在 JavaScript 中，我们用 `let` 或 `const` 来创建变量。\n\n' +
				'- `let`：可以重新赋值的变量\n' +
				'- `const`：一旦赋值就不能再改变的变量（常量）\n\n' +
				'TypeScript 的强大之处在于：我们可以在变量后面加上**类型注解**，告诉程序这个盒子里只能放什么类型的数据。',
		},
		{
			type: 'code-demo',
			code: `let name: string = "Alice";
const age: number = 20;
let isStudent: boolean = true;

// 类型注解就像给盒子贴标签
// name 只能放字符串
// age 只能放数字`,
			explanation:
				'- `let name: string` 表示 name 必须是字符串\n' +
				'- `const age: number` 表示 age 必须是数字\n' +
				'- `boolean` 表示只有 true 或 false 两种值',
		},
		{
			type: 'quiz',
			question: '下面哪个是正确的 TypeScript 变量声明？',
			allowMultiple: false,
			options: [
				{
					label: 'let name: string = "Tom";',
					value: 'a',
					isCorrect: true,
					explanation: '正确！我们用 `let` 声明变量，并用 `: string` 指定类型。',
				},
				{
					label: 'let name = string "Tom";',
					value: 'b',
					isCorrect: false,
					explanation: '错误。类型注解的写法是 `: string`，不是 `= string`。',
				},
				{
					label: 'string name = "Tom";',
					value: 'c',
					isCorrect: false,
					explanation: '错误。这是 Java/C# 的写法，TypeScript 需要在变量名后加类型。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请修复下面的类型错误。`age` 被声明为 `number` 类型，但我们给它赋了一个字符串。',
			initialCode: `let age: number = "20";
console.log(age);`,
			expectedCode: `let age: number = 20;
console.log(age);`,
			validationMode: 'tsc',
			hints: [
				'提示 1：仔细看 `age` 的类型注解是什么？',
				'提示 2：`number` 类型不应该加引号。',
				'答案：把 `"20"` 改成 `20`。',
			],
		},
	],
};
