import * as ESTree from 'estree';
import {NodeProcessor} from '../Interface/NodeProcessor';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import {throwRangeIsUndefinedException} from '../../../Function/Throw';

export class FunctionExpressionProcessor implements NodeProcessor
{
    private readonly functionExpression: Readonly<ESTree.FunctionExpression>;

    constructor(functionExpression: Readonly<ESTree.FunctionExpression>)
    {
        this.functionExpression = functionExpression;
    }

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'>
    {
        const {functionExpression} = this;
        const {range} = functionExpression;
        const {body: {range: bodyRange}} = functionExpression;
        if (range === undefined || bodyRange === undefined)
        {
            throwRangeIsUndefinedException();
        }
        else
        {
            return {
                startIndex: range[0],
                endIndex: range[1],
                bodyStartIndex: bodyRange[0] + 1,
                bodyEndIndex: bodyRange[1] - 1,
            };
        }
    }
}