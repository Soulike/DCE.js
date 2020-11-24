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

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>
    {
        const {functionDeclaration} = this;

        const name = new Set<string>();
        if (functionDeclaration.id === null)
        {
            throw new Error('Currently not supporting anonymous function declaration');
        }
        name.add(functionDeclaration.id.name);

        const {range, body: {range: bodyRange}} = functionDeclaration;
        if (range === undefined || bodyRange === undefined)
        {
            throwRangeIsUndefinedException();
        }
        const [startIndex, endIndex] = range;
        const [bodyStartIndex, bodyEndIndex] = [bodyRange[0] + 1, bodyRange[1] - 1];
        return {
            startIndex,
            endIndex,
            bodyStartIndex,
            bodyEndIndex,
            name,
        };
    }
}