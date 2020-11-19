# FunctionScanner

## 说明

通过调用 esprima 获取某个文件当中所有的方法定义信息。

## 模块

### EsprimaForFile

包装 esprima，输入文件路径，输出所有 type 为

- FunctionDeclaration
- CallExpression 且 callee 的 name 为 eval
- VariableDeclarator 且 init 的 type 为 Identifier
- AssignmentExpression 且 right 的 type 为 Identifier

以下四种情况一定是方法的定义：

- VariableDeclarator 且 init 的 type 为 NewExpression，callee 是 Function
- AssignmentExpression 且 right 的 type 为 NewExpression，callee 是 Function
- VariableDeclarator 且 init 的 type 为 FunctionExpression 或 ArrowFunctionExpression
- AssignmentExpression 且 right 的 type 为 FunctionExpression 或 ArrowFunctionExpression

### EsprimaForCode

包装 esprima，输入代码文本，其他规则和上面一致。

该类主要用于应对 eval 中的函数体部分。

### FunctionDeclarationProcessor

输入 FunctionDeclaration 类实例，输出 `FunctionInfo`

### VariableDeclaratorProcessor

输入 VariableDeclarator 类实例和已知的所有 `FunctionInfo`，输出 `FunctionInfo` 或者 `null`。

只有发生引用传递或者值传递时才会返回 `null`，因为不会有新的定义产生，新的名字会被直接加入对应的 `FunctionInfo` 对象。

## 函数定义形式

```js
function sum(a, b) {return a + b;}

{
    "type": "FunctionDeclaration",
    "id": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            10,
            13
        ]
    },
    "params": [
        {
            "type": "Identifier",
            "name": "a",
            "range": [
                14,
                15
            ]
        },
        {
            "type": "Identifier",
            "name": "b",
            "range": [
                17,
                18
            ]
        }
    ],
    "body": {
        "type": "BlockStatement",
        "body": [
            {
                "type": "ReturnStatement",
                "argument": {
                    "type": "BinaryExpression",
                    "operator": "+",
                    "left": {
                        "type": "Identifier",
                        "name": "a",
                        "range": [
                            28,
                            29
                        ]
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "b",
                        "range": [
                            32,
                            33
                        ]
                    },
                    "range": [
                        28,
                        33
                    ]
                },
                "range": [
                    21,
                    34
                ]
            }
        ],
        "range": [
            20,
            35
        ]
    },
    "generator": false,
    "expression": false,
    "async": false,
    "range": [
        1,
        35
    ]
}
```

```js
var sum = function (a, b) {return a + b;}

{
    "type": "VariableDeclarator",
    "id": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            5,
            8
        ]
    },
    "init": {
        "type": "FunctionExpression",
        "id": null,
        "params": [
            {
                "type": "Identifier",
                "name": "a",
                "range": [
                    21,
                    22
                ]
            },
            {
                "type": "Identifier",
                "name": "b",
                "range": [
                    24,
                    25
                ]
            }
        ],
        "body": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "BinaryExpression",
                        "operator": "+",
                        "left": {
                            "type": "Identifier",
                            "name": "a",
                            "range": [
                                35,
                                36
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "b",
                            "range": [
                                39,
                                40
                            ]
                        },
                        "range": [
                            35,
                            40
                        ]
                    },
                    "range": [
                        28,
                        41
                    ]
                }
            ],
            "range": [
                27,
                42
            ]
        },
        "generator": false,
        "expression": false,
        "async": false,
        "range": [
            11,
            42
        ]
    },
    "range": [
        5,
        42
    ]
}
```

```js
sum = function (a, b) {return a + b;}

{
    "type": "AssignmentExpression",
    "operator": "=",
    "left": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            1,
            4
        ]
    },
    "right": {
        "type": "FunctionExpression",
        "id": null,
        "params": [
            {
                "type": "Identifier",
                "name": "a",
                "range": [
                    17,
                    18
                ]
            },
            {
                "type": "Identifier",
                "name": "b",
                "range": [
                    20,
                    21
                ]
            }
        ],
        "body": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "BinaryExpression",
                        "operator": "+",
                        "left": {
                            "type": "Identifier",
                            "name": "a",
                            "range": [
                                31,
                                32
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "b",
                            "range": [
                                35,
                                36
                            ]
                        },
                        "range": [
                            31,
                            36
                        ]
                    },
                    "range": [
                        24,
                        37
                    ]
                }
            ],
            "range": [
                23,
                38
            ]
        },
        "generator": false,
        "expression": false,
        "async": false,
        "range": [
            7,
            38
        ]
    },
    "range": [
        1,
        38
    ]
}
```

