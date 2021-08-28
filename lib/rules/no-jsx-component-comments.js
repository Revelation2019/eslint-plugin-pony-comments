/**
 * @fileoverview 校验jsx引入的组件是否写有注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const {
  docsUrl,
  // genJsxHeadComments,
  getTokensBefore,
  report,
  getAllComments,
  judgeJSXExpressionContainerComments,
} = require('../utils');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'class组件和函数组件中定义的函数必须要有注释',
      category: 'Fill me in',
      recommended: true, // 是配置文件中的"extends": "eslint:recommended"属性是否启用规则
      url: docsUrl('no-jsx-component-comments'),
    },
    fixable: 'whitespace',
    schema: [], // or "code" or "whitespace"
  },

  create: function (context) {
    const comments = getAllComments(context);
    /** html标签 */
    const baseElement = [
      'a',
      'abbr',
      'acronym',
      'address',
      'applet',
      'area',
      'article',
      'aside',
      'audio',
      'b',
      'base',
      'basefont',
      'bdi',
      'bdo',
      'big',
      'blockquote',
      'body',
      'br',
      'button',
      'canvas',
      'caption',
      'center',
      'cite',
      'code',
      'col',
      'colgroup',
      'command',
      'datalist',
      'dd',
      'del',
      'details',
      'dfn',
      'dialog',
      'dir',
      'div',
      'dl',
      'dt',
      'em',
      'embed',
      'fieldset',
      'figcaption',
      'figure',
      'font',
      'footer',
      'form',
      'frame',
      'frameset',
      'h1',
      'h6',
      'head',
      'header',
      'hr',
      'html',
      'i',
      'iframe',
      'img',
      'input',
      'ins',
      'kbd',
      'keygen',
      'label',
      'legend',
      'li',
      'link',
      'main',
      'map',
      'mark',
      'menu',
      'meta',
      'meter',
      'nav',
      'noframes',
      'noscript',
      'object',
      'ol',
      'optgroup',
      'option',
      'output',
      'p',
      'param',
      'pre',
      'progress',
      'q',
      'rp',
      'rt',
      'ruby',
      's',
      'samp',
      'script',
      'section',
      'select',
      'small',
      'source',
      'span',
      'strike',
      'strong',
      'style',
      'sub',
      'summary',
      'sup',
      'table',
      'tbody',
      'td',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'title',
      'tr',
      'track',
      'tt',
      'u',
      'ul',
      'var',
      'video',
      'wbr',
    ];
    /** bricks组件 */
    const bricks = [
      'Button',
      'Grid',
      'Icon',
      'Text',
      'Bar',
      'Breadcrumb',
      'Menu',
      'Pagination',
      'Steps',
      'Tabs',
      'AutoComplete',
      'Cascader',
      'ChainSelect',
      'Checkbox',
      'DatePicker',
      'FlatTransfer',
      'Form',
      'Input',
      'Multiselect',
      'Radio',
      'Select',
      'SelectedCard',
      'SpinBox',
      'Switch',
      'TextArea',
      'Transfer',
      'Accordion',
      'Carousel',
      'Collapse',
      'Dropdown',
      'Progress',
      'Table',
      'Tag',
      'TimeLine',
      'Tree',
      'Alert',
      'Confirm',
      'Drawer',
      'Modal',
      'Notification',
      'Popover',
      'Spinner',
      'Toast',
      'Affix',
      'Backdrop',
      'BackTop',
      'DebouncedButton',
      'Fade',
      'Panel',
      'Scrollbar',
    ];
    return {
      'JSXElement': (node) => {
        const { openingElement = {} } = node;
        const { name = {} } = openingElement;
        const { name: n = '' } = name;
        if (!baseElement.includes(n) && !bricks.includes(n)) {
          const preNodeOfJSXElement = getTokensBefore(context, node);
          if (preNodeOfJSXElement.length && preNodeOfJSXElement[0].type === 'JSXText') {
            const preNodeOfJSXText = getTokensBefore(context, node);
            if (!preNodeOfJSXText.length || preNodeOfJSXText[0].type !== 'JSXExpressionContainer' || preNodeOfJSXText[0].expression.type !== 'JSXEmptyExpression' || !judgeJSXExpressionContainerComments(comments, preNodeOfJSXText[0])) {
              report(
                context,
                node,
                '自定义组件或者业务组件没有写注释',
                null,
              );
            }
          } else if (preNodeOfJSXElement.length && preNodeOfJSXElement[0].type === 'JSXExpressionContainer'){
            if (preNodeOfJSXElement[0].expression.type !== 'JSXEmptyExpression' || !judgeJSXExpressionContainerComments(comments, preNodeOfJSXElement[0])) {
              report(
                context,
                node,
                '自定义组件或者业务组件没有写注释',
                null,
              );
            }
          }
        }
      },
    };
  },
};

