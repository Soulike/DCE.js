import {getNamesFromChainedMemberExpression} from './Function';
// import * as ESTree from 'estree';

describe(getNamesFromChainedMemberExpression, () =>
{
    it('should get name of chained MemberExpression', function ()
    {
        // a.b['c'].d[0].e
        const testcase: any = {
            'type': 'MemberExpression',
            'computed': false,
            'object': {
                'type': 'MemberExpression',
                'computed': true,
                'object': {
                    'type': 'MemberExpression',
                    'computed': false,
                    'object': {
                        'type': 'MemberExpression',
                        'computed': true,
                        'object': {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': {
                                'type': 'Identifier',
                                'name': 'a',
                                'range': [
                                    6,
                                    7,
                                ],
                            },
                            'property': {
                                'type': 'Identifier',
                                'name': 'b',
                                'range': [
                                    8,
                                    9,
                                ],
                            },
                            'range': [
                                6,
                                9,
                            ],
                        },
                        'property': {
                            'type': 'Literal',
                            'value': 'c',
                            'raw': '\'c\'',
                            'range': [
                                10,
                                13,
                            ],
                        },
                        'range': [
                            6,
                            14,
                        ],
                    },
                    'property': {
                        'type': 'Identifier',
                        'name': 'd',
                        'range': [
                            15,
                            16,
                        ],
                    },
                    'range': [
                        6,
                        16,
                    ],
                },
                'property': {
                    'type': 'Literal',
                    'value': 0,
                    'raw': '0',
                    'range': [
                        17,
                        18,
                    ],
                },
                'range': [
                    6,
                    19,
                ],
            },
            'property': {
                'type': 'Identifier',
                'name': 'e',
                'range': [
                    20,
                    21,
                ],
            },
            'range': [
                6,
                21,
            ],
        };
        expect(getNamesFromChainedMemberExpression(testcase)).toEqual([
            'e', '0.e',
            'd.0.e', 'c.d.0.e',
            'b.c.d.0.e', 'a.b.c.d.0.e']);
    });
});