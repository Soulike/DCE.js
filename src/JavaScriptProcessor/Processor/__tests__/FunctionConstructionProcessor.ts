import {FunctionConstructionProcessor} from '../FunctionConstructionProcessor';
import {ReplaceInfo} from '../../Class/ReplaceInfo';
import {Range} from '../../Class/Range';

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
        expect(functionConstructionProcessor.getReplaceInfo())
            .toEqual(new ReplaceInfo(new Range(86, 126), `function(a,b,c){return a+b+c}`));
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
        expect(functionConstructionProcessor.getReplaceInfo())
            .toEqual(new ReplaceInfo(new Range(21, 60), `function(a,b,c){return a+b+c}`));
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
});