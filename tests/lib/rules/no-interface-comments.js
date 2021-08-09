/**
 * @fileoverview interface定义类型注释校验
 * @author sheng zhou<sheng.zhou@casstime.com>
 */
'use strict';

const rule = require('../../../lib/rules/no-interface-comments');

const RuleTester = require('eslint').RuleTester;
const { config } = require('../utils');
const ruleTester = new RuleTester(config);
ruleTester.run('no-interface-comments', rule, {

  valid: [
    {
      code: `
			export const Main = (props: { name: string }) => {}
			`,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
    },
    {
      code: `
			/** 类型 */
			export interface IType {
					id: string; // id
					name: string; // 姓名
					age: number; // 年龄
			}`,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'tail', commentsType: 'Line' } }],
    },
    {
      code: `
			/** 类型 */
			interface IType {
					/** id */
					id: string;
					/** 姓名 */
					name: string;
					/** 年龄 */
					age: number;
			}`,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
    },
  ],

  invalid: [
    {
      code: `
				export interface IType {
					/** id */
					id: string;
					/** 姓名 */
					name: string;
					/** 年龄 */
					age: number;
				}
			`,
      errors: [{
        message: 'interface头部必须加上注释',
        type: 'TSInterfaceDeclaration',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
				/** 类型 */
				export interface IType {
					/** id */
					id: string;
					/** 姓名 */
					name: string;
					/** 年龄 */
					age: number;
				}
			`,
    },
    {
      code: `
				/** 类型 */
				interface IType {
					id: string;
					name: string;
					age: number;
				}
			`,
      errors: [{
        message: 'interface字段必须加上注释',
        type: 'TSPropertySignature',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
				/** 类型 */
				interface IType {
					/** id */
					id: string;
					/** 姓名 */
					name: string;
					/** 年龄 */
					age: number;
				}
			`,
    },
  ],
});
