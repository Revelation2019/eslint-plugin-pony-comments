/**
 * @fileoverview 校验枚举的注释
 * @author sheng zhou<zhousheng_zuel@163.com>
 */
'use strict';

const rule = require('../../../lib/rules/no-enum-comments');

const RuleTester = require('eslint').RuleTester;

const { config } = require('../utils');
const ruleTester = new RuleTester(config);
ruleTester.run('no-enum-comments', rule, {

  valid: [
    {
      code: `
			/** 优惠券类型 */
			enum CouponType {
				/** 打折 */
				DISCOUNT = 'DISCOUNT',
				/** 满减 */
				REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
			}
			`,
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
    },
    {
      code: `
			// 优惠券类型
			enum CouponType {
				DISCOUNT = 'DISCOUNT', // 打折
				REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE', // 满减
			}
			`,
      options: ['always', { leadingCommentType: 'Line', propertyComments: { pos: 'tail', commentsType: 'Line' } }],
    },
  ],

  invalid: [
    {
      code: `
        enum CouponType {
          /** 打折 */
          DISCOUNT = 'DISCOUNT',
          /** 满减 */
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
      errors: [{
        message: '枚举头部需要注释',
        type: 'TSEnumDeclaration',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
        /** 优惠券类型 */
        enum CouponType {
          /** 打折 */
          DISCOUNT = 'DISCOUNT',
          /** 满减 */
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
    },
    {
      code: `
        /** 优惠券类型 */
        enum CouponType {
          DISCOUNT = 'DISCOUNT',
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
      errors: [{
        message: '枚举字段需要注释',
        type: 'TSEnumMember',
      }],
      options: ['always', { leadingCommentType: 'Block', propertyComments: { pos: 'lead', commentsType: 'Block' } }],
      output: `
        /** 优惠券类型 */
        enum CouponType {
          /** 打折 */
          DISCOUNT = 'DISCOUNT',
          /** 满减 */
          REACH_AMOUNT_REDUCE = 'REACH_AMOUNT_REDUCE',
        }
      `,
    },
  ],
});
