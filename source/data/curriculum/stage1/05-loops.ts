import type {Lesson} from '../../types.js';

export const lesson05Loops: Lesson = {
	id: '05-loops',
	title: '循环语句',
	description: '学习 for 循环和 while 循环，以及如何为循环变量添加类型注解。',
	tier: 'beginner',
	prerequisites: ['04-conditionals'],
	estimatedMinutes: 4,
	steps: [
		{
			type: 'theory',
			content:
				'## 循环\n\n' +
				'循环让我们可以重复执行一段代码。\n\n' +
				'- `for` 循环：适合知道要循环多少次的情况\n' +
				'- `while` 循环：适合只要条件满足就继续循环的情况\n\n' +
				'在 TypeScript 中，循环变量也可以加上类型注解，让它更加安全。',
		},
		{
			type: 'code-demo',
			code: `// for 循环
for (let i: number = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}

// while 循环
let count: number = 0;
while (count < 3) {
  console.log(count);
  count++;
}`,
			explanation:
				'- `for (let i: number = 0; i < 3; i++)` 中，`i` 是 number 类型\n' +
				'- `i++` 表示每次循环后 i 增加 1\n' +
				'- `while` 循环会在条件为 true 时一直执行',
		},
		{
			type: 'exercise',
			instructions:
				'请为 `for` 循环的变量 `i` 添加 `number` 类型注解，并修复循环条件中的类型错误。',
			initialCode: `for (let i = 0; i < "5"; i++) {
  console.log(i);
}`,
			expectedCode: `for (let i: number = 0; i < 5; i++) {
  console.log(i);
}`,
			validationMode: 'tsc',
			hints: [
				'提示 1：循环变量 `i` 缺少类型注解。',
				'提示 2：`"5"` 是字符串，不能和 `number` 类型的 `i` 进行比较。',
				'答案：把 `let i` 改成 `let i: number`，把 `"5"` 改成 `5`。',
			],
		},
	],
};
