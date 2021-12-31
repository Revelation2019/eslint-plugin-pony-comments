/**
 * @fileoverview 校验代码注释规范
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

const requireIndex = require('requireindex');

// import all rules in lib/rules
const rules = requireIndex(__dirname + '/rules');

module.exports = {
  rules,
  configs: {
    recommended: {
      plugins: ['pony-comments'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
      },
      rules: {
        'pony-comments/empty-comments': 2,
        'pony-comments/no-function-comments': [2, 'always', { commentsType: 'Block' }],
        'pony-comments/no-jsx-component-comments': [1, 'always', { excludes: [], isDefault: true }],
        'pony-comments/no-hooks-comments': [1, 'always', { excludes: ['useEffect'], commentsType: 'Block' }],
        'pony-comments/no-type-comments': [2, 'always', { commentsType: 'Block' }],
        'pony-comments/no-interface-comments': [2, 'always', { leadingCommentType: 'Block', propertyComments: { pos: 'tail', commentsType: 'Line', ignore: ['Store'] } }],
        'pony-comments/no-enum-comments': [2, 'always', { leadingCommentType: 'Block', propertyComments: { pos: 'tail', commentsType: 'Line' } }],
      },
    },
  },
};

