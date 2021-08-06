/**
 * @fileoverview 校验代码注释规范
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const requireIndex = require('requireindex');

// import all rules in lib/rules
const rules = requireIndex(__dirname + '/rules');

module.exports = {
  rules,
  configs: {
    plugin: 'pony-comments',
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2018,
    },
    recommended: {
      rules: {
        'pony-comments/no-function-comments': [2, 'always', 'Block'],
        'pony-comments/no-type-define-comments': 2,
        'pony-comments/empty-comments': 2,
      },
    },
  },
};

