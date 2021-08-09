/**
 * @fileoverview 没有类型定义单行注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const {
  getAllComments,
  isTailLineComments,
  docsUrl,
  genHeadComments,
  getComments,
  judgeNodeType,
  getLastEle,
  report,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: '没有类型定义单行注释',
      category: 'Fill me in',
      recommended: true,
      url: docsUrl('no-type-comments'),
    },
    fixable: 'whitespace',  // or "code" or "whitespace"
    // schema用于定义context.options
    // [2, 'always', { commentsType: 'Line' | 'Block' }]
    schema: [
      {
        'enum': ['always', 'never'],
      },
      {
        'type': 'object',
        'properties': {
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
    const commentsType = options.length > 0 ? getLastEle(options).commentsType : null;
    /** 记录注释节点 */
    const comments = getAllComments(context);

    return {
      /** type定义字段类型需要注释 */
      'TSTypeAliasDeclaration': (node) => {
        const { id } = node;
        const { name } = id;
        if (judgeNodeType(node, 'ExportNamedDeclaration')) {
          const { leading } = getComments(context, node.parent);
          if (!leading.length && !isTailLineComments(comments, node)) {
            report(context, node.parent, '导出type定义的类型没有注释', genHeadComments(node.parent, name, commentsType));
          }
        } else {
          const { leading } = getComments(context, node);
          if (!leading.length && !isTailLineComments(comments, node)) {
            report(context, node, 'type定义的类型没有注释', genHeadComments(node, name, commentsType));
          }
        }
      },
    };
  },
};
