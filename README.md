# DCE.js

## 简介

JavaScript 应用程序死代码消除工具。

## 项目进度

- 2020.11.04 确定项目主题[1]
- 2020.11.06 确定项目静态分析工具为 [ACG.js](https://github.com/snyk-labs/javascript-call-graph) 搭配 [TAJS](https://github.com/cs-au-dk/TAJS)[2]
- 2020.11.09 完成项目概览（[Overview.md](./doc/Overview.md)）
- 2020.11.09 对静态分析工具进行评估，放弃 TAJS（对目前 Web 应用支持欠佳）

## 参考文献

> [1] OBBINK N G, MALAVOLTA I, SCOCCIA G L等. An extensible approach for taming the challenges of JavaScript dead code elimination[C/OL]//2018 IEEE 25th International Conference on Software Analysis, Evolution and Reengineering (SANER). IEEE, 2018: 291–401. http://ieeexplore.ieee.org/document/8330226/. DOI:10.1109/SANER.2018.8330226.
> 
> [2] ANTAL G, HEGEDUS P, TOTH Z等. [Research Paper] Static JavaScript Call Graphs: A Comparative Study[C/OL]//2018 IEEE 18th International Working Conference on Source Code Analysis and Manipulation (SCAM). IEEE, 2018: 177–186. https://ieeexplore.ieee.org/document/8530732/. DOI:10.1109/SCAM.2018.00028.