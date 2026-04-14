import type {Lesson} from '../../types.js';

export const lesson10TypeAlias: Lesson = {
	id: '10-type-alias',
	title: '类型别名',
	description: '学习 type 关键字，以及类型别名与接口的基础区别。',
	tier: 'beginner',
	prerequisites: ['09-optional-properties'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 类型别名（Type Alias）\n\n' +
				'除了 `interface`，TypeScript 还提供了 `type` 关键字来定义类型。\n\n' +
				'`type 类型名 = { ... }`\n\n' +
				'对于对象类型，`type` 和 `interface` 的效果非常相似。\n\n' +
				'简单的区别：\n' +
				'- `interface` 更适合定义对象的结构\n' +
				'- `type` 更灵活，可以给任何类型起别名（包括基本类型、联合类型等）',
		},
		{
			type: 'code-demo',
			code: `type User = {
  name: string;
  age: number;
};

// type 也可以给基本类型起别名
type UserID = string;

const user: User = { name: "Tom", age: 20 };
const id: UserID = "u123";`,
			explanation:
				'- `type User = { ... }` 定义了一个对象类型别名\n' +
				'- `type UserID = string` 给 string 起了一个更易读的名字\n' +
				'- 在初学者阶段，`type` 和 `interface` 定义对象时几乎可以互换',
		},
		{
			type: 'quiz',
			question: '下面关于 type 和 interface 的说法，哪个是正确的？',
			allowMultiple: false,
			options: [
				{
					label: 'type 可以给基本类型起别名，interface 不行',
					value: 'a',
					isCorrect: true,
					explanation: '正确！比如 `type UserID = string` 是合法的，但 `interface` 不能这样写。',
				},
				{
					label: 'interface 可以写等号，type 不能写等号',
					value: 'b',
					isCorrect: false,
					explanation: '错误。恰恰相反：`type` 需要等号，`interface` 不需要等号。',
				},
				{
					label: 'type 和 interface 定义的对象类型完全不一样',
					value: 'c',
					isCorrect: false,
					explanation: '错误。对于简单的对象类型，它们非常相似，很多时候可以互换。',
				},
			],
		},
		{
			type: 'exercise',
			instructions:
				'请用 `type` 关键字定义一个 `Book` 类型，包含 `title`（string）和 `pages`（number）两个属性。',
			initialCode: `Book = {
  title: string;
  pages: number;
};

const book: Book = { title: "TypeScript 入门", pages: 200 };`,
			expectedCode: `type Book = {
  title: string;
  pages: number;
};

const book: Book = { title: "TypeScript 入门", pages: 200 };`,
			validationMode: 'tsc',
			hints: [
				'提示 1：`type` 定义需要以 `type` 关键字开头。',
				'提示 2：写法是 `type 名称 = { ... };`。',
				'答案：在 `Book` 前面加上 `type `。',
			],
		},
	],
};
