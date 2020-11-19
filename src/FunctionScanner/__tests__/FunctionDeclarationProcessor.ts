import {FunctionDeclarationProcessor} from '../FunctionDeclarationProcessor';
import {ScriptFile} from '../../DataClass/ScriptFile';
import * as ESTree from 'estree';
import {FunctionInfo} from '../../DataClass/FunctionInfo';

describe(FunctionDeclarationProcessor, () =>
{
    // from 'function sum(a, b) {return a + b;}'
    const astNode: ESTree.FunctionDeclaration = {
        'type': 'FunctionDeclaration',
        'id': {
            'type': 'Identifier',
            'name': 'sum',
            'range': [
                10,
                13,
            ],
        },
        'params': [
            {
                'type': 'Identifier',
                'name': 'a',
                'range': [
                    14,
                    15,
                ],
            },
            {
                'type': 'Identifier',
                'name': 'b',
                'range': [
                    17,
                    18,
                ],
            },
        ],
        'body': {
            'type': 'BlockStatement',
            'body': [
                {
                    'type': 'ReturnStatement',
                    'argument': {
                        'type': 'BinaryExpression',
                        'operator': '+',
                        'left': {
                            'type': 'Identifier',
                            'name': 'a',
                            'range': [
                                28,
                                29,
                            ],
                        },
                        'right': {
                            'type': 'Identifier',
                            'name': 'b',
                            'range': [
                                32,
                                33,
                            ],
                        },
                        'range': [
                            28,
                            33,
                        ],
                    },
                    'range': [
                        21,
                        34,
                    ],
                },
            ],
            'range': [
                20,
                35,
            ],
        },
        'generator': false,
        'async': false,
        'range': [
            1,
            35,
        ],
    };
    const scriptFile = new ScriptFile('/a/b/c.js');

    it('should process FunctionDeclaration', function ()
    {
        const functionDeclarationProcessor = new FunctionDeclarationProcessor(astNode, scriptFile);
        expect(functionDeclarationProcessor.getFunctionInfo()).toEqual(
            new FunctionInfo(scriptFile, 20, 35, new Set(['sum'])));
    });
});