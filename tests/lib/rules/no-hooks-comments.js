/**
 * @fileoverview hooks使用注释
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

const rule = require('../../../lib/rules/no-hooks-comments');

const RuleTester = require('eslint').RuleTester;

const { config } = require('../utils');
const ruleTester = new RuleTester(config);
ruleTester.run('no-hooks-comments', rule, {

  valid: [
    {
      code: `
        /** state */
        const [state, setState] = useState();
      `,
      options: ['always', { excludes: [], commentsType : 'Block' }],
    },
    {
      code: `
        const [displayStoreList, setStoreList] = useState([] as IStoreInfo[]); // 用来展示搜索结果
      `,
      options: ['always', { excludes: [], commentsType : 'Block' }],
    },
  ],

  invalid: [
    {
      code: `
        const [state, setState] = useState();
      `,
      errors: [{
        message: 'hooks没有写注释',
        type: 'CallExpression',
      }],
      options: ['always', { excludes: [], commentsType : 'Block' }],
      output: `
        /** state */
        const [state, setState] = useState();
      `,
    },
  ],
});
