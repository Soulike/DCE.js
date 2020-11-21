import * as ESTree from 'estree';
import {NodeProcessor} from '../Interface/NodeProcessor';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {throwRangeIsUndefinedException} from '../Function';

export class FunctionExpressionProcessor implements NodeProcessor
{
    private readonly functionExpression: Readonly<ESTree.FunctionExpression>;

    constructor(functionExpression: Readonly<ESTree.FunctionExpression>)
    {
        this.functionExpression = functionExpression;
    }

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex'>
    {
        const {functionExpression} = this;
        const {body: {range}} = functionExpression;
        if (range === undefined)
        {
            throwRangeIsUndefinedException();
        }
        else
        {
            return {
                bodyStartIndex: range[0] + 1,
                bodyEndIndex: range[1] - 1,
            };
        }
    }
}