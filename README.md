# eslint-plugin-pony-comments

在实际前端项目开发中，开发同学编写代码时写注释的风格不尽一致，并且有些关键代码没有注释，这些都影响着代码的可读性、项目可维护性。虽然团队尽可能地在制定一些公约来要求开发同学去遵守或者引入gerrit代码检视工具，但结果反馈仅依靠人为的方式去避免起到的效果甚微，该插件由此诞生，帮助校验interface、enum、function、type、hooks等关键代码块是否有注释说明。

## 安装

首先，你需要安装 [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

接着，安装 `eslint-plugin-pony-comments`:

```
$ npm install eslint-plugin-pony-comments --save-dev
```


## 使用
添加`pony-comments` 到`.eslintrc`，你可以省略`eslint-plugin-`前缀：

```json
{
    "plugins": [
        "pony-comments"
    ]
}
```

然后在规则部分配置您要使用的规则：

```json
{
    "rules": {
        "pony-comments/no-enum-comments": [2, "always", { "leadingCommentType": "Block", "propertyComments": { "pos": "tail", "commentsType": "Line" } }]
    }
}
```
该插件有导出默认规则，如果你没有自定义规则的需求，可以在`extends`字段中添加默认规则：

```json
{
    "extends": ["plugin:pony-comments/recommended"]
}
```

另外，该插件是基于`@typescript-eslint/parser`解析器做的，如果`eslint`服务控制台有报解析有关的错误，请指定该解析器

```json
{
    "parser": "@typescript-eslint/parser"
}
```
如果在`yarn start`启动项目时报了很多未更改文件的校验错误，需要在根目录下`config-overrides.js`的`override`函数中添加`config.module.rules.splice(1, 1);`

## 支持的规则

- ✔️如果规则属于`recommended`配置
- 🛠如果规则报告的某些问题可以通过`--fix` 命令行选项自动修复
- 💡如果规则报告的某些问题可以通过编辑器建议手动修复

| 规则                                                         | **✔️** | **🛠** | **💡** | **描述**                   |
| ------------------------------------------------------------ | ----- | ----- | ----- | -------------------------- |
| [no-enum-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/no-enum-comments.md) | **✔️** | **🛠** |       | 定义枚举时需要加上注释     |
| [no-function-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/no-function-comments.md) | **✔️** | **🛠** |       | 定义函数时需要加上注释     |
| [no-interface-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/no-interface-comments.md) | **✔️** | **🛠** |       | 定义接口类型时需要加上注释 |
| [no-type-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/no-type-comments.md) | **✔️** | **🛠** |       | 定义类型时需要加上注释     |
| [empty-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/empty-comments.md) |  | **🛠** |       | 不能有空注释               |
| [no-jsx-component-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/no-jsx-component-comments.md) | **✔️** | **🛠** |       | 自定义组件需要有注释
| [no-hooks-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/no-hooks-comments.md) | **✔️** | **🛠** |       | hooks使用需要有注释



