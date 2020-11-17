# HTMLProcessor

## 说明

对 HTML 文件进行处理，分离出其中内联的 JavaScript 代码。

## 模块划分

### HTMLScanner

扫描指定的文件夹，输出所有 HTML 文件的相对路径。

可使用 [klaw](https://github.com/jprichardson/node-klaw) 实现功能。

### HTMLParser

解析 HTML 文件内容，找到内联的 JavaScript 代码，将内联代码输出为文件，并替换内联 `<script>` 标签为外联文件标签。

外联文件名格式为 `[原始 HTML 文件名]-[长度为 10 的随机字母字符串].js`

可使用 [jsdom](https://github.com/jsdom/jsdom) 实现解析功能。

可使用 [crypto-random-string](https://github.com/sindresorhus/crypto-random-string) 实现随机文件名。