/**
 * @fileoverview 没有类型定义单行注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const {
  getAllComments,
  isTailLineComments,
  docsUrl,
  genLineComments,
  genHeadComments,
  getComments,
  judgeNodeType,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: '没有类型定义单行注释',
      category: 'Fill me in',
      recommended: true,
      url: docsUrl('no-type-define-comments'),
    },
    fixable: 'whitespace',  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function typeDefineCommentsParser(context) {
    /** 记录注释节点 */
    const comments = getAllComments(context);

    return {
      /** interface定义字段类型需要注释 */
      'TSPropertySignature': (node) => {
        const { loc, key } = node;
        const { end } = loc;
        const { line } = end;
        const { name } = key;
        const { leading } = getComments(context, node);
        if (!leading.length && !isTailLineComments(comments, line)) {
          context.report({
            node,
            message: '类型定义的字段没有注释',
            fix: genLineComments(node, name),
          });
        }
      },
      /** enum定义字段类型需要注释 */
      'TSEnumDeclaration': (node) => {
        const { members, id } = node;
        const { name } = id;
        if (judgeNodeType(node, 'ExportNamedDeclaration')) {
          /** export enum XXX {} */
          const { leading } = getComments(context, node.parent);
          if (!leading.length) {
            context.report({
              node: node.parent,
              message: '导出的枚举头部没有注释',
              fix: genHeadComments(node.parent, name),
            });
          }
        } else {
          /** enum XXX {} */
          const { leading } = getComments(context, node);
          if (!leading.length) {
            context.report({
              node: node,
              message: '枚举头部没有注释',
              fix: genHeadComments(node, name),
            });
          }
        }
        /** 校验枚举字段是否有注释 */
        if (members.length) {
          members.forEach((tsEnmuMemberItem) => {
            const { loc, initializer } = tsEnmuMemberItem;
            const { end } = loc;
            const { line } = end;
            const { value } = initializer;
            const { leading } = getComments(context, tsEnmuMemberItem);
            if (!leading.length && !isTailLineComments(comments, line)) {
              context.report({
                node,
                message: '枚举定义的字段没有注释',
                fix: genLineComments(node, value),
              });
            }
          });
        } else {
          context.report({
            node,
            message: '枚举没有定义字段',
          });
        }
      },
      /** type定义字段类型需要注释 */
      'TSTypeAliasDeclaration': (node) => {
        const { loc, id } = node;
        const { end } = loc;
        const { line } = end;
        const { name } = id;
        if (judgeNodeType(node, 'ExportNamedDeclaration')) {
          const { leading } = getComments(context, node.parent);
          if (!leading.length && !isTailLineComments(comments, line)) {
            context.report({
              node: node.parent,
              message: '导出type定义的字段没有注释',
              fix: genHeadComments(node.parent, name),
            });
          }
        } else {
          const { leading } = getComments(context, node);
          if (!leading.length && !isTailLineComments(comments, line)) {
            context.report({
              node: node,
              message: 'type定义的字段没有注释',
              fix: genHeadComments(node, name),
            });
          }
        }
      },
    };
  },
};
