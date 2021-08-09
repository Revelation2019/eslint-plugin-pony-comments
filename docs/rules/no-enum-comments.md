# 校验枚举的注释 (no-enum-comments)

## 规则详情

该规则旨在确保枚举定义时有注释说明

此规则错误的代码示例：

```js

/* eslint-disable pony-comments/no-enum-comments */

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
}).run('no-enum-comments', rule, {
  valid: [],
  invalid: [
    {
      code: `
        enum CouponType {
          /** 打折 */
          DISCOUNT = 'DISCOUNT',
          /** 满减 */
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
      errors: [{
        message: '枚举头部需要注释',
        type: 'TSEnumDeclaration',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
        /** 优惠券类型 */
        enum CouponType {
          /** 打折 */
          DISCOUNT = 'DISCOUNT',
          /** 满减 */
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
    },
    {
      code: `
        /** 优惠券类型 */
        enum CouponType {
          DISCOUNT = 'DISCOUNT',
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
      errors: [{
        message: '枚举字段需要注释',
        type: 'TSEnumMember',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
        /** 优惠券类型 */
        enum CouponType {
          /** 打折 */
          DISCOUNT = 'DISCOUNT',
          /** 满减 */
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
    },
  ],
});

```

此规则的正确代码示例:

```js

/* eslint-disable pony-comments/no-enum-comments */

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
}).run('no-enum-comments', rule, {
  valid: [
    {
      code: `
      /** 优惠券类型 */
      enum CouponType {
        /** 打折 */
        DISCOUNT = 'DISCOUNT',
        /** 满减 */
        REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
      }
      `,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
    },
    {
      code: `
      // 优惠券类型
      enum CouponType {
        DISCOUNT = 'DISCOUNT', // 打折
        REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE', // 满减
      }
      `,
      options: ['always', { leadingCommentType: 'Line', propertyComments: { pos: 'tail', commentsType: 'Line' } }],
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
