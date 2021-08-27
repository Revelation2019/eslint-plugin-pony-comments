/**
 * @fileoverview 校验jsx引入的组件是否写有注释
 * @author sheng zhou&lt;sheng.zhou@casstime.com&gt;
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
      options: ['always', { commentsType: 'Block' }],
    },
    {
      code: `
         /** Icon组件 */
         <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
       `,
      options: ['always', { commentsType: 'Block' }],
    },
    {
      code: `
         /** 配件原图 */
         <OeImageModal
           data={oeData as OeImageData}
           visible={epcInitVisible}
           onBackdropClick={() => setEpcInitVisible(false)}
         />
       `,
      options: ['always', { commentsType: 'Block' }],
    },
  ],

  invalid: [
    {
      code: `
         <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
       `,
      errors: [{
        message: '自定义组件或者业务组件必须要注释',
        type: 'JSXElement',
      }],
      options: ['always', { commentsType: 'Block' }],
      output: `
         /** Icon组件 */
         <Icon type="epc" className={styles.icon} onClick={handleEpcIconClick} />
       `,
    },
  ],
});

