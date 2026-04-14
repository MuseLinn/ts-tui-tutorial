import type {Lesson} from '../../types.js';

export const lesson09OptionalProperties: Lesson = {
	id: '09-optional-properties',
	title: '可选属性',
	description: '学习如何在接口和对象中使用可选属性（?），以及如何处理可能缺失的数据。',
	tier: 'beginner',
	prerequisites: ['08-interface'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 可选属性\n\n' +
				'有时候，对象的某些属性可能存在，也可能不存在。\n\n' +
				'在 TypeScript 中，我们可以在属性名后面加一个问号 `?`，把它变成**可选属性**：\n\n' +
				'`interface 用户 {\n  name: string;\n  age?: number;\n}`' +
				'\n\n' +
				'- `name` 是必填的\n' +
				'- `age?` 是可选的，可以写也可以不写',
		},
		{
			type: 'code-demo',
			code: `interface User {
  name: string;
  age?: number;
}

const tom: User = { name: "Tom" };
const jerry: User = { name: "Jerry", age: 25 };

// 读取可选属性时，值可能是 undefined
const age = tom.age; // undefined`,
			explanation:
				'- `age?: number` 表示 age 属性可有可无\n' +
				'- 访问可选属性时，TypeScript 知道它可能是 `undefined`\n' +
				'- 这在处理表单、配置文件等场景时非常有用',
		},
		{
			type: 'quiz',
			question: '下面哪个接口正确声明了可选属性？',
			allowMultiple: false,
			options: [
				{
					label: 'interface Car { brand: string; price?: number; }',
					value: 'a',
					isCorrect: true,
					explanation: '正确！`price?: number` 把 price 声明为可选属性。',
				},
				{
					label: 'interface Car { brand: string; price: ?number; }',
					value: 'b',
					isCorrect: false,
					explanation: '错误。问号应该放在属性名后面，不是类型前面。',
				},
				{
					label: 'interface Car { brand: string; optional price: number; }',
					value: 'c',
					isCorrect: false,
					explanation: '错误。TypeScript 没有 `optional` 关键字，使用 `?` 即可。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请把 `email` 属性改为可选属性，这样代码才能正常通过类型检查。',
			initialCode: `interface Person {
  name: string;
  email: string;
}

const person: Person = { name: "Alice" };`,
			expectedCode: `interface Person {
  name: string;
  email?: string;
}

const person: Person = { name: "Alice" };`,
			validationMode: 'tsc',
			hints: [
				'提示 1：错误信息说缺少 `email` 属性。',
				'提示 2：在 `email` 后面加一个问号 `?`。',
				'答案：把 `email: string` 改成 `email?: string`。',
			],
		},
	],
};
