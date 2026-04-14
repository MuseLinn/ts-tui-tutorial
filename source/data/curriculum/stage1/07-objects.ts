import type {Lesson} from '../../types.js';

export const lesson07Objects: Lesson = {
	id: '07-objects',
	title: '对象基础',
	description: '学习对象字面量的写法、属性访问，以及对象的基本形状。',
	tier: 'beginner',
	prerequisites: ['06-arrays'],
	estimatedMinutes: 5,
	steps: [
		{
			type: 'theory',
			content:
				'## 对象\n\n' +
				'对象是 JavaScript 中用来把多个相关数据组合在一起的方式。\n\n' +
				'它由**键值对**组成，每个键（属性名）对应一个值。\n\n' +
				'```\nconst 对象名 = {\n  属性名: 值,\n  属性名: 值\n};\n```',
		},
		{
			type: 'code-demo',
			code: `const user = {
  name: "Alice",
  age: 20,
  isStudent: true
};

console.log(user.name); // "Alice"
console.log(user["age"]); // 20

user.age = 21; // 修改属性值`,
			explanation:
				'- `user.name` 是点号访问属性\n' +
				'- `user["age"]` 是方括号访问属性\n' +
				'- 对象可以把不同类型的数据组合在一起',
		},
		{
			type: 'exercise',
			instructions:
				'请修复代码中的错误。`user` 对象有一个 `age` 属性，但代码试图访问不存在的 `ages` 属性。',
			initialCode: `const user = {
  name: "Tom",
  age: 25
};

console.log(user.ages);`,
			expectedCode: `const user = {
  name: "Tom",
  age: 25
};

console.log(user.age);`,
			validationMode: 'tsc',
			hints: [
				'提示 1：对象里定义的属性名是 `age`。',
				'提示 2：代码中写的是 `user.ages`，多了一个 `s`。',
				'答案：把 `user.ages` 改成 `user.age`。',
			],
		},
	],
};
