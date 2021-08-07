/**
 * @fileoverview class组件和函数组件中定义的函数必须要有注释
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const rule = require('../../../lib/rules/no-function-comments');

const RuleTester = require('eslint').RuleTester;

const { config } = require('../utils');

const ruleTester = new RuleTester(config);
ruleTester.run('no-function-comments', rule, {

  valid: [
    `
      /** 提交 */
      const submit = () => {
        let nowWidth;
      }
    `,
    `
        /** 提交 */
        export const submit = () => {}
        `,
    `
        /** Main组件 */
        const Main = (props: IProps) => {
            useEffect(() => {});

            /** 计时器 */
            const countDown = () => {}

            // 重置
            const reset = () => {}

            // 提交
            const submit = () => {}
        }
        `,
    `
        // Main组件
        class Main extends React.Component {

            /** 计时器 */
            countDown() {}

            // 提交
            submit = () => {}

            // 重置
            reset = () => {}

            render() {}
        }
        `,
  ],

  invalid: [
    {
      code: `
        const aaa = 11; // aaa

        const submit = () => {}
      `,
      errors: [{
        message: '函数必须要注释',
        type: 'ArrowFunctionExpression',
        options: ['Block'],
      }],
      output: `
        const aaa = 11; // aaa
        /** 提交 */
        const submit = () => {}
      `,
    },
    {
      code: `
        export const Main = () => {}
      `,
      errors: [{
        message: '函数必须要注释',
        type: 'ArrowFunctionExpression',
        options: ['Block'],
      }],
      output: `
        /** Main */
        export const Main = () => {}
      `,
    },
    {
      code: `
        // Main组件
        class Main extends React.Component {

          countDown() {}

          submit = () => {}

          reset = () => {}

          render() {}
        }
      `,
      errors: [{
        message: 'class组件中除声明周期钩子不需要有注释外，其他定义的函数必须要有',
        type: 'ArrowFunctionExpression',
        options: ['Block'],
      }],
      output: `
        // Main组件
        class Main extends React.Component {
          /** 计时器 */
          countDown() {}
          /** 提交 */
          submit = () => {}
          /** 重置 */
          reset = () => {}

          render() {}
        }
      `,
    },
    {
      code: `
        /** Main组件 */
        const Main = (props: IProps) => {
          useEffect(() => {});

          const countDown = () => {}

          const reset = () => {}

          const submit = () => {}
        }
      `,
      errors: [{
        message: '函数组件中定义的函数必须要有',
        type: 'ArrowFunctionExpression',
        options: ['Block'],
      }],
      output: `
        /** Main组件 */
        const Main = (props: IProps) => {
          useEffect(() => {});
          /** 计时器 */
          const countDown = () => {}
          /** 重置 */
          const reset = () => {}
          /** 提交 */
          const submit = () => {}

          render() {}
        }
      `,
    },
  ],
});
