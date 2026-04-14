import type {Lesson} from '../../types.js';

export const lesson12Stage1Review: Lesson = {
	id: '12-stage1-review',
	title: '第一阶段复习',
	description: '通过修复一个小型"用户资料"函数，复习 Stage 1 的所有知识点。',
	tier: 'beginner',
	prerequisites: ['11-any-vs-unknown'],
	estimatedMinutes: 8,
	steps: [
		{
			type: 'theory',
			content:
				'## Stage 1 复习\n\n' +
				'恭喜你来到 Stage 1 的最后一课！让我们快速回顾一下学过的内容：\n\n' +
				'1. **变量与类型注解** (`: string`, `: number`, `: boolean`)\n' +
				'2. **运算符与表达式** (`+`, `-`, `*`, `/`, 比较运算符等)\n' +
				'3. **函数基础** (参数类型、返回值类型)\n' +
				'4. **接口 (interface)** 定义对象结构\n' +
				'5. **可选属性** (`?`)\n' +
				'6. **类型别名** (`type`)\n' +
				'7. **any vs unknown** (安全与不安全)\n\n' +
				'接下来，请修复一段包含多个类型错误的"用户资料"代码。',
		},
		{
			type: 'exercise',
			instructions:
				'下面的 `createUserProfile` 函数有多个类型错误。请修复它们：\n' +
				'1. `userId` 应该是 `string` 类型\n' +
				'2. `age` 应该是 `number` 类型\n' +
				'3. `Profile` 类型中 `bio` 应该是可选属性\n' +
				'4. `createUserProfile` 的返回值类型应该是 `Profile`\n' +
				'5. `isActive` 被错误地赋值为字符串',
			initialCode: `type Profile = {
  userId: string;
  name: string;
  age: number;
  bio: string;
  isActive: boolean;
};

function createUserProfile(id, name, age) {
  const profile = {
    userId: id,
    name: name,
    age: "unknown",
    isActive: "true",
  };
  return profile;
}

const p = createUserProfile("u001", "Alice", 25);`,
			expectedCode: `type Profile = {
  userId: string;
  name: string;
  age: number;
  bio?: string;
  isActive: boolean;
};

function createUserProfile(id: string, name: string, age: number): Profile {
  const profile: Profile = {
    userId: id,
    name: name,
    age: age,
    isActive: true,
  };
  return profile;
}

const p = createUserProfile("u001", "Alice", 25);`,
			validationMode: 'tsc',
			hints: [
				'提示 1：`id`、`name`、`age` 参数缺少类型注解。',
				'提示 2：`bio` 应该是可选属性 `bio?: string`。',
				'提示 3：`age: "unknown"` 类型不对，应该是数字。',
				'提示 4：`isActive: "true"` 是字符串，应该改成布尔值 `true`。',
				'提示 5：函数返回值可以加上 `: Profile`，变量 `profile` 也可以加上类型注解。',
			],
		},
	],
};
