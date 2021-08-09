/**
 * @fileoverview 没有类型定义单行注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const rule = require('../../../lib/rules/no-type-comments');

const RuleTester = require('eslint').RuleTester;

const { config } = require('../utils');
const ruleTester = new RuleTester(config);
ruleTester.run('no-type-comments', rule, {

  valid: [
    `
    /** 包邮 */
    export type IPinkageType =
    | 'ORDER_AMOUNT'
    | 'PRODUCT_AMOUNT'
    | 'ORDER_AMOUNT_SUBSIDY_LIMIT'
    | 'NOLIMIT';
    `,
  ],

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
