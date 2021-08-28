# 校验jsx引入的组件是否写有注释 (no-jsx-component-comments)

## 规则详情

该规则旨在确保自定义的组件或者业务组件有注释

此规则错误的代码示例：

```js

/* eslint-disable inquiry-eslint/no-jsx-component-comments */

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
}).run('no-jsx-component-comments', rule, {
  valid: [],
  invalid: [
    {
      code: `
        <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
      `,
      errors: [{
        message: '自定义组件或者业务组件必须要注释',
        type: 'JSXElement',
      }],
      output: `
        {/** Icon组件 */}
        <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
      `,
    },
  ],
});

```

此规则的正确代码示例:

```js

/* eslint-disable inquiry-eslint/no-jsx-component-comments */

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
}).run('no-jsx-component-comments', rule, {
  valid: [
    {
      code: `
        <div>test</div>
      `,
    },
    {
      code: `
        {/** Icon组件 */}
        <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
      `,
    },
    {
      code: `
        {/** 配件原图 */}
        <OeImageModal
          data={oeData as OeImageData}
          visible={epcInitVisible}
          onBackdropClick={() => setEpcInitVisible(false)}
        />
      `,
    },
  ],
  invalid: [],
});

```

## 何时不使用它

如果您没有编写可修复的规则，或者您想编写没有输出断言的测试用例，请不要启用此规则。

## 进一步了解

- [RuleTester documentation](https://eslint.org/docs/developer-guide/working-with-plugins#testing)

