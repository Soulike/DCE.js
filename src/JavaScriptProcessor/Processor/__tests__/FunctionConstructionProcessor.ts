import {FunctionConstructionProcessor} from '../FunctionConstructionProcessor';
import {Range} from '../../../Replacer';

describe(FunctionConstructionProcessor, () =>
{
    it('should process constructor', function ()
    {
        // new Function('a,b', 'c', 'return a+b+c')
        const newExpression: any = {
            'type': 'NewExpression',
            'callee': {
                'type': 'Identifier',
                'name': 'Function',
                'range': [
                    90,
                    98,
                ],
            },
            'arguments': [
                {
                    'type': 'Literal',
                    'value': 'a,b',
                    'raw': '\'a,b\'',
                    'range': [
                        99,
                        104,
                    ],
                },
                {
                    'type': 'Literal',
                    'value': 'c',
                    'raw': '\'c\'',
                    'range': [
                        106,
                        109,
                    ],
                },
                {
                    'type': 'Literal',
                    'value': 'return a+b+c',
                    'raw': '\'return a+b+c\'',
                    'range': [
                        111,
                        125,
                    ],
                },
            ],
            'range': [
                86,
                126,
            ],
        };
        const functionConstructionProcessor = new FunctionConstructionProcessor(newExpression);
        const replaceInfo = functionConstructionProcessor.getReplaceInfo();
        expect(replaceInfo).not.toBeNull();
        if (replaceInfo !== null)
        {
            expect(replaceInfo.range).toEqual(new Range(86, 126));
            // 因为中间有 5 位的随机函数名，所以断开检查
            expect(replaceInfo.code.slice(0, 'function '.length)).toBe('function ');
            expect(replaceInfo.code.slice('function '.length + 5)).toBe('(a,b,c){return a+b+c}');
        }
    });

    it('should process function call', function ()
    {
        // Function('a', 'b', 'c', 'return a+b+c')
        const callExpression: any = {
            'type': 'CallExpression',
            'callee': {
                'type': 'Identifier',
                'name': 'Function',
                'range': [
                    21,
                    29,
                ],
            },
            'arguments': [
                {
                    'type': 'Literal',
                    'value': 'a',
                    'raw': '\'a\'',
                    'range': [
                        30,
                        33,
                    ],
                },
                {
                    'type': 'Literal',
                    'value': 'b',
                    'raw': '\'b\'',
                    'range': [
                        35,
                        38,
                    ],
                },
                {
                    'type': 'Literal',
                    'value': 'c',
                    'raw': '\'c\'',
                    'range': [
                        40,
                        43,
                    ],
                },
                {
                    'type': 'Literal',
                    'value': 'return a+b+c',
                    'raw': '\'return a+b+c\'',
                    'range': [
                        45,
                        59,
                    ],
                },
            ],
            'range': [
                21,
                60,
            ],
        };
        const functionConstructionProcessor = new FunctionConstructionProcessor(callExpression);
        const replaceInfo = functionConstructionProcessor.getReplaceInfo();
        expect(replaceInfo).not.toBeNull();
        if (replaceInfo !== null)
        {
            expect(replaceInfo.range).toEqual(new Range(21, 60));
            expect(replaceInfo.code.slice(0, 'function '.length)).toBe('function ');
            expect(replaceInfo.code.slice('function '.length + 5)).toBe('(a,b,c){return a+b+c}');
        }
    });

    it('should return null if it is not a Function call', function ()
    {
        const node: any = {
            'type': 'NewExpression',
            'callee': {
                'type': 'Identifier',
                'name': 'Array',
                'range': [
                    14,
                    19,
                ],
            },
            'arguments': [],
            'range': [
                10,
                21,
            ],
        };
        const functionConstructionProcessor = new FunctionConstructionProcessor(node);
        expect(functionConstructionProcessor.getReplaceInfo()).toBeNull();
    });

    it('should return null if Function is called without parameter', function ()
    {
        // Function()
        const callExpression: any = {
            'type': 'CallExpression',
            'callee': {
                'type': 'Identifier',
                'name': 'Function',
                'range': [
                    21,
                    29,
                ],
            },
            'arguments': [],
            'range': [
                21,
                60,
            ],
        };
        const functionConstructionProcessor = new FunctionConstructionProcessor(callExpression);
        expect(functionConstructionProcessor.getReplaceInfo()).toBeNull();
    });
});