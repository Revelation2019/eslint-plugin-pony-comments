/**
 * @fileoverview 没有类型定义单行注释
 * @author no-type-define-comments
 */
"use strict";

var rule = require("../../../lib/rules/no-type-define-comments"),

    RuleTester = require("eslint").RuleTester;
    
const { config } = require('../utils');
var ruleTester = new RuleTester(config);
ruleTester.run("no-type-define-comments", rule, {

    valid: [
        `interface IType {
            id: string; // id
            name: string; // 姓名
            age: number; // 年龄
        }`,
        `interface IType {
            /** id */
            id: string;
            /** 姓名 */
            name: string;
            /** 年龄 */
            age: number;
        }`,
        `
        /** 优惠券类型 */
        enum CouponType {
            /** 打折 */
            DISCOUNT = 'DISCOUNT',
            /** 满减 */
            REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
        `,
        `
        /** 仓库信息类型 */
        export type inventoryInfoType = IInventory | string;
        `
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: `interface IType {
                id: string;
                /** 姓名 */
                name: string;
                age: number;
            }`,
            errors: [{
                message: "每个类型定义必须在行头加上多行注释或者行尾加上单行注释",
                type: "TSInterfaceDeclaration"
            }]
        },
        {
            code: `interface IType {
                /** id */
    
                id: string;
                /** 姓名 */
                name: string;
                /** 年龄 */
                age: number;
            }`,
            errors: [{
                message: "注释和类型定义的字段之间不能有空行",
                type: "TSInterfaceDeclaration"
            }]
        },
        {
            code: `interface IType {
                // id
    
                id: string;
                /** 姓名 */
                name: string;
                /** 年龄 */
                age: number;
            }`,
            errors: [{
                message: "注释和类型定义的字段之间不能有空行",
                type: "TSInterfaceDeclaration"
            }]
        },
        {
            code: `
            /** 优惠券类型 */
            enum CouponType {
                DISCOUNT = 'DISCOUNT',
                REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
            }}`,
            errors: [{
                message: "枚举类型定义的每个字段必须要有注释",
                type: "TSInterfaceDeclaration"
            }]
        },
        {
            code: `export type inventoryInfoType = IInventory | string;`,
            errors: [{
                message: "type定义的类型没有注释",
                type: "TSTypeAliasDeclaration"
            }]
        }
    ]
});
