/**
 * @fileoverview class组件和函数组件中定义的函数必须要有注释
 * @author 周胜A02313
 */
"use strict";

var os = require("os");
const { getAllComments, getComments, filterComments, isHeadLineComments, isHeadBlockComments, judgeNodeType } = require('../utils');

module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: "class组件和函数组件中定义的函数必须要有注释",
            category: "Fill me in",
            recommended: true, // 是配置文件中的"extends": "eslint:recommended"属性是否启用规则
        },
        fixable: 'whitespace',  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function functionDefineCommentsParser(context) {

        const options = context.options;
        /** 记录注释节点 */
        const comments = getAllComments(context);
        /** Line Comments */
        const lineComments = filterComments(comments, 'Line');
        /** Block Comments */
        const blockComments = filterComments(comments, 'Block');
        /** class组件中生命周期钩子 */
        const classComponentHooks = [
            'render', 
            'constructor', 
            'componentDidMount', 
            'componentDidUpdate', 
            'componentWillMount',
            'componentWillUnmount',
            'componentWillReceiveProps',
            'shouldComponentUpdate',
        ];

        /** 判断头部是否有单行或者多行注释 */
        const isHeadComments = (line) => {
            return isHeadLineComments(lineComments, line) || isHeadBlockComments(blockComments, line);
        }

        /** 生成默认注释 */
        function genCommentBody(name) {
            const eol = os.EOL;
            if (options && typeof options[0] === 'string' && options[0].toLowerCase === 'line') {
                return `// ${name}${eol}`;
            } else if (options && typeof options[0] === 'string' && options[0].toLowerCase === 'block') {
                return `/** ${name} */${eol}`;
            } else {
                return `/** ${name} */${eol}`;
            }
        }

        /** 在函数头部加上注释 */
        const genPrependFixer = (node, name) => {
            return (fixer) => {
                return fixer.insertTextBefore(
                    node,
                    genCommentBody(name)
                );
            }
        }

        return {
            /** class组件中定义的箭头函数需要有注释 */
            'ClassProperty': (node) => {
                const { leading } = getComments(context, node);
                const { value, key } = node;
                const { name } = key;
                const { type } = value;
                // const { start } = loc;
                // const { line: startLine } = start;
                if (type === 'ArrowFunctionExpression' && !leading.length) {
                    context.report({
                        node,
                        message: 'class组件内部定义的箭头函数没有注释',
                        fix: genPrependFixer(node, name)
                    });
                }
            },
            /** class组件定义的声明式函数需要有注释 */
            'MethodDefinition': (node) => {
                const { leading } = getComments(context, node);
                const { key } = node;
                const { type, name } = key;
                // const { start } = loc;
                // const { line: startLine } = start;
                if (type === 'Identifier' && !classComponentHooks.includes(name) && !leading.length) {
                    context.report({
                        node,
                        message: 'class组件内部定义的声明式函数没有注释',
                        fix: genPrependFixer(node, name)
                    });
                }
            },
            /** 函数组件定义的箭头函数需要有注释 */
            'VariableDeclaration': (node) => {
                const { declarations } = node;
                if (declarations.length === 1) {
                    const { init, id } = declarations[0];
                    const { name } = id;
                    const { type } = init;
                    if (type === 'ArrowFunctionExpression') {
                        if (judgeNodeType(node, 'ExportNamedDeclaration')) {
                            /** export const aaa = 111; */
                            const { leading } = getComments(context, node.parent);
                            if (!leading.length) {
                                context.report({
                                    node: node.parent,
                                    message: '导出的箭头函数头部没有注释',
                                    fix: genPrependFixer(node.parent, name)
                                });  
                            }
                        } else {
                            // console.log('context.getSourceCode()', context.getSourceCode())
                            // const aaa = 111;
                            const ccc = context.getSourceCode();
                            const bbb = context.getSourceCode().getJSDocComment(node);
                            const aaa = getComments(context, node);
                            const { leading } = getComments(context, node);
                            if (!leading.length) {
                                context.report({
                                    node: node,
                                    message: '箭头函数头部没有注释',
                                    fix: genPrependFixer(node, name)
                                });  
                            }
                        }
                    }
                    // if (type === 'ArrowFunctionExpression' && !isHeadComments(startLine)) {
                    //     const n = judgeNodeType(node, 'ExportNamedDeclaration') ? parent : node;
                    //     context.report({
                    //         node: n,
                    //         message: '箭头函数没有注释',
                    //         fix: genPrependFixer(n, name)
                    //     });
                    // }
                }
            }
        };
    }
};
