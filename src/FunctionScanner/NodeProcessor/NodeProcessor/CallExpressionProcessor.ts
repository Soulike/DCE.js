import {NodeProcessor} from '../Interface/NodeProcessor';
import * as ESTree from 'estree';
import * as esprima from 'esprima';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import {FunctionExpressionProcessor} from '../RightProcessor/FunctionExpressionProcessor';
import {ArrowFunctionExpressionProcessor} from '../RightProcessor/ArrowFunctionExpressionProcessor';

/**
 * @description process function expression as function parameter. e.g. func(() => 1+1, () => 1+2)
 * */
export class CallExpressionProcessor implements NodeProcessor
{
    private readonly callExpression: Readonly<ESTree.CallExpression>;

    constructor(callExpression: Readonly<ESTree.CallExpression>)
    {
        this.callExpression = callExpression;
    }

    getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] | null
    {
        const {callExpression: {arguments: args}} = this;
        const partialFunctionInfos: Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] = [];
        args.forEach(node =>
        {
            if (node.type === esprima.Syntax.FunctionExpression)
            {
                const processor = new FunctionExpressionProcessor(node);
                partialFunctionInfos.push({name: new Set(), ...processor.getPartialFunctionInfo()});
            }
            else if (node.type === esprima.Syntax.ArrowFunctionExpression)
            {
                const processor = new ArrowFunctionExpressionProcessor(node);
                partialFunctionInfos.push({name: new Set(), ...processor.getPartialFunctionInfo()});
            }
        });
        return partialFunctionInfos;
    }
}