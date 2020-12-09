# IsolatedFunctionIdentifier

## 说明

本模块用于识别调用图中从 global 不可达的函数。

## 输入

- 所有函数信息 `FunctionInfo[]`
- 所有调用信息 `FunctionCall[]`
    - 保证任意两个 `FunctionCall` 的 `caller` 都是不同的 `FunctionInfo`
    - 保证任意一个 `FunctionCall` 的 `callee` 的任意两个成员都是不同的 `FunctionInfo`

`FunctionInfo` 和 `FunctionCall` 的具体定义都可以在项目的 src/DataClass 文件夹下找到。

**特别的，global 表示为所有域值都为 `null` 的 `FunctionInfo` 实例。**

## 输出

`getIsolatedFunctions():FunctionInfo[]`

- 所有从 global 不可达的函数信息 `FunctionInfo[]`

## 过程说明

简单来说就是图遍历，每个结点都只会被访问一次，在遍历过程中记录访问到的结点包含的函数信息。

1. 从 `FunctionCall[]` 中找到 `caller` 为 global 的 `FunctionCall`
2. 记录 `FunctionCall` 的 `callee` 数组成员，这些成员是活函数
3. 从 `FunctionCall[]` 中找到 `caller` 为 2 中找到函数的 `FunctionCall`
4. 记录 `FunctionCall` 的 `callee` 数组成员，这些成员是活函数
5. 从 `FunctionCall[]` 中找到 `caller` 为 4 中找到函数的 `FunctionCall`，这些函数需要是新发现的活函数
    - 否则遇到循环调用会有问题
6. 重复 3-5，直到 5 中找不到新的函数
7. 把找到的活函数与输入的 `FunctionInfo[]` 做对比，得到输入 `FunctionInfo[]` 中的死函数并输出