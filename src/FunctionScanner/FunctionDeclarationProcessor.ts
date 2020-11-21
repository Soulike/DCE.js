import * as ESTree from 'estree';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {throwRangeIsUndefinedException} from './Function';
import {NodeProcessor} from './Interface/NodeProcessor';

export class FunctionDeclarationProcessor implements NodeProcessor
{
    private readonly functionDeclaration: Readonly<ESTree.FunctionDeclaration>;

    constructor(functionDeclaration: Readonly<ESTree.FunctionDeclaration>)
    {
        this.functionDeclaration = functionDeclaration;
    }

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex' | 'name'>
    {
        const {functionDeclaration} = this;

        const name = new Set<string>();
        if (functionDeclaration.id === null)
        {
            throw new Error('Currently not supporting anonymous function declaration');
        }
        name.add(functionDeclaration.id.name);

        const {body: {range}} = functionDeclaration;
        if (range === undefined)
        {
            throwRangeIsUndefinedException();
        }
        const [bodyStartIndex, bodyEndIndex] = [range[0] + 1, range[1] - 1];
        return {
            bodyStartIndex,
            bodyEndIndex,
            name,
        };
    }
}