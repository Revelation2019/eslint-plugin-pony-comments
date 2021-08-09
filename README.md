# eslint-plugin-pony-comments

校验代码注释规范

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
| [empty-comments](https://github.com/Revelation2019/eslint-plugin-pony-comments/blob/main/docs/rules/empty-comments.md) | **✔️** | **🛠** |       | 不能有空注释               |




