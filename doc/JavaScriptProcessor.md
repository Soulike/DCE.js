# JavaScriptProcessor

## 说明

对 JavaScript 文件中存在的 `Function()` 和 `eval()` 进行替换处理。

## 模块划分

### FunctionConstructionProcessor

处理 `new Function()` 和 `Function()`。

### EvalProcessor

处理 `eval()`，当且仅当参数是字符串字面量时做替换。