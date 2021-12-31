/**
 * @fileoverview interface定义类型注释校验
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

const {
  docsUrl,
  getLastEle,
  getAllComments,
  judgeNodeType,
  getComments,
  genHeadComments,
  report,
  isTailLineComments,
  getNodeStartColumn,
  genLineComments,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'interface定义类型注释校验',
      category: 'Fill me in',
      recommended: true,
      url: docsUrl('no-interface-comments'),
    },
    fixable: 'whitespace',  // or "code" or "whitespace"
    schema: [
      {
        'enum': ['always', 'never'],
      },
      {
        'type': 'object',
        'properties': {
          /**
					 * 是否需要头部注释
					 * 'No'：表示不需要头部注释
					 * 'Line': 表示头部需要单行注释
					 * 'Block'：表示头部需要多行注释
					 */
          'leadingCommentType': {
            'type': 'string',
          },
          /** 字段注释采用单行还是多行注释 */
          'propertyComments': {
            'type': 'object',
            'properties': {
              'pos': {
                'type': 'string', // lead || tail
              },
              'commentsType': {
                'type': 'string', // No || Line || Block
              },
              // 忽略某些字段，不用注释，比如store
              'ignore': {
                type: 'array',
              },
            },
          },
        },
        'additionalProperties': false,
      },
    ],
  },

  create: function(context) {
    const options = context.options;
    const leadingCommentsType = options.length > 0 ? getLastEle(options).leadingCommentType : null;
    const propertyComments = options.length > 0 ? getLastEle(options).propertyComments : {};
    const { pos, commentsType, ignore = [] } = propertyComments;
    /** 记录注释节点 */
    const comments = getAllComments(context);
    const commentsTypeArr = ['No', 'Line', 'Block'];

    return {
      /** 校验interface定义头部注释 */
      'TSInterfaceDeclaration': (node) => {
        /** 不需要头部注释 */
        if (leadingCommentsType === 'No' || !commentsTypeArr.includes(leadingCommentsType)) return;
        const { id } = node;
        const { name } = id;
        if (judgeNodeType(node, ['ExportNamedDeclaration', 'ExportDefaultDeclaration'])) {
          /**
           * export interface XXX {}
           * export default interface XXX {}
          */
          const { leading } = getComments(context, node.parent);
          if (!leading.length) {
            report(context, node.parent, '导出的类型头部没有注释', genHeadComments(node.parent, name, leadingCommentsType));
          }
        } else {
          /** enum interface {} */
          const { leading } = getComments(context, node);
          if (!leading.length) {
            report(context, node, '类型头部没有注释', genHeadComments(node, name, leadingCommentsType));
          }
        }
      },
      /** 校验interface定义字段注释 */
      'TSPropertySignature': (node) => {
        if (commentsType === 'No' || !commentsTypeArr.includes(commentsType)) return;
        /** 避免 export const Main = (props: { name: string }) => {} */
        if (judgeNodeType(node, 'TSInterfaceBody')) {
          const { key } = node;
          const { name } = key;
          /** 跳过某些字段的注释检查 */
          if (ignore.length && ignore.some((ig) => name.indexOf(ig) !== -1)) return;
          const { leading } = getComments(context, node);
          const errorMsg = '类型定义的字段没有注释';
          if (isTailLineComments(comments, node) || (leading.length &&  getNodeStartColumn(getLastEle(leading)) === getNodeStartColumn(node))) {
            /** 节点尾部有注释 或者 头部有注释并且注释开头与节点开头列数相同 */
            return;
          }

          if (commentsType === 'Block' || (commentsType === 'Line' && pos === 'lead')) {
            report(context, node, errorMsg, genHeadComments(node, name, commentsType));
          } else {
            report(context, node, errorMsg, genLineComments(node, name));
          }
        }
      },
    };
  },
};
