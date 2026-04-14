import type {Lesson} from '../../types.js';

export const lesson11AnyVsUnknown: Lesson = {
	id: '11-any-vs-unknown',
	title: 'Any 与 Unknown',
	description: '理解 any 的不安全性，以及 unknown 为什么需要类型收窄。',
	tier: 'beginner',
	prerequisites: ['10-type-alias'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## any 与 unknown\n\n' +
				'TypeScript 有两个特殊的类型：\n\n' +
				'### `any`\n' +
				'`any` 表示"任意类型"。一旦变量被标记为 `any`，TypeScript 就会**完全放弃**对它的类型检查。\n\n' +
				'### `unknown`\n' +
				'`unknown` 也表示"任意类型"，但它更安全。你不能直接使用 `unknown` 类型的值，必须先通过类型检查（类型收窄）。',
		},
		{
			type: 'code-demo',
			code: `let a: any = "hello";
a.toFixed(); // TypeScript 不会报错，但运行时会崩溃！

let u: unknown = "hello";
// u.toFixed(); // 报错！不能直接使用 unknown

// 需要先收窄类型
if (typeof u === "string") {
  u.toUpperCase(); // 安全！
}`,
			explanation:
				'- `any` 会绕过所有类型检查，容易导致运行时错误\n' +
				'- `unknown` 不允许直接调用方法或赋值给具体类型\n' +
				'- 使用 `typeof` 检查后可以安全地操作 `unknown`',
		},
		{
			type: 'quiz',
			question: '下面关于 any 和 unknown 的说法，哪个是正确的？',
			allowMultiple: false,
			options: [
				{
					label: 'any 会关闭类型检查，unknown 需要先确认类型才能使用',
					value: 'a',
					isCorrect: true,
					explanation: '正确！`any` 很危险，`unknown` 强制你在使用前进行类型检查。',
				},
				{
					label: 'any 和 unknown 完全是一样的',
					value: 'b',
					isCorrect: false,
					explanation: '错误。`any` 会跳过类型检查，而 `unknown` 会强制类型安全。',
				},
				{
					label: 'unknown 比 any 更危险',
					value: 'c',
					isCorrect: false,
					explanation: '错误。`unknown` 更安全，因为它要求你先确认类型。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请把 `data` 的类型从 `any` 改成 `unknown`，然后用 `typeof` 检查后再调用 `.toUpperCase()`。',
			initialCode: `let data: any = "hello";
const result = data.toUpperCase();`,
			expectedCode: `let data: unknown = "hello";

let result = "";
if (typeof data === "string") {
  result = data.toUpperCase();
}`,
			validationMode: 'tsc',
			hints: [
				'提示 1：把 `any` 改成 `unknown`。',
				'提示 2：`unknown` 类型的值不能直接调用方法。',
				'提示 3：用 `if (typeof data === "string")` 包裹调用代码。',
			],
		},
	],
};
