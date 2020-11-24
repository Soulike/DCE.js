# FunctionScanner

## 说明

通过调用 esprima 获取某个文件当中所有的函数定义和传递信息。

## 流程

1. 获取所有可能存在函数定义和传递的结点
2. 识别结点类型
3. 做适当处理

## 模块

1. `EsprimaWrapper`
2. `NodeProcessor`
   - `FunctionDeclarationProcessor`
   - `CallExpressionProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
   - `VariableDeclaratorProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
     - `IdentifierProcessor`
     - `MemberExpressionProcessor`
     - `ObjectExpressionProcessor`
   - `AssignmentExpressionProcessor`
     - `FunctionExpressionProcessor`
     - `ArrowFunctionExpressionProcessor`
     - `NewExpressionProcessor`
     - `IdentifierProcessor`
     - `MemberExpressionProcessor`
     - `ObjectExpressionProcessor`

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

### 对象内赋值

```js
const obj = {
    sum: (a, b) => a + b,
}
```

```ts
interface ObjectExpression 
{ 
    type: 'ObjectExpression'; 
    properties: Property[];
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