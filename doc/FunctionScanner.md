# FunctionScanner

## 说明

通过调用 esprima 获取某个文件当中所有的函数定义和传递信息。

## 流程

1. 获取所有可能存在函数定义和传递的结点
2. 识别结点类型
3. 如果是 `FunctionDeclaration`，直接处理得到 `FunctionInfo`
4. 如果是 `VariableDeclarator`，查看 `init` 的类型
  - 如果 `init` 是 `FunctionExpression`、`ArrowFunctionExpression` 或者 `NewExpression`，处理得到 `FunctionInfo`
  - 如果 `init` 是 `Identifier`，查找同名函数对象
  - 如果 `init` 是其他类型，忽略
4. 如果是 `AssignmentExpression`，查看 `right` 的类型
  - 如果 `right` 是 `FunctionExpression`、`ArrowFunctionExpression` 或者 `NewExpression`，处理得到 `FunctionInfo`
  - 如果 `right` 是 `Identifier`，查找同名函数对象
  - 如果 `right` 是其他类型，忽略

## 模块

1. `EsprimaWrapper`
2. `NodeProcessor`
   - `FunctionDeclarationProcessor`
   - `CallExpressionProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
   - `ObjectStatementProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
     - `IdentifierProcessor`
     - `MemberExpressionProcessor`
   - `VariableDeclaratorProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
     - `IdentifierProcessor`
     - `MemberExpressionProcessor`
   - `AssignmentExpressionProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
     - `IdentifierProcessor`
     - `MemberExpressionProcessor`

## 函数定义形式

### 函数声明

```js
function sum(a, b) {return a + b;}
```

```ts
interface FunctionDeclaration 
{ 
    type: 'FunctionDeclaration'; 
    id: Identifier | null; 
    params: FunctionParameter[]; 
    body: BlockStatement; 
    generator: boolean;
    async: boolean;
    expression: false; 
}
```

### 函数表达式

```js
function(a, b) {return a + b;}
```

```ts
interface FunctionExpression 
{
    type: 'FunctionExpression'; 
    id: Identifier | null; 
    params: FunctionParameter[]; 
    body: BlockStatement; 
    generator: boolean;
    async: boolean;
    expression: boolean; 
}
```

### 箭头函数表达式

```js
(a, b) => a + b;
(a, b) => {return a + b;};
```

```ts
interface ArrowFunctionExpression 
{ 
    type: 'ArrowFunctionExpression'; 
    id: Identifier | null;
    params: FunctionParameter[];
    body: BlockStatement | Expression; 
    generator: boolean;
    async: boolean;
    expression: false; 
}
```

### 构造函数形式

```js
new Function('a', 'b', 'return a+b');
```

```ts
interface NewExpression 
{
    type: 'NewExpression';
    callee: Expression;
    arguments: ArgumentListElement[];
}
```

## 函数引用传递形式

### 变量初始化

```js
const sum = /*任意函数表达式*/;
const sum2 = sum;   // 需要考虑右侧可能是对象的一部分
```

```ts
interface VariableDeclarator 
{
    type: 'VariableDeclarator';
    id: Identifier | BindingPattern; 
    init: Expression | null;
}
```

### 赋值

```js
const sum = /*任意函数表达式*/;
sum = /*其他函数表达式或者函数引用*/
// 需要考虑两边都是对象的一部分的情况
```

```ts
interface AssignmentExpression 
{
    type: 'AssignmentExpression';
    operator: '=' | '*=' | '**=' | '/=' | '%=' | '+=' | '-=' |
        '<<=' | '>>=' | '>>>=' | '&=' | '^=' | '|=';
    left: Expression;
    right: Expression;
}
```

### 传参

```js
sum((a, b) =>
{
    return a + b;
})
``` 

```ts
interface CallExpression
{
    type: 'CallExpression';
    callee: Expression;
    arguments: ArgumentListElement[];
}
```