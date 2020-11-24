import {NodeProcessor} from '../Interface/NodeProcessor';
import * as ESTree from 'estree';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import * as esprima from 'esprima';
import {throwRangeIsUndefinedException} from '../../Function';

export class NewExpressionProcessor implements NodeProcessor
{
    private readonly newExpression: Readonly<ESTree.NewExpression>;

    constructor(newExpression: Readonly<ESTree.NewExpression>)
    {
        this.newExpression = newExpression;
    }

    getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'> | null
    {
        const {newExpression} = this;
        const {callee} = newExpression;
        if (callee.type !== esprima.Syntax.Identifier
            || callee.name !== 'Function')
        {
            return null;
        }
        else
        {
            const {arguments: args} = newExpression;
            if (args.length === 0)   // e.g. new Function(), no need to care
            {
                return null;
            }
            const lastArg = args[args.length - 1];
            const {range} = newExpression;
            const {range: bodyRange} = lastArg;
            if (range === undefined || bodyRange === undefined)
            {
                throwRangeIsUndefinedException();
            }
            const [startIndex, endIndex] = range;
            // remove quote marks
            if (lastArg.type === esprima.Syntax.Literal && typeof lastArg.value === 'string')
            {
                return {
                    startIndex, endIndex,
                    bodyStartIndex: bodyRange[0] + 1,
                    bodyEndIndex: bodyRange[1] - 1,
                };
            }
            else
            {
                return {
                    startIndex, endIndex,
                    bodyStartIndex: bodyRange[0],
                    bodyEndIndex: bodyRange[1],
                };
            }
        }
    }
}