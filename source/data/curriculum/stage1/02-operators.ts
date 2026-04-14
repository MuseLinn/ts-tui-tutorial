import type {Lesson} from '../../types.js';

export const lesson02Operators: Lesson = {
	id: '02-operators',
	title: '运算符与表达式',
	description: '学习 JavaScript 中的基本运算符，以及运算结果的类型。',
	tier: 'beginner',
	prerequisites: ['01-variables'],
	estimatedMinutes: 4,
	steps: [
		{
			type: 'theory',
			content:
				'## 运算符与类型\n\n' +
				'当我们对变量进行运算时，TypeScript 也会检查结果的类型。\n\n' +
				'- 算术运算符：`+` `-` `*` `/` `%` → 结果通常是 `number`\n' +
				'- 比较运算符：`===` `!==` `>` `<` → 结果总是 `boolean`\n' +
				'- 逻辑运算符：`&&` `||` `!` → 结果通常是 `boolean`',
		},
		{
			type: 'code-demo',
			code: `const a: number = 10;
const b: number = 3;

const sum: number = a + b;      // 13
const isGreater: boolean = a > b; // true
const message: string = "Hello, " + "TS"; // "Hello, TS"`,
			explanation:
				'- `a + b` 结果是 number\n' +
				'- `a > b` 结果是 boolean\n' +
				'- 字符串相加 `+` 结果是 string',
		},
		{
			type: 'exercise',
			instructions:
				'请修复类型错误。`result` 应该是数字运算的结果，但代码里把它写成了字符串。',
			initialCode: `const x: number = 5;
const y: number = 10;
const result: number = x + " y";`,
			expectedCode: `const x: number = 5;
const y: number = 10;
const result: number = x + y;`,
			validationMode: 'tsc',
			hints: [
				'提示 1：`result` 的类型是 `number`。',
				'提示 2：`x + " y"` 会把数字和字符串拼接，结果是 `string`。',
				'答案：把 `" y"` 改成 `y`。',
			],
		},
	],
};
