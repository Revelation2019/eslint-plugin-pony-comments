# 函数类型注释校验 (no-function-comments)

## 规则详情

该规则旨在确保函数定义（函数组件、声明式函数、函数表达式）时有注释

此规则错误的代码示例：

```js

/* eslint-disable pony-comments/no-function-comments */

new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    comment: true,
    useJSXTextNode: true,
  },
}).run('no-function-comments', rule, {
  valid: [],
  invalid: [
    {
      code: `
        function submit() {}
      `,
      errors: [{
        message: '函数必须要注释',
        type: 'FunctionDeclaration',
      }],
      options: ['always', { commentsType: 'Block' }],
      output: `
        /** 提交 */
        function submit() {}
      `,
    },
    {
      code: `
        const aaa = 11; // aaa
        const submit = () => {}
      `,
      errors: [{
        message: '函数必须要注释',
        type: 'ArrowFunctionExpression',
      }],
      options: ['always', { commentsType: 'Block' }],
      output: `
        const aaa = 11; // aaa
        /** 提交 */
        const submit = () => {}
      `,
    },
    {
      code: `
        export const Main = () => {}
      `,
      errors: [{
        message: '函数必须要注释',
        type: 'ArrowFunctionExpression',
      }],
      options: ['always', { commentsType: 'Block' }],
      output: `
        /** Main */
        export const Main = () => {}
      `,
    },
    {
      code: `
        class Main extends React.Component {
          countDown() {}
          submit = () => {}
          reset = () => {}
          render() {}
        }
      `,
      errors: [{
        message: 'class组件中除声明周期钩子不需要有注释外，其他定义的函数必须要有',
        type: 'ArrowFunctionExpression',
      }],
      options: ['always', { commentsType: 'Block' }],
      output: `
        class Main extends React.Component {
          /** 计时器 */
          countDown() {}
          /** 提交 */
          submit = () => {}
          /** 重置 */
          reset = () => {}
          render() {}
        }
      `,
    },
    {
      code: `
        /** Main组件 */
        const Main = (props: IProps) => {
          useEffect(() => {});
          const countDown = () => {}
          const reset = () => {}
          const submit = () => {}
        }
      `,
      errors: [{
        message: '函数组件中定义的函数必须要有',
        type: 'ArrowFunctionExpression',
      }],
      options: ['always', { commentsType: 'Block' }],
      output: `
        /** Main组件 */
        const Main = (props: IProps) => {
          useEffect(() => {});
          /** 计时器 */
          const countDown = () => {}
          /** 重置 */
          const reset = () => {}
          /** 提交 */
          const submit = () => {}
          render() {}
        }
      `,
    },
  ],
});

```

此规则的正确代码示例:

```js

/* eslint-disable pony-comments/no-function-comments */

new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    comment: true,
    useJSXTextNode: true,
  },
}).run('no-function-comments', rule, {
  valid: [
    {
      code: `
        /** 提交 */
        function submit() {}
      `,
      options: ['always', { commentsType: 'Block' }],
    },
    {
      code: `
        /** 提交 */
        const submit = () => {
          let nowWidth;
        }
      `,
      options: ['always', { commentsType: 'Block' }],
    },
    {
      code:  `
        /** 提交 */
        export const submit = () => {}
      `,
      options: ['always', { commentsType: 'Block' }],
    },
    {
      code: `
        /** Main组件 */
        const Main = (props: IProps) => {
          useEffect(() => {});
          /** 计时器 */
          const countDown = () => {}
          /** 重置 */
          const reset = () => {}
          /** 提交 */
          const submit = () => {}
        }
      `,
      options: ['always', { commentsType: 'Block' }],
    },
    {
      code: `
        class Main extends React.Component {
          useEffect(() => {});
          /** 计时器 */
          countDown() {}
          // 提交
          submit = () => {}
          // 重置
          reset = () => {}
          render() {}
        }
      `,
      options: ['always', { commentsType: 'Line' }],
    },
  ],
  invalid: [],
});

```

### 选项

此规则采用可选的枚举选项，其中包含以下值之一：

- `"commentsType"` - 注释类型
  - `"No"`：表示不需要头部注释
  - `"Line"`: 表示头部需要单行注释
  - `"Block"`：表示头部需要多行注释
- `"always"` - 总是要求无效的测试用例有输出断言

## 何时不使用它

如果您没有编写可修复的规则，或者您想编写没有输出断言的测试用例，请不要启用此规则。

## 进一步了解

- [RuleTester documentation](https://eslint.org/docs/developer-guide/working-with-plugins#testing)

