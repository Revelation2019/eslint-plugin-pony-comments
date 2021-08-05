/**
 * @fileoverview 检查空内容注释
 * @author 周胜A02313
 */
"use strict";

const { isEmptyComments } = require('../utils');

module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: "检查空内容注释",
            category: "Fill me in",
            recommended: true
        },
        fixable: 'whitespace',  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        /** 删除空注释行 */
        const deleteLine = (node) => {
            
        }
        
        return {
            'Block': (node) => {
                const { value } = node;
                if (isEmptyComments(value)) {
                    context.report({
                        node,
                        message: '多行注释内容不能为空',
                    });
                }
            },
            'Line': (node) => {
                const { value } = node;
                if (isEmptyComments(value)) {
                    context.report({
                        node,
                        message: '单行注释内容不能为空',
                        fix: deleteLine(node)
                    });
                }
            },
        };
    }
};
