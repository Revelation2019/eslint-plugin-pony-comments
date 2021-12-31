# 校验jsx引入的组件是否写有注释 (no-jsx-component-comments)

## 规则详情

该规则旨在确保自定义的组件有注释

此规则错误的代码示例：

```js

/* eslint-disable pony-comments/no-jsx-component-comments */

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
        <div>
          {(isThanTen && isFold ? filterList.slice(0, 10) : filterList).map(
            (quotationItemResult, index) => (
              <QuotationInformation
                quotationItemResult={quotationItemResult}
                demandItemId={demandItemId}
              />
            ),
          )}
        </div>
      `,
      errors: [{
        message: '自定义组件必须要写注释',
        type: 'JSXElement',
      }],
      options: ['always', { excludes: [], isDefault: true }],
      output: `
        <div>
          {(isThanTen && isFold ? filterList.slice(0, 10) : filterList).map(
            (quotationItemResult, index) => (
              {/** 自定义组件 */}
              <QuotationInformation
                quotationItemResult={quotationItemResult}
                demandItemId={demandItemId}
              />
            ),
          )}
        </div>
      `,
    },
    {
      code: `<span>种(共<Quantity space={4}>{number}</Quantity>件)商品</span>`,
      errors: [{
        message: '自定义组件必须要写注释',
        type: 'JSXElement',
      }],
      options: ['always', { excludes: [], isDefault: true }],
      output: `
        <span>种(共{/** 自定义组件 */}<Quantity space={4}>{number}</Quantity>件)商品</span>
      `,
    },
    {
      code: `
        <div>
          {
            list.map(() => (
              <AAA />
            ))
          }
        </div>
      `,
      errors: [{
        message: '自定义组件必须要写注释',
        type: 'JSXElement',
      }],
      options: ['always', { excludes: [], isDefault: true }],
      output: `
        <div>
          {
            list.map(() => (
              /** 自定义组件 */
              <AAA />
            ))
          }
        </div>
      `,
    },
    {
      code: `
        <div>
          {
            list.map(() => <AAA />)
          }
        </div>
      `,
      errors: [{
        message: '自定义组件必须要写注释',
        type: 'JSXElement',
      }],
      options: ['always', { excludes: [], isDefault: true }],
      output: `
        <div>
          {
            list.map(() => (
              /** 自定义组件 */
              <AAA />
            ))
          }
        </div>
      `,
    },
    {
      code: `
        <div className={styles.container}>
          {quotationResults.map((resolveResItem, serial) => {
            const { demandItemId = '' } = resolveResItem;
            /** 过滤轮胎规格不符合的需求 */
            return TyreFilter.specificationFilter(specificationIdsChecked, demandItemId) ? (
              <UserNeedWrap resolveResItem={resolveResItem} serial={serial} key={demandItemId} />
            ) : null;
          })}
        </div>
      `,
      errors: [{
        message: '自定义组件必须要写注释',
        type: 'JSXElement',
      }],
      options: ['always', { excludes: [], isDefault: true }],
      output: `
        <div className={styles.container}>
          {quotationResults.map((resolveResItem, serial) => {
            const { demandItemId = '' } = resolveResItem;
            /** 过滤轮胎规格不符合的需求 */
            return TyreFilter.specificationFilter(specificationIdsChecked, demandItemId) ? (
              {/** 自定义组件 */}
              <UserNeedWrap resolveResItem={resolveResItem} serial={serial} key={demandItemId} />
            ) : null;
          })}
        </div>
      `,
    },
    {
      code: `
        <div>
          <CustomComponent type="epc" className={styles.icon} onClick={handleEpcIconClick} />
        </div>
      `,
      errors: [{
        message: '自定义组件必须要写注释',
        type: 'JSXElement',
      }],
      options: ['always', { excludes: [], isDefault: true }],
      output: `
        <div>
          {/** 自定义组件 */}
          <CustomComponent type="epc" className={styles.icon} onClick={handleEpcIconClick} />
        </div>
      `,
    },
  ],
});

```

此规则的正确代码示例:

```js

/* eslint-disable pony-comments/no-jsx-component-comments */

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
      options: ['always', { excludes: [], isDefault: true }],
    },
    {
      code: `
        <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
      `,
      options: ['always', { excludes: [], isDefault: true }],
    },
    {
      code: `
        <div>
          {/** 自定义组件 */}
          <CustomComponent type="epc" className={styles.icon} onClick={handleEpcIconClick} />
        </div>
      `,
      options: ['always', { excludes: [], isDefault: true }],
    },
    {
      code: `
        {/** 自定义组件 */}
        <CustomComponent
          data={oeData as OeImageData}
          visible={epcInitVisible}
          onBackdropClick={() => setEpcInitVisible(false)}
        />
      `,
      options: ['always', { excludes: [], isDefault: true }],
    },
    {
      code: `
        {/** 自定义组件 */}
        <CustomComponent
          visible={isAbatePopup}
          title="提示"
          onClose={() => setUIStateValue({ isAbatePopup: false })}
          tipIcon={<Icon type="warn-circle" color="#F87D00" size={44} />}
          footer={<Button onClick={() => setUIStateValue({ isAbatePopup: false })}>我知道了</Button>}
        >
          <h3 className={styles.headline}>非常抱歉，该询价单已过期～</h3>
        </CustomComponent>
      `,
      options: ['always', { excludes: [], isDefault: true }],
    },
    {
      code: `
        <Modal mask visible={resultModalVisible} className={styles.container}>
          <Modal.Header onClose={() => toggleResultModal(false)}>
            <Text bold>提示</Text>
          </Modal.Header>
          <Modal.Content>

          </Modal.Content>
          <Modal.Footer>
            <Button onClick={() => toggleResultModal(true)}>立即查看</Button>
            <Button onClick={() => toggleResultModal(false)} outline>
              暂不查看
            </Button>
          </Modal.Footer>
        </Modal>
      `,
      options: ['always', { excludes: [], isDefault: true }],
    },
  ],
  invalid: [],
});

```

### 选项

此规则采用可选的枚举选项，其中包含以下值之一：

- `"excludes"` - 排除的自定义标签名
- `"isDefault"` - 是否启用默认的排除项
- `"always"` - 总是要求无效的测试用例有输出断言

## 何时不使用它

如果您没有编写可修复的规则，或者您想编写没有输出断言的测试用例，请不要启用此规则。

## 进一步了解

- [RuleTester documentation](https://eslint.org/docs/developer-guide/working-with-plugins#testing)

