# DynamicCallGraphBuilder

## 组件

### Jalangi2Wrapper

输入项目文件夹，利用 jalangi2 对项目进行插桩，输出插桩后的项目文件和其文件地址。
### PuppeteerWrapper

输入 HTML 文件，用 Puppeteer 打开 HTML 文件，处理控制台输出，输出 `SimpleFunctionCall[]`。

### SimpleFunctionCallProcessor

输入 `SimpleFunctionCall[]` 和 `FunctionInfo[]`，输出 `FunctionCall[]`