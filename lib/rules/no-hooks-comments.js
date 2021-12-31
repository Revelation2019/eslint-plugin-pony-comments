/**
 * @fileoverview hooks使用注释校验
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

const {
  docsUrl,
  judgeNodeType,
  getComments,
  genHeadComments,
  report,
  getLastEle,
  getAllComments,
  isTailLineComments,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'hooks使用注释校验',
      category: 'Fill me in',
      recommended: true,
      url: docsUrl('no-hooks-comments'),
    },
    fixable: 'whitespace',  // or "code" or "whitespace"
    schema: [
      {
        'enum': ['always', 'never'],
      },
      {
        'type': 'object',
        'properties': {
          'excludes': {
            'type': 'array',
          },
          'commentsType': {
            'type': 'string',
          },
        },
        'additionalProperties': false,
      },
    ],
  },

  create: function(context) {
    const options = context.options;

    const excludes = options.length > 0 ? getLastEle(options).excludes : [];

    const commentsType = options.length > 0 ? getLastEle(options).commentsType : null;

    const comments = getAllComments(context);

    return {
      'CallExpression': (node) => {
        const { callee = {} } = node;
        const { name = '' } = callee;
        if (/use[A-Z][A-Za-z]+/.test(name) && !excludes.includes(name) && node.parent && judgeNodeType(node, 'VariableDeclarator') && node.parent.parent && judgeNodeType(node.parent, 'VariableDeclaration')) {
          // React Hooks、React Use、自定义Hooks需要写注释
          const { leading } = getComments(context, node.parent.parent);
          if (!leading.length && !isTailLineComments(comments, node.parent.parent)) {
            report(context, node.parent.parent, 'hooks没有写注释', genHeadComments(node.parent.parent, name, commentsType));
          }
        } else if (/use[A-Z][A-Za-z]+/.test(name) && !excludes.includes(name) && node.parent && judgeNodeType(node, 'ExpressionStatement')) {
          // React Hooks、React Use、自定义Hooks需要写注释
          const { leading } = getComments(context, node.parent);
          if (!leading.length && !isTailLineComments(comments, node.parent)) {
            report(context, node.parent, 'hooks没有写注释', genHeadComments(node.parent, name, commentsType));
          }
        }
      },
    };
  },
};
