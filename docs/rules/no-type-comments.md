# type类型定义注释校验 (no-type-comments)

## 规则详情

该规则旨在确保 `type` 类型定义时有注释

此规则错误的代码示例：

```js

/* eslint-disable pony-comments/no-type-comments */

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
}).run('no-type-comments', rule, {
  valid: [],
  invalid: [
    {
      code: `
        export type IPinkageType =
        | 'ORDER_AMOUNT'
        | 'PRODUCT_AMOUNT'
        | 'ORDER_AMOUNT_SUBSIDY_LIMIT'
        | 'NOLIMIT';
      `,
      errors: [{
        message: 'type定义的类型没有注释',
        type: 'TSTypeAliasDeclaration',
      }],
      options: ['always', { commentsType : 'Block' }],
      output: `
        /** 包邮 */
        export type IPinkageType =
        | 'ORDER_AMOUNT'
        | 'PRODUCT_AMOUNT'
        | 'ORDER_AMOUNT_SUBSIDY_LIMIT'
        | 'NOLIMIT';
      `,
    },
  ],
});

```

此规则的正确代码示例:

```js

/* eslint-disable pony-comments/no-type-comments */

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
}).run('no-type-comments', rule, {
  valid: [
    {
      code: `
        /** 包邮 */
        export type IPinkageType =
        | 'ORDER_AMOUNT'
        | 'PRODUCT_AMOUNT'
        | 'ORDER_AMOUNT_SUBSIDY_LIMIT'
        | 'NOLIMIT';
      `,
      options: ['always', { commentsType : 'Block' }],
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

