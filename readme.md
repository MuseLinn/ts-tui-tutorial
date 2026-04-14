# TS TUI Tutorial

一个基于 **Ink** 构建的全屏沉浸式终端交互式 TypeScript 学习应用。

> **目标**：让零基础（甚至 JS 都不太熟）的用户，在终端里通过理论讲解、代码演示、实时测验和"修复类型错误"的练习，逐步掌握 TypeScript 开发。

---

## 功能特性

- **全屏沉浸式 TUI**：侧边栏课程导航 + 主内容区 + 底部快捷键提示
- **三段式学习闭环**：Theory（理论） → Code Demo（代码示例） → Quiz（测验） → Exercise（动手练习）
- **实时类型检查**：集成 TypeScript Compiler API，在内存中对用户代码进行毫秒级类型诊断
- **真实终端代码编辑器**：支持多行编辑、光标移动（↑↓←→）、Enter 换行、Tab 缩进
- **自动保存进度**：断点续学，自动记录到 `~/.ts-tui-tutorial/progress.json`
- **渐进式解锁**：前置课程掌握后自动解锁后续章节

---

## 技术栈

| 技术 | 用途 |
|------|------|
| [Ink](https://github.com/vadimdemedes/ink) | React for CLI，全屏终端 UI |
| [TypeScript Compiler API](https://github.com/microsoft/TypeScript) | 内存中实时类型检查（`noEmit`） |
| [@inkjs/ui](https://github.com/vadimdemedes/ink-ui) | 菜单选择、进度条等交互组件 |
| [Vitest](https://vitest.dev/) | 单元测试 |

---

## 安装与运行

### 克隆项目

```bash
git clone https://github.com/MuseLinn/ts-tui-tutorial.git
cd ts-tui-tutorial
```

### 安装依赖

```bash
npm install
```

### 开发运行（直接运行 TS 源码）

```bash
npm start
```

> **注意**：Ink 依赖终端的 `raw mode` 来处理键盘输入。如果在非交互式环境（如某些 IDE 内置的只读终端、子进程、管道）中运行，可能会看到 `Raw mode is not supported on the current process.stdin` 的错误。请在真正的交互式终端（Windows Terminal、VS Code 集成终端、PowerShell、CMD、WSL）中运行。

### 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 运行测试

```bash
npx vitest run
```

---

## 键盘操作

| 按键 | 功能 |
|------|------|
| `↑ / ↓` 或 `j / k` | 切换课程 |
| `← / →` | 切换当前课程的步骤（理论 / 代码 / 测验 / 练习） |
| `Enter` | 确认选择 / 提交练习 |
| `Tab` | 在代码编辑器中输入 4 个空格 |
| `h` | 显示提示（练习模式） |
| `r` | 重置当前练习代码 |
| `q` | 退出应用并自动保存进度 |

---

## 项目结构

```
ts-tui-tutorial/
├── source/
│   ├── components/          # Ink UI 组件
│   │   ├── CodeEditor.tsx   # 多行终端代码编辑器
│   │   ├── ExerciseView.tsx # 练习界面
│   │   ├── Layout.tsx       # 整体布局
│   │   ├── Sidebar.tsx      # 课程导航
│   │   └── ...
│   ├── context/
│   │   └── AppContext.tsx   # 全局状态管理（React Context + useReducer）
│   ├── data/
│   │   ├── curriculum/      # 课程数据
│   │   │   └── stage1/      # Stage 1：JS + TS 基础（12 节课）
│   │   └── types.ts         # 类型定义
│   ├── engine/
│   │   ├── ExerciseEngine.ts    # 练习校验逻辑
│   │   └── LessonEngine.ts      # 课程解锁与完成逻辑
│   ├── services/
│   │   ├── TscService.ts        # TypeScript 编译器封装
│   │   └── ProgressRepo.ts      # 进度持久化
│   ├── app.tsx
│   └── cli.tsx
├── tests/                   # Vitest 测试
├── docs/                    # 架构设计文档
└── package.json
```

---

## 课程大纲

### Stage 1：JS + TS 基础入门（12 节课）

| 课号 | 标题 | 核心概念 |
|------|------|----------|
| 01 | 变量与类型注解 | `let`/`const`，`string`/`number`/`boolean` |
| 02 | 运算符与表达式 | 算术、比较、逻辑运算 |
| 03 | 函数基础 | 参数/返回值类型注解 |
| 04 | 条件判断 | `if/else`，`boolean` 类型 |
| 05 | 循环结构 | `for`/`while`，循环变量推断 |
| 06 | 数组 | `number[]`/`string[]`，`push`/`length` |
| 07 | 对象 | 对象字面量，属性访问 |
| 08 | Interface | 用 `interface` 命名对象形状 |
| 09 | 可选属性 | `?` 标记，可选参数 |
| 10 | 类型别名 | `type` 关键字，`type` vs `interface` |
| 11 | Any 与 Unknown | 不安全类型 vs 需要收窄的 `unknown` |
| 12 | 第一阶段复习 | 综合项目：修复一个小型用户资料函数 |

---

## 测试

测试使用 **Vitest**，覆盖了核心引擎和服务：

```bash
npx vitest run
```

**测试覆盖**：
- `TscService`：虚拟文件编译、类型错误诊断、中文友好化错误翻译
- `ExerciseEngine`：`tsc` / `exact-match` / `contains` 三种校验模式
- `LessonEngine`：课程解锁规则、完成得分计算

当前状态：**21 个测试全部通过**。

---

## 架构设计

详见 [`docs/架构设计文档.md`](docs/架构设计文档.md)。

---

## License

MIT
