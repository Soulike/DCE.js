import * as ESTree from 'estree';
import {NodeProcessor} from '../Interface/NodeProcessor';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import * as esprima from 'esprima';
import {FunctionExpressionProcessor} from './FunctionExpressionProcessor';
import {throwRangeIsUndefinedException} from '../../../Function/Throw';

export class ArrowFunctionExpressionProcessor implements NodeProcessor
{
    private readonly arrowFunctionExpression: Readonly<ESTree.ArrowFunctionExpression>;

    constructor(arrowFunctionExpression: Readonly<ESTree.ArrowFunctionExpression>)
    {
        this.arrowFunctionExpression = arrowFunctionExpression;
    }

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'>
    {
        const {arrowFunctionExpression} = this;
        const {body} = arrowFunctionExpression;
        // if body is a BlockStatement then the ArrowFunctionExpression is almost the same as FunctionExpression
        if (body.type === esprima.Syntax.BlockStatement) // e.g. () => {return 1+1;}
        {
            // shape ArrowFunctionExpression to FunctionExpression
            const functionExpression: ESTree.FunctionExpression = {
                ...arrowFunctionExpression,
                type: 'FunctionExpression',
                body,
            };
            const functionExpressionProcessor = new FunctionExpressionProcessor(functionExpression);
            return functionExpressionProcessor.getPartialFunctionInfo();
        }
        else    // body is a Expression, e.g. () => 1+1
        {
            const {range} = arrowFunctionExpression;
            const {range: bodyRange} = body;
            if (range === undefined || bodyRange === undefined)
            {
                throwRangeIsUndefinedException();
            }
            return {
                startIndex: range[0],
                endIndex: range[1],
                bodyStartIndex: bodyRange[0],
                bodyEndIndex: bodyRange[1],
            };
        }
    }
}