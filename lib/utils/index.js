/**
 * @description 获取所有注释
 * @param {Object} context 上下文
 * @returns {Array} 注释列表
 */
const getAllComments = (context) => {
  return context.getSourceCode().getAllComments();
}

/** 
 * @description 返回给定节点上声明的变量
 * @param {Object} context 上下文
 * @param {Object} node
 * @returns {Obejct}
 */
const getComments = (context, node) => {
  return context.getSourceCode().getComments(node);
}

/**
 * @description 过滤出单行或者多行注释
 * @param {Array} comments 被过滤的注释列表
 * @param {String} type 'Line' | 'Block' 
 * @returns {Array} 注释列表
 */
const filterComments = (comments, type) => {
  return comments.filter(({ type: ty }) => ty === type);
}

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
  })
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
  })
}

/**
 * @description 判断当前节点行尾是否有单行注释
 * @param {Array} comments 注释列表
 * @param {Number} line 当前节点行数
 * @returns {Boolean}
 */
const isTailLineComments = (comments, line) => {
  return comments.some((n) => {
      const { loc } = n;
      const { start, end } = loc;
      const { line: startLine } = start;
      const { line: endLine } = end;
      return line === startLine && line === endLine;
  })
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
}

/**
 * @description 判断当前节点的父节点类型
 * @param {Object} node 当前节点
 * @param {String} type 节点类型
 */
const judgeNodeType = (node, type) => {
  return node.parent.type === type;
}

module.exports = {
  getAllComments,
  getComments,
  filterComments,
  isHeadLineComments,
  isHeadBlockComments,
  isTailLineComments,
  isEmptyComments,
  judgeNodeType,
}