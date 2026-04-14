import type {Lesson} from '../../types.js';

export const lesson04Conditionals: Lesson = {
	id: '04-conditionals',
	title: '条件判断',
	description: '学习 if/else 条件语句、boolean 类型和比较运算符。',
	tier: 'beginner',
	prerequisites: ['03-functions'],
	estimatedMinutes: 4,
	steps: [
		{
			type: 'theory',
			content:
				'## 条件判断\n\n' +
				'程序经常需要根据不同的情况做出不同的决定。\n\n' +
				'`if/else` 语句让我们可以检查某个条件是否成立，然后执行相应的代码。\n\n' +
				'- 比较运算符：`===`（严格等于）、`!==`（不等于）、`>`（大于）、`<`（小于）\n' +
				'- 结果类型是 `boolean`，只有 `true` 或 `false` 两种值',
		},
		{
			type: 'code-demo',
			code: `const age: number = 18;
const isAdult: boolean = age >= 18;

if (isAdult) {
  console.log("你已经成年了");
} else {
  console.log("你还未成年");
}`,
			explanation:
				'- `age >= 18` 的结果是 `boolean`\n' +
				'- `if (条件)` 中，条件必须是 boolean 类型\n' +
				'- 如果条件为 true，执行 if 块；否则执行 else 块',
		},
		{
			type: 'quiz',
			question: '下面哪个表达式的结果是 `boolean` 类型？',
			allowMultiple: false,
			options: [
				{
					label: '10 + 5',
					value: 'a',
					isCorrect: false,
					explanation: '错误。`10 + 5` 的结果是 `number`（15）。',
				},
				{
					label: 'age >= 18',
					value: 'b',
					isCorrect: true,
					explanation: '正确！比较运算符的结果总是 `boolean` 类型。',
				},
				{
					label: '"hello" + "world"',
					value: 'c',
					isCorrect: false,
					explanation: '错误。字符串拼接的结果是 `string` 类型。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请修复类型错误。`isPositive` 应该是 `boolean` 类型，但代码里把它赋成了字符串。',
			initialCode: `const score: number = 85;
const isPositive: boolean = "score > 0";

if (isPositive) {
  console.log("分数是正数");
}`,
			expectedCode: `const score: number = 85;
const isPositive: boolean = score > 0;

if (isPositive) {
  console.log("分数是正数");
}`,
			validationMode: 'tsc',
			hints: [
				'提示 1：`isPositive` 的类型是 `boolean`。',
				'提示 2：`"score > 0"` 是一个字符串，不是比较结果。',
				'答案：去掉引号，写成 `score > 0`。',
			],
		},
	],
};
