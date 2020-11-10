# 项目概览

## 流程概要

![Overview](./Overview/Overview.svg)

## 详细步骤说明

以下的“修改”，均指原地修改。

项目传入参数为一个文件夹，文件夹下为被处理项目的源代码。

### 1. HTML 文件预处理

- 说明：对文件夹下所有的 HTML 都进行预处理
- 输入：一个 HTML 文件
- 输出：
  - 修改后的 HTML 文件
  - 导出的 JavaScript 文件
- 备注：
  - 将 HTML 中所有内嵌的 JavaScript 代码提取出来，存储为外部 JavaScript 文件并将内嵌 `<script>` 替换为外部 JavaScript 文件引用

### 2. 识别 JavaScript 文件

- 说明：识别出文件夹下所有的 JavaScript 文件
- 输入：文件夹
- 输出：
  - JavaScript 文件数组 `ScriptFile[]`
- 备注：
  - 目前不考虑 ECMAScript Module
  - （暂定）文件数据结构

```ts
class ScriptFile
{
    readonly filePath: string,                      // 文件的相对路径，包含文件名
    readonly MethodsInfo: Readonly<MethodInfo>[],   // 文件中包含的所有方法，供步骤 3 用
}
```

### 3. 所有函数识别

- 输入：一个 `ScriptFile` 实例
- 输出：
  - `MethodsInfo` 数组被填充的 `ScriptFile` 实例，其中数组下标表示函数被发现的顺序
- 备注：
  - **存在一个 `MethodInfo` 实例 `global`，单独处理**
  - （暂定）函数数据结构

```ts
class MethodInfo
{
    readonly scriptFile: Readonly<ScriptFile> | null,   // 方法所在文件，当描述 global 时值为 null
    readonly startIndex: number | null,                 // 方法开始的字符位置，当描述 global 时值为 null
    readonly endIndex: number | null,                   // 方法结束的字符位置，当描述 global 时值为 null
    readonly name: string | null,                       // 方法名，当描述 global 时值为 global，当描述匿名函数时值为 null
}

class Method
{    
    readonly methodInfo: Readonly<MethodInfo>,
    readonly calls: Readonly<MethodInfo>[],     // 本函数中调用的其他函数，供第 4 步使用
}
```

### 4. 动态/静态调用图生成

- 输入：一个 `ScriptFile` 实例
- 输出：`Method[]`
- 备注：
  - 输出数组中所有实例的 `calls` 数组均被填充

### 5. 调用图合并

- 输入：多个 `Method[]`
- 输出：合并过的 `Method[]`
- 备注：
  - 根据 `methodInfo` 进行 `calls` 的合并

### 6. 孤立结点识别

- 输入：`Method` 实例，这个实例代表 `global`
- 输出：`Method[]`，其中包含所有孤立结点
- 备注：
  - 孤立结点指从 `global` 不可达的结点

### 7. 函数体删除

- 输入：`Method[]`，其中包含所有孤立结点
- 输出：删除 `Method` 实例中对应文件中函数的函数体
- 备注：
  - 删除不改变函数的行号信息