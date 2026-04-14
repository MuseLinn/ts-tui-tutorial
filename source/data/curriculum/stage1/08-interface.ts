import type {Lesson} from '../../types.js';

export const lesson08Interface: Lesson = {
	id: '08-interface',
	title: '接口入门',
	description: '学习使用 interface 为对象形状命名，让代码更加清晰和安全。',
	tier: 'beginner',
	prerequisites: ['07-objects'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 接口（interface）\n\n' +
				'当对象变得复杂时，我们可以用 `interface` 来描述它的"形状"。\n\n' +
				'`interface` 就像是一张蓝图，规定了对象必须有哪些属性，以及每个属性是什么类型。\n\n' +
				'```\ninterface 接口名 {\n  属性: 类型;\n}\n```',
		},
		{
			type: 'code-demo',
			code: `interface Person {
  name: string;
  age: number;
}

const alice: Person = {
  name: "Alice",
  age: 20
};

console.log(alice.name);`,
			explanation:
				'- `interface Person` 定义了一个名为 Person 的对象形状\n' +
				'- `name: string` 和 `age: number` 是必须有的属性\n' +
				'- `const alice: Person` 表示 alice 必须符合这个形状',
		},
		{
			type: 'quiz',
			question: '`interface` 的主要作用是什么？',
			allowMultiple: false,
			options: [
				{
					label: '创建一个新的类',
					value: 'a',
					isCorrect: false,
					explanation: '错误。`interface` 不是用来创建类的，而是用来描述对象形状的。',
				},
				{
					label: '描述对象应该有哪些属性和类型',
					value: 'b',
					isCorrect: true,
					explanation: '正确！`interface` 就是一张对象的类型蓝图。',
				},
				{
					label: '声明一个变量',
					value: 'c',
					isCorrect: false,
					explanation: '错误。声明变量用 `let` 或 `const`，不是 `interface`。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请修复类型错误。`Book` 接口要求 `pages` 属性是 `number` 类型，但代码中给了一个字符串。',
			initialCode: `interface Book {
  title: string;
  pages: number;
}

const myBook: Book = {
  title: "TypeScript 入门",
  pages: "200"
};`,
			expectedCode: `interface Book {
  title: string;
  pages: number;
}

const myBook: Book = {
  title: "TypeScript 入门",
  pages: 200
};`,
			validationMode: 'tsc',
			hints: [
				'提示 1：`pages` 的类型在 `Book` 接口中被定义为 `number`。',
				'提示 2：`"200"` 是一个字符串，不是数字。',
				'答案：把 `"200"` 改成 `200`。',
			],
		},
	],
};
