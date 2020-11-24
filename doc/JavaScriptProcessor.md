# JavaScriptProcessor

## 说明

对 JavaScript 文件中存在的 `Function()` 和 `eval()` 进行替换处理。

## 模块划分

### NewExpressionProcessor

处理 `new Function()`。

### CallExpressionProcessor

处理 `eval()` 和 `Function()`。对于 `eval`，当且仅当参数是字符串字面量时做替换。