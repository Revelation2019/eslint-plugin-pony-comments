/**
 * @fileoverview 没有类型定义单行注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
"use strict";

const { getAllComments, filterComments, isHeadBlockComments, isHeadLineComments, isTailLineComments, docsUrl } = require('../utils');

module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: "没有类型定义单行注释",
            category: "Fill me in",
            recommended: true,
            url: docsUrl('no-type-define-comments')
        },
        fixable: 'whitespace',  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function typeDefineCommentsParser(context) {
        /** 记录注释节点 */
        const comments = getAllComments(context);
        /** Line Comments */
        const lineComments = filterComments(comments, 'Line');
        /** Block Comments */
        const blockComments = filterComments(comments, 'Block');
        /** 判断类型头部是否存在单行或者多行注释，再或者存在行尾单行注释 */
        const isExistComments = (line) => {
            return isHeadBlockComments(blockComments, line) || isHeadLineComments(lineComments, line) || isTailLineComments(lineComments, line);
        }
        /** 生成默认单行注释 */
        const genLineComments = (node, value) => {
            return (fixer) => {
                return fixer.insertTextAfter(
                    node,
                    `// ${value}`
                );
            }
        }

        return {
            /** interface定义字段类型需要注释 */
            'TSPropertySignature': (node) => {
                const { loc, key } = node;
                const { start } = loc;
                const { line } = start;
                const { name } = key;
                if (!line || !isExistComments(line)) {
                    context.report({
                        node,
                        message: '类型定义的字段没有注释',
                        fix: genLineComments(node, name)
                    });
                }
            },
            /** enum定义字段类型需要注释 */
            'TSEnumDeclaration': (node) => {
                const { members } = node;
                if (!!members.length) {
                    members.forEach((tsEnmuMemberItem) => {
                        const { type, loc, initializer } = tsEnmuMemberItem;
                        const { start } = loc;
                        const { line } = start;
                        const { value } = initializer;
                        if (type === 'TSEnumMember' && !isExistComments(line)) {
                            context.report({
                                node,
                                message: '枚举定义的字段没有注释',
                                fix: genLineComments(node, value)
                            });
                        }
                    })
                }
            },
            /** type定义字段类型需要注释 */
            'TSTypeAliasDeclaration': (node) => {
                const { loc, id } = node;
                const { start } = loc;
                const { line } = start;
                const { name } = id;
                if (!isExistComments(line)) {
                    context.report({
                        node,
                        message: 'type定义的字段没有注释',
                        fix: genLineComments(node, name)
                    });
                }
            }
        };
    }
};
