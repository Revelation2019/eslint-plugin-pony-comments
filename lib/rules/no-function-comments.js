/**
 * @fileoverview class组件和函数组件中定义的函数必须要有注释
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

const {
  getComments,
  judgeNodeType,
  docsUrl,
  genHeadComments,
  getLastEle,
  report,
  getNodeStartColumn,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'class组件和函数组件中定义的函数必须要有注释',
      category: 'Fill me in',
      recommended: true, // 是配置文件中的"extends": "eslint:recommended"属性是否启用规则
      url: docsUrl('no-function-comments'),
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
      'componentDidCatch',
    ];

    return {
      /** class组件中定义的箭头函数需要有注释 */
      'ClassProperty': (node) => {
        const { leading } = getComments(context, node);
        const { value = {}, key = {} } = node;
        const { name = '' } = key;
        const { type = '' } = value;
        if (type === 'ArrowFunctionExpression' && !leading.length) {
          report(context, node, 'class组件内部定义的箭头函数没有注释', genHeadComments(node, name, commentsType));
        }
      },
      /** class组件定义的声明式函数需要有注释 */
      'MethodDefinition': (node) => {
        const { leading } = getComments(context, node);
        const { key } = node;
        const { type, name } = key;
        if (type === 'Identifier' && !classComponentHooks.includes(name) && !leading.length) {
          report(context, node, 'class组件内部定义的声明式函数没有注释', genHeadComments(node, name, commentsType));
        }
      },
      /** 函数组件定义的箭头函数需要有注释 */
      'VariableDeclaration': (node) => {
        const { declarations } = node;
        if (declarations.length === 1) {
          const { init, id } = declarations[0];
          if (init && id) {
            /** let aaa; 时init为null  */
            const { name = '' } = id;
            const { type } = init;
            /** 箭头函数 || 函数表达式 */
            if (['ArrowFunctionExpression', 'FunctionExpression'].includes(type)) {
              if (judgeNodeType(node, 'ExportNamedDeclaration')) {
                /** export const aaa = 111; */
                const parent = node.parent;
                const { leading } = getComments(context, parent);
                /** 节点前注释开头列位不等于节点开头列位，意味着节点前没有注释 */
                if (!leading.length || getNodeStartColumn(getLastEle(leading)) !== getNodeStartColumn(parent)) {
                  report(context, parent, '导出的函数头部没有注释', genHeadComments(parent, name, commentsType));
                }
              } else {
                /** const aaa = 111; */
                /** 在解析class组件定义的函数时getComments会报错，将eslint@^7.1.0降到eslint@6.8.0 */
                const { leading } = getComments(context, node);
                /** 节点前注释开头列位不等于节点开头列位，意味着节点前没有注释 */
                if (!leading.length || getNodeStartColumn(getLastEle(leading)) !== getNodeStartColumn(node)) {
                  report(context, node, '函数头部没有注释', genHeadComments(node, name, commentsType));
                }
              }
            }
          }
        }
      },
      /** 声明式函数需要有注释 */
      'FunctionDeclaration': (node) => {
        const { leading } = getComments(context, node);
        if (!leading.length || getNodeStartColumn(getLastEle(leading)) !== getNodeStartColumn(node)) {
          const { id = {} } = node;
          const { name = '' } = id;
          report(context, node, '函数头部没有注释', genHeadComments(node, name, commentsType));
        }
      },
    };
  },
};
