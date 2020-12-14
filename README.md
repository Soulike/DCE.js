# DCE.js

## 简介

JavaScript 应用程序死代码消除工具。

## 使用方法

### 1. 安装依赖

确保安装 Node.js 及 yarn 的最新版本，在项目文件夹下运行 `yarn` 安装所有依赖。

### 2. 编译

执行 `yarn build`

### 3. 运行

在项目文件夹下运行：

```sh
node dist/index.js [options...] <directory>
```

- `--info-only` 只在 stdout 输出寻找到的死代码函数信息，不对原始文件做出修改
- `-d <directory>` 将处理后结果输出到指定目录下。不设定该选项将直接对原始文件做出修改
- `--help` 输出帮助信息

## 项目进度

- 2020.11.04 确定项目主题[1]
- 2020.11.06 确定项目静态分析工具为 [ACG.js](https://github.com/snyk-labs/javascript-call-graph) 搭配 [TAJS](https://github.com/cs-au-dk/TAJS)[2]
- 2020.11.09 完成项目概览（[Overview.md](./doc/Overview.md)）
- 2020.11.09 对静态分析工具进行评估，放弃 TAJS（对目前 Web 应用支持欠佳）
- 2020.11.17 修改项目概览（[Overview.md](./doc/Overview.md)）；完成 `HTMLProcessor` 模块和 `ScriptFileScanner` 模块；放弃 ACG.js，决定基于 [esprima](https://github.com/jquery/esprima) 来进行静态调用分析

## 参考文献

> [1] OBBINK N G, MALAVOLTA I, SCOCCIA G L等. An extensible approach for taming the challenges of JavaScript dead code elimination[C/OL]//2018 IEEE 25th International Conference on Software Analysis, Evolution and Reengineering (SANER). IEEE, 2018: 291–401. http://ieeexplore.ieee.org/document/8330226/. DOI:10.1109/SANER.2018.8330226.
> 
> [2] ANTAL G, HEGEDUS P, TOTH Z等. [Research Paper] Static JavaScript Call Graphs: A Comparative Study[C/OL]//2018 IEEE 18th International Working Conference on Source Code Analysis and Manipulation (SCAM). IEEE, 2018: 177–186. https://ieeexplore.ieee.org/document/8530732/. DOI:10.1109/SCAM.2018.00028.