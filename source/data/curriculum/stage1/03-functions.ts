import type {Lesson} from '../../types.js';

export const lesson03Functions: Lesson = {
	id: '03-functions',
	title: '函数基础',
	description: '学习如何定义函数，并为参数和返回值添加类型注解。',
	tier: 'beginner',
	prerequisites: ['02-operators'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 函数与类型\n\n' +
				'函数是 JavaScript 中最重要的概念之一。它接收输入（参数），进行处理，然后返回输出。\n\n' +
				'在 TypeScript 中，我们可以为函数的**参数**和**返回值**都加上类型注解：\n\n' +
				'`function 函数名(参数: 参数类型): 返回值类型 { ... }`',
		},
		{
			type: 'code-demo',
			code: `function greet(name: string): string {
  return "Hello, " + name;
}

function add(a: number, b: number): number {
  return a + b;
}

const result: string = greet("TS"); // "Hello, TS"`,
			explanation:
				'- `name: string` 表示参数必须是字符串\n' +
				'- `: string` 在括号后表示函数返回字符串\n' +
				'- 调用函数时，TypeScript 会检查参数类型是否匹配',
		},
		{
			type: 'exercise',
			instructions:
				'请为 `multiply` 函数的参数添加 `number` 类型注解，并修复调用时的类型错误。',
			initialCode: `function multiply(a, b) {
  return a * b;
}

const result: number = multiply("3", 4);`,
			expectedCode: `function multiply(a: number, b: number): number {
  return a * b;
}

const result: number = multiply(3, 4);`,
			validationMode: 'tsc',
			hints: [
				'提示 1：参数 `a` 和 `b` 缺少类型注解。',
				'提示 2：`multiply("3", 4)` 传入了一个字符串。',
				'答案：参数写成 `(a: number, b: number)`，调用时写成 `multiply(3, 4)`。',
			],
		},
	],
};
