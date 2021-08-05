/**
 * @fileoverview class组件和函数组件中定义的函数必须要有注释
 * @author 周胜A02313
 */
"use strict";

var rule = require("../../../lib/rules/no-function-comments"),

    RuleTester = require("eslint").RuleTester;

const { config } = require('../utils');

var ruleTester = new RuleTester(config);
ruleTester.run("no-function-comments", rule, {

    valid: [
        // `
        // /** 提交 */
        // export const submit = () => {}
        // `,
        // `
        // /** Main组件 */
        // const Main = () => {}
        // `,
        // `
        // // Main组件
        // const Main = () => {}
        // `,
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
                const Main = () => {}
            `,
            errors: [{
                message: "函数必须要注释",
                type: "ArrowFunctionExpression",
                options: ['Line']
            }]
        },
        {
            code: `
                /** Main组件 */

                const Main = () => {}
            `,
            errors: [{
                message: "函数与多行注释之间不能有空行",
                type: "ArrowFunctionExpression",
                options: ['Block']
            }]
        },
        {
            code: `
                // Main组件
                
                const Main = () => {}
            `,
            errors: [{
                message: "函数与单行注释之间不能有空行",
                type: "ArrowFunctionExpression",
                options: ['Block']
            }]
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
                message: "class组件中除声明周期钩子不需要有注释外，其他定义的函数必须要有",
                type: "ArrowFunctionExpression",
                options: ['Block']
            }]
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
                message: "函数组件中定义的函数必须要有",
                type: "ArrowFunctionExpression",
                options: ['Block']
            }]
        }
    ]
});
