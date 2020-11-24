import {EvalProcessor} from '../EvalProcessor';
import {ReplaceInfo} from '../../Class/ReplaceInfo';
import {Range} from '../../Class/Range';

describe(EvalProcessor, () =>
{
    it('should process eval call', function ()
    {
        // eval('function sum(a,b){return a+b;}')
        const node: any = {
            'type': 'CallExpression',
            'callee': {
                'type': 'Identifier',
                'name': 'eval',
                'range': [
                    0,
                    4,
                ],
            },
            'arguments': [
                {
                    'type': 'Literal',
                    'value': 'function sum(a,b){return a+b;}',
                    'raw': '\'function sum(a,b){return a+b;}\'',
                    'range': [
                        5,
                        37,
                    ],
                },
            ],
            'range': [
                0,
                38,
            ],
        };
        const processor = new EvalProcessor(node);
        expect(processor.getReplaceInfo()).toEqual(new ReplaceInfo(new Range(0, 38), 'function sum(a,b){return a+b;}'));
    });

    it('should ignore other function calls', function ()
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
        const processor = new EvalProcessor(callExpression);
        expect(processor.getReplaceInfo()).toBeNull();
    });
});