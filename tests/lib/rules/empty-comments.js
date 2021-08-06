/**
 * @fileoverview 检查空内容注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const rule = require('../../../lib/rules/empty-comments');

const RuleTester = require('eslint').RuleTester;

const { config } = require('../utils');

const ruleTester = new RuleTester(config);
ruleTester.run('empty-comments', rule, {

  valid: [
    `// 提交  `,
    `/** 倒计时 */`,
    `/**
         * @description 校验单行或者多行注释内容是否为空
         * @param {String} value 注释内容
         * @returns {Boolean}
         */
        `,
  ],

  invalid: [
    {
      code: `//   `,
      errors: [{
        message: '注释内容不能为空',
        type: 'Line',
      }],
      output: '',
    },
    {
      code: `/**   */`,
      errors: [{
        message: '注释内容不能为空',
        type: 'Block',
      }],
      output: '',
    },
    {
      code: `
            /**
              *
              */`,
      errors: [{
        message: '注释内容不能为空',
        type: 'Block',
      }],
      output: '',
    },
  ],
});
