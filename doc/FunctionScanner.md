# FunctionScanner

## 说明

通过调用 esprima 获取某个文件当中所有的函数定义。

## 流程

1. 获取所有定义函数的结点
2. 识别结点类型
3. 做适当处理

## 模块

1. `EsprimaWrapper`
2. `NodeProcessor`
   - `FunctionDeclarationProcessor`
   - `FunctionExpressionProcessor`
   - `ArrowFunctionExpressionProcessor`

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