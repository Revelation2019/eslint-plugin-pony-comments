# interface类型定义注释校验 (no-interface-comments)

## 规则详情

该规则旨在确保 `interface` 类型定义时有注释

此规则错误的代码示例：

```js

/* eslint-disable pony-comments/no-interface-comments */

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
}).run('no-interface-comments', rule, {
  valid: [],
  invalid: [
    {
      code: `
        export interface IType {
          /** id */
          id: string;
          /** 姓名 */
          name: string;
          /** 年龄 */
          age: number;
        }
      `,
      errors: [{
        message: 'interface头部必须加上注释',
        type: 'TSInterfaceDeclaration',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
        /** 类型 */
        export interface IType {
          /** id */
          id: string;
          /** 姓名 */
          name: string;
          /** 年龄 */
          age: number;
        }
      `,
    },
    {
      code: `
        /** 类型 */
        interface IType {
          id: string;
          name: string;
          age: number;
        }
      `,
      errors: [{
        message: 'interface字段必须加上注释',
        type: 'TSPropertySignature',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
        /** 类型 */
        interface IType {
          /** id */
          id: string;
          /** 姓名 */
          name: string;
          /** 年龄 */
          age: number;
        }
      `,
    },
  ],
});

```

此规则的正确代码示例:

```js

/* eslint-disable pony-comments/no-interface-comments */

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
}).run('no-interface-comments', rule, {
  valid: [
    {
      code: `
        export const Main = (props: { name: string }) => {}
      `,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
    },
    {
      code: `
        /** 类型 */
        export interface IType {
          id: string; // id
          name: string; // 姓名
          age: number; // 年龄
        }
      `,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'tail', commentsType: 'Line' } }],
    },
    {
      code: `
        /** 类型 */
        interface IType {
          /** id */
          id: string;
          /** 姓名 */
          name: string;
          /** 年龄 */
          age: number;
        }
      `,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
    },
  ],
  invalid: [],
});

```

### 选项

此规则采用可选的枚举选项，其中包含以下值之一：
- `"leadingCommentType"` - 指定头部注释类型

  - `"No"`：表示不需要头部注释
  - `"Line"`: 表示头部需要单行注释
  - `"Block"`：表示头部需要多行注释

- `"propertyComments"` - 指定枚举字段注释类型

  - `"pos"` - 注释的位置
    - `"tail"`：行尾
    - `"lead"`：行头
  - `"commentsType"` - 注释类型
    - `"No"`：表示不需要头部注释
    - `"Line"`: 表示头部需要单行注释
    - `"Block"`：表示头部需要多行注释
- `"always"` - 总是要求无效的测试用例有输出断言

## 何时不使用它

如果您没有编写可修复的规则，或者您想编写没有输出断言的测试用例，请不要启用此规则。

## 进一步了解

- [RuleTester documentation](https://eslint.org/docs/developer-guide/working-with-plugins#testing)
