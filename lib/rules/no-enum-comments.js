/**
 * @fileoverview 校验枚举的注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const {
  judgeNodeType,
  getComments,
  report,
  docsUrl,
  genHeadComments,
  getLastEle,
  isTailLineComments,
  getAllComments,
  getNodeStartColumn,
  getTokenAfter,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: '校验枚举的注释',
      category: 'Fill me in',
      recommended: true,
      url: docsUrl('no-enum-comments'),
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
    const { pos, commentsType } = propertyComments;
    /** 记录注释节点 */
    const comments = getAllComments(context);
    const commentsTypeArr = ['No', 'Line', 'Block'];

    return {
      /** 枚举头部需要注释 */
      'TSEnumDeclaration': (node) => {
        /** 不需要头部注释 */
        if (leadingCommentsType === 'No' || !commentsTypeArr.includes(leadingCommentsType)) return;
        const { id } = node;
        const { name } = id;
        if (judgeNodeType(node, 'ExportNamedDeclaration')) {
          /** export enum XXX {} */
          const { leading } = getComments(context, node.parent);
          if (!leading.length) {
            report(context, node.parent, '导出的枚举头部没有注释', genHeadComments(node.parent, name, leadingCommentsType));
          }
        } else {
          /** enum XXX {} */
          const { leading } = getComments(context, node);
          if (!leading.length) {
            report(context, node, '枚举头部没有注释', genHeadComments(node, name, leadingCommentsType));
          }
        }
      },
      /** 枚举字段注释 */
      'TSEnumMember': (node) => {
        if (commentsType === 'No' || !commentsTypeArr.includes(commentsType)) return;
        if (judgeNodeType(node, 'TSEnumDeclaration')) {
          const { id } = node;
          const { type, name, value } = id;
          /** 默认注释文案 */
          const content = type === 'Literal' ? value : type === 'Identifier' ? name : '';
          const { leading } = getComments(context, node);
          const errorMsg = '枚举定义的字段没有注释';
					
          if (isTailLineComments(comments, node) || (leading.length &&  getNodeStartColumn(getLastEle(leading)) === getNodeStartColumn(node))) {
            /** 节点尾部有注释 或者 头部有注释并且注释开头与节点开头列数相同 */
            return;
          }

          if (commentsType === 'Block' || (commentsType === 'Line' && pos === 'lead')) {
            report(context, node, errorMsg, genHeadComments(node, content, commentsType));
          } else {
            report(context, node, errorMsg, (fixer) => {
              return fixer.insertTextAfter(getTokenAfter(context, node), `// ${content}`);
            });
          }
        }
      },
    };
  },
};
