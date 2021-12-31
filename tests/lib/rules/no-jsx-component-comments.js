/**
 * @fileoverview 校验jsx引入的组件是否写有注释
 * @author sheng zhou&lt;zhousheng_zuel@163.com&gt;
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-jsx-component-comments');

const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { config } = require('../utils');
const ruleTester = new RuleTester(config);
ruleTester.run('no-jsx-component-comments', rule, {

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