```js
var sum = (a, b) => {return a + b;}

{
    "type": "VariableDeclarator",
    "id": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            5,
            8
        ]
    },
    "init": {
        "type": "ArrowFunctionExpression",
        "id": null,
        "params": [
            {
                "type": "Identifier",
                "name": "a",
                "range": [
                    12,
                    13
                ]
            },
            {
                "type": "Identifier",
                "name": "b",
                "range": [
                    15,
                    16
                ]
            }
        ],
        "body": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "BinaryExpression",
                        "operator": "+",
                        "left": {
                            "type": "Identifier",
                            "name": "a",
                            "range": [
                                29,
                                30
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "b",
                            "range": [
                                33,
                                34
                            ]
                        },
                        "range": [
                            29,
                            34
                        ]
                    },
                    "range": [
                        22,
                        35
                    ]
                }
            ],
            "range": [
                21,
                36
            ]
        },
        "generator": false,
        "expression": false,
        "async": false,
        "range": [
            11,
            36
        ]
    },
    "range": [
        5,
        36
    ]
}
```

```js
eval(`function sum(a, b) {return a+b;}`);

{
    "type": "CallExpression",
    "callee": {
        "type": "Identifier",
        "name": "eval",
        "range": [
            1,
            5
        ]
    },
    "arguments": [
        {
            "type": "TemplateLiteral",
            "quasis": [
                {
                    "type": "TemplateElement",
                    "value": {
                        "raw": "function sum(a, b) {return a+b;}",
                        "cooked": "function sum(a, b) {return a+b;}"
                    },
                    "tail": true,
                    "range": [
                        6,
                        40
                    ]
                }
            ],
            "expressions": [],
            "range": [
                6,
                40
            ]
        }
    ],
    "range": [
        1,
        41
    ]
}
```

```js
const sum = new Function('a', 'b', 'return a + b');

{
    "type": "VariableDeclarator",
    "id": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            7,
            10
        ]
    },
    "init": {
        "type": "NewExpression",
        "callee": {
            "type": "Identifier",
            "name": "Function",
            "range": [
                17,
                25
            ]
        },
        "arguments": [
            {
                "type": "Literal",
                "value": "a",
                "raw": "'a'",
                "range": [
                    26,
                    29
                ]
            },
            {
                "type": "Literal",
                "value": "b",
                "raw": "'b'",
                "range": [
                    31,
                    34
                ]
            },
            {
                "type": "Literal",
                "value": "return a + b",
                "raw": "'return a + b'",
                "range": [
                    36,
                    50
                ]
            }
        ],
        "range": [
            13,
            51
        ]
    },
    "range": [
        7,
        51
    ]
}
```

此外，需要考虑函数引用的传递：

```js
var sum = function (a, b) {return a + b;}
var sum2 = sum;

{
    "type": "VariableDeclarator",
    "id": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            5,
            8
        ]
    },
    "init": {
        "type": "FunctionExpression",
        "id": null,
        "params": [
            {
                "type": "Identifier",
                "name": "a",
                "range": [
                    21,
                    22
                ]
            },
            {
                "type": "Identifier",
                "name": "b",
                "range": [
                    24,
                    25
                ]
            }
        ],
        "body": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "BinaryExpression",
                        "operator": "+",
                        "left": {
                            "type": "Identifier",
                            "name": "a",
                            "range": [
                                35,
                                36
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "b",
                            "range": [
                                39,
                                40
                            ]
                        },
                        "range": [
                            35,
                            40
                        ]
                    },
                    "range": [
                        28,
                        41
                    ]
                }
            ],
            "range": [
                27,
                42
            ]
        },
        "generator": false,
        "expression": false,
        "async": false,
        "range": [
            11,
            42
        ]
    },
    "range": [
        5,
        42
    ]
}
{
    "type": "VariableDeclarator",
    "id": {
        "type": "Identifier",
        "name": "sum2",
        "range": [
            47,
            51
        ]
    },
    "init": {
        "type": "Identifier",
        "name": "sum",
        "range": [
            54,
            57
        ]
    },
    "range": [
        47,
        57
    ]
}
```

另外还需要考虑对象中的定义和赋值。