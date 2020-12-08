# FunctionCallsMerger

对传入的多个 `FunctionCall[]` 进行合并，输出一个 `FunctionCall[]`，其中任意两个 `FunctionCall` 不会出现相同的 `caller`，`callee` 中也不会包含重复的 `FunctionInfo`。