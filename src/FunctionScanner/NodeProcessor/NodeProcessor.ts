import * as ESTree from 'estree';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {NodeProcessor as INodeProcessor} from './Interface/NodeProcessor';
import * as esprima from 'esprima';
import {FunctionDeclarationProcessor} from './NodeProcessor/FunctionDeclarationProcessor';
import {FunctionExpressionProcessor} from './NodeProcessor/FunctionExpressionProcessor';
import {ArrowFunctionExpressionProcessor} from './NodeProcessor/ArrowFunctionExpressionProcessor';

export class NodeProcessor implements INodeProcessor
{
    private readonly node: ESTree.Node;

    constructor(node: ESTree.Node)
    {
        this.node = node;
    }

    /**
     * @description if need to add new processors, add them here. Remember to add the new node type to ASTNodeFilter.ts
     * */
    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'> | null
    {
        const {node} = this;
        switch (node.type)
        {
            case esprima.Syntax.FunctionDeclaration:
            {
                const processor = new FunctionDeclarationProcessor(node);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.FunctionExpression:
            {
                const processor = new FunctionExpressionProcessor(node);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.ArrowFunctionExpression:
            {
                const processor = new ArrowFunctionExpressionProcessor(node);
                return processor.getPartialFunctionInfo();
            }
            default:
            {
                return null;
            }
        }
    }
}