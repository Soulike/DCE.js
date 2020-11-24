import * as ESTree from 'estree';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import {throwRangeIsUndefinedException} from '../../Function';
import {NodeProcessor} from '../Interface/NodeProcessor';

export class FunctionDeclarationProcessor implements NodeProcessor
{
    private readonly functionDeclaration: Readonly<ESTree.FunctionDeclaration>;

    constructor(functionDeclaration: Readonly<ESTree.FunctionDeclaration>)
    {
        this.functionDeclaration = functionDeclaration;
    }

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'>
    {
        const {functionDeclaration} = this;
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
        };
    }
}