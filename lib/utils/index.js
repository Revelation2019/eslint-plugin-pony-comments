/**
 * @description 获取所有注释
 * @param {Object} context 上下文
 * @returns {Array} 注释列表
 */
const getAllComments = (context) => {
  return context.getSourceCode().getAllComments();
};

/**
 * @description 返回给定节点上周围声明的注释
 * @param {Object} context 上下文
 * @param {Object} node
 * @returns {Obejct}
 */
const getComments = (context, node) => {
  return context.getSourceCode().getComments(node);
};

/**
 * @description 返回给定节点前声明的注释
 * @param {Object} context 上下文
 * @param {Object} node
 * @returns {Obejct}
 */
const getCommentsBefore = (context, node) => {
  return context.getSourceCode().getCommentsBefore(node);
};

/**
 * @description 返回给定节点后声明的注释
 * @param {Object} context 上下文
 * @param {Object} node
 * @returns {Obejct}
 */
const getCommentsAfter = (context, node) => {
  return context.getSourceCode().getCommentsAfter(node);
};

/**
 * @description 返回给定节点内声明的注释
 * @param {Object} context 上下文
 * @param {Object} node
 * @returns {Obejct}
 */
const getCommentsInside = (context, node) => {
  return context.getSourceCode().getCommentsInside(node);
};


/**
 * @description 过滤出单行或者多行注释
 * @param {Array} comments 被过滤的注释列表
 * @param {String} type 'Line' | 'Block'
 * @returns {Array} 注释列表
 */
const filterComments = (comments, type) => {
  return comments.filter(({ type: ty }) => ty === type);
};

/**
 * @description 判断节点上一行是否有单行注释
 * @param {Array} comments 注释列表
 * @param {Number} line 当前节点行数
 * @returns {Boolean}
 */
const isHeadLineComments = (comments, line) => {
  return comments.some((n) => {
    const { loc } = n;
    const { end } = loc;
    const { line: endLine } = end;
    return line - 1 === endLine;
  });
};

/**
 * @description 判断节点上行是否存在多行注释
 * @param {Array} comments 注释列表
 * @param {Number} line 当前节点行数
 * @returns {Boolean}
 */
const isHeadBlockComments = (comments, line) => {
  return comments.some((n) => {
    const { loc } = n;
    const { end } = loc;
    const { line: endLine } = end;
    return line - 1 === endLine;
  });
};

/**
 * @description 获取节点末行数
 * @param {Object} node
 */
const getNodeEndLine = (node) => {
  return node.loc.end.line;
};

/**
 * @description 判断当前节点行尾是否有单行注释
 * @param {Array} comments 注释列表
 * @param {Number} line 当前节点行数
 * @returns {Boolean}
 */
const isTailLineComments = (comments, node) => {
  return comments.some((n) => {
    const { loc } = n;
    const { start, end } = loc;
    const { line: startLine } = start;
    const { line: endLine } = end;
    const line = getNodeEndLine(node);
    return line === startLine && line === endLine;
  });
};

/**
 * @description 校验单行或者多行注释内容是否为空
 * @param {String} value 注释内容
 * @returns {Boolean}
 */
const isEmptyComments = (value) => {
  const str = value.replace(/[\s\r\n]/g, '');
  if (!str.length || [...new Set(str.split(''))].join() === '*') {
    return true;
  }
  return false;
};

/**
 * @description 判断当前节点的父节点类型
 * @param {Object} node 当前节点
 * @param {String} type 节点类型
 */
const judgeNodeType = (node, type) => {
  return node.parent.type === type;
};

/**
 * @description 生成行尾单行注释
 * @param {Object} node 当前节点
 * @param {String} value 注释内容
 * @returns
 */
const genLineComments = (node, value) => {
  return (fixer) => {
    return fixer.insertTextAfter(
      node,
      `// ${value}`,
    );
  };
};

/**
 * @description 在函数头部加上注释
 * @param {Object} node 当前节点
 * @param {String} text 注释内容
 * @returns
 */
const genHeadComments = (node, text, commentsType) => {
  if (!text) return null;
  const eol = require('os').EOL;
  let content = '';
  if (commentsType && commentsType.toLowerCase === 'line') {
    content = `// ${text}${eol}`;
  } else if (commentsType && commentsType.toLowerCase === 'block') {
    content = `/** ${text} */${eol}`;
  } else {
    content = `/** ${text} */${eol}`;
  }
  return (fixer) => {
    return fixer.insertTextBefore(
      node,
      content,
    );
  };
};

/**
 * @description 获取规则文档地址
 * @param {String} ruleName 规则名称
 */
const docsUrl = (ruleName) => {
  return `https://github.com/Revelation2019/eslint-plugin-pony-comments/tree/main/docs/rules/${ruleName}.md`;
};

/**
 * @description 获取数组最后一个元素
 * @param {Array} arr
 */
const getLastEle = (arr) => {
  return arr[arr.length - 1];
};

/**
 * @description 获取节点的开头列位
 * @param {Object} node
 */
const getNodeStartColumn = (node) => {
  return node.loc.start.column;
};

/**
 * @description 报错
 */
const report = (context, node, message, fix) => {
  context.report({ node, message, fix });
};

/**
 * @description 返回节点后的第一个token
 * @param {Object} context
 * @param {Object} node
 */
const getTokenAfter = (context, node) => {
  return context.getSourceCode().getTokenAfter(node);
};

module.exports = {
  getAllComments,
  getComments,
  filterComments,
  isHeadLineComments,
  isHeadBlockComments,
  isTailLineComments,
  isEmptyComments,
  judgeNodeType,
  docsUrl,
  genLineComments,
  genHeadComments,
  getCommentsBefore,
  getCommentsAfter,
  getCommentsInside,
  getLastEle,
  getNodeStartColumn,
  getNodeEndLine,
  report,
  getTokenAfter,
};
