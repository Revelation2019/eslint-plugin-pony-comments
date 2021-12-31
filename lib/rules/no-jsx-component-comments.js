/**
 * @fileoverview 校验jsx引入的组件是否写有注释
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const {
  docsUrl,
  genCustomComponentHeadComments,
  genHeadComments,
  report,
  judgeNodeType,
  getComments,
  getNodePrevTokens,
  genBracketsAndHeadComments,
  getAllComments,
  getLastEle,
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
    fixable: 'whitespace', // or "code" or "whitespace"
    // schema用于定义context.options
    schema: [
      {
        enum: ['always', 'never'],
      },
      {
        type: 'object',
        properties: {
          excludes: {
            type: 'array',
          },
          isDefault: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: function (context) {
    const comments = getAllComments(context);
    const options = context.options;
    const excludes = options.length > 0 ? getLastEle(options).excludes : [];
    const isDefault = options.length > 0 ? getLastEle(options).isDefault : false;

    /** 默认排除常规html标签 */
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
      'h2',
      'h3',
      'h4',
      'h5',
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
      'Row',
      'Col',
    ];

    // 业务组件
    const breComponents = [
      'AccordionMenu',
      'AddressData',
      'AddressMap',
      'AfterSalePolicy',
      'AfterSalePolicyModal',
      'AliVideoPlayer',
      'Align',
      'Anchor',
      'AsyncAddressCascade',
      'BoschLogo',
      'LionLogo',
      'FullReduction',
      'Tag',
      'CascaderSelect',
      'CassAddressMap',
      'CompanyLevel',
      'Coupon',
      'Echarts',
      'Empty',
      'EvaluationPopup',
      'FeatureProvider',
      'Feature',
      'FindParts',
      'Guide',
      'ImModal',
      'ImTrigger',
      'Image',
      'ImagePasteDrag',
      'ImagePreview',
      'LogisticsCascader',
      'LogisticsTrack',
      'ILogisticItem',
      'Map',
      'MarkText',
      'MarqueeText',
      'OeImageModal',
      'RightLevel',
      'SearchBar',
      'StepPrice',
      'IStepPriceItem',
      'SupplierLevel',
      'Table',
      'Column',
      'Upload',
      'Form',
      'useForm',
      'IFormValues',
      'WS',
    ];

    /** 排除需要注释的标签选项 */
    const excludeOptions = isDefault ? [].concat(bricks, breComponents, baseElement, excludes) : [].concat(baseElement, excludes);

    return {
      'JSXElement': (node) => {
        const { openingElement = {} } = node;
        const { name = {} } = openingElement;
        const { name: identifierName = '' } = name;
        const { range = [] } = node;

        if (judgeNodeType(node, 'JSXExpressionContainer') && judgeNodeType(node.parent, 'JSXAttribute')) {
          /**
           * <AAA content={<BBB></BBB>}></AAA>
           * BBB组件不用添加注释
           */
          return;
        } else if (typeof name === 'object' && name.type === 'JSXMemberExpression') {
          /**
           * <Modal>
           *  <Modal.Header></Modal.Header>
           * </Modal>
           * Modal.Header组件不用写注释
           */
          return;
        } else if (typeof name === 'object' && name.type === 'JSXIdentifier' && !excludeOptions.includes(name.name) && judgeNodeType(node, ['ConditionalExpression', 'ArrowFunctionExpression'])) {
          /**
           * boolean ? <AAA /> : null;
           * 或
           * <div>
           *  {
           *    list.map(item => <AAA></AAA>)
           *  }
           * </div>
           */
          const tokens = getNodePrevTokens(context, node, { count: 2 });
          if (tokens[tokens.length - 1].value === '(') {
            const { leading } = getComments(context, node);
            if (!leading.length) {
              report(context, node, '自定义组件没有写注释', genHeadComments(node, identifierName, 'block'));
            }
          } else {
            report(context, node, '自定义组件没有写注释', genBracketsAndHeadComments(node, identifierName));
          }
        } else if (!excludeOptions.includes(identifierName)) {
          /** 判断其上兄弟节点是否有注释 */
          if (node.parent && node.parent.children && node.parent.children.length) {
            /** 当前节点在父级节点层级下的下标 */
            const index = node.parent.children.findIndex(child => child.range[0] === range[0] && child.range[1] === range[1]);
            /** 上一个兄弟阶段是否是JSXText */
            const isPrevNodeTypeJSXText = index - 1 >= 0 && node.parent.children[index - 1].type === 'JSXText';
            /** 上一个兄弟阶段是否是JSXExpressionContainer */
            const isPrevNodeTypeJSXExpressionContainer = index - 1 >= 0 && node.parent.children[index - 1].type === 'JSXExpressionContainer';
            /** 上上一个兄弟阶段是否是JSXExpressionContainer */
            const isLastNodeTypeJSXExpressionContainer = index - 2 >= 0 && node.parent.children[index - 2].type === 'JSXExpressionContainer';
            /** 上一个兄弟节点是否是注释节点 */
            const prevJSXExpressionContainerIsComments = index - 1 >= 0 && comments.some(c => Math.abs(c.loc.start.column - node.parent.children[index - 1].loc.start.column) <= 1 && Math.abs(c.loc.end.column - node.parent.children[index - 1].loc.end.column) <= 1);
            /** 上上一个兄弟节点是否是注释节点 */
            const lastJSXExpressionContainerIsComments = index - 2 >= 0 && comments.some(c => Math.abs(c.loc.start.column - node.parent.children[index - 2].loc.start.column) <= 1 && Math.abs(c.loc.end.column - node.parent.children[index - 2].loc.end.column) <= 1);
            /** 节点前有文本 */
            const isPrevText = index - 1 >= 0 && node.parent.children[index - 1].type === 'JSXText' && node.parent.children[index - 1].value.replace(/\s/g, '');
            /** 节点后有文本 */
            const isNextText = index + 1 >= 0 && node.parent.children[index + 1].type === 'JSXText' && node.parent.children[index + 1].value.replace(/\s/g, '');
            if ((isPrevNodeTypeJSXText && isLastNodeTypeJSXExpressionContainer && lastJSXExpressionContainerIsComments) || (isPrevNodeTypeJSXExpressionContainer && prevJSXExpressionContainerIsComments)) {
              return;
            } else if (isPrevText && isNextText) {
              /**
               * <span>种(共<Quantity space={4}>{number}</Quantity>件)商品</span>
               */
              const tokens = getNodePrevTokens(context, node, { count: 2 });
              /** 最后一个token的值 */
              const lastTokenValue = tokens[tokens.length - 1].value.replace(/[' ']/g, '');
              report(
                context,
                node,
                '自定义组件没有写注释',
                genCustomComponentHeadComments(node, identifierName, /\n/.test(lastTokenValue.charAt(lastTokenValue.length - 1))),
              );
            } else {
              /**
               * <span>
               *  <AAA />
               * </span>
               */
              report(
                context,
                node,
                '自定义组件没有写注释',
                genCustomComponentHeadComments(node, identifierName),
              );
            }
          }
        }
      },
    };
  },
};
