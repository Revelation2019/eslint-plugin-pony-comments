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
  getLastEle,
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
      'TSInterfaceDeclaration': (node) => {
        const { id } = node;
        const { name } = id;
        if (judgeNodeType(node, 'ExportNamedDeclaration')) {
          /** export enum XXX {} */
          const { leading } = getComments(context, node.parent);
          if (!leading.length) {
            context.report({
              node: node.parent,
              message: '导出的类型头部没有注释',
              fix: genHeadComments(node.parent, name),
            });
          }
        } else {
          /** enum XXX {} */
          const { leading } = getComments(context, node);
          if (!leading.length) {
            context.report({
              node: node,
              message: '类型头部没有注释',
              fix: genHeadComments(node, name),
            });
          }
        }
      },
      /** interface定义字段类型需要注释 */
      'TSPropertySignature': (node) => {
        const { loc, key } = node;
        const { end, start } = loc;
        const { line } = end;
        const { name } = key;
        const { leading } = getComments(context, node);
        /** 节点前注释开头列位不等于节点开头列位，意味着节点前没有注释 */
        // eslint-disable-next-line max-len
        if (!isTailLineComments(comments, line) && (!leading.length || getLastEle(leading).loc.start.column !== start.column)) {
          context.report({
            node,
            message: '类型定义的字段没有注释',
            fix: genLineComments(node, name),
          });
        }
      },
      /** 枚举头部需要注释 */
      'TSEnumDeclaration': (node) => {
        const { id } = node;
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
      },
      /** 枚举字段需要注释 */
      'TSEnumMember': (node) => {
        const { loc, id } = node;
        const { end } = loc;
        const { line } = end;
        const { type, name, value } = id;
        const content = type === 'Literal' ? value : type === 'Identifier' ? name : '';
        const { leading } = getComments(context, node);
        if (!leading.length && !isTailLineComments(comments, line)) {
          context.report({
            node,
            message: '枚举定义的字段没有注释',
            fix: genHeadComments(node, content),
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
              message: '导出type定义的类型没有注释',
              fix: genHeadComments(node.parent, name),
            });
          }
        } else {
          const { leading } = getComments(context, node);
          if (!leading.length && !isTailLineComments(comments, line)) {
            context.report({
              node: node,
              message: 'type定义的类型没有注释',
              fix: genHeadComments(node, name),
            });
          }
        }
      },
    };
  },
};
