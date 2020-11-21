import * as ESTree from 'estree';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {NodeProcessor as INodeProcessor} from './Interface/NodeProcessor';
import * as esprima from 'esprima';
import {FunctionDeclarationProcessor} from './FunctionDeclarationProcessor';
import {VariableDeclaratorProcessor} from './VariableDeclaratorProcessor';
import {AssignmentExpressionProcessor} from './AssignmentExpressionProcessor';

export class NodeProcessor implements INodeProcessor
{
    private readonly node: ESTree.Node;
    private readonly functionInfos: FunctionInfo[];

    constructor(node: ESTree.Node)
    {
        this.node = node;
        this.functionInfos = [];
    }

    public getPartialFunctionInfo(): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | null
    {
        const {node, functionInfos} = this;
        switch (node.type)
        {
            case esprima.Syntax.FunctionDeclaration:
            {
                const processor = new FunctionDeclarationProcessor(node);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.VariableDeclarator:
            {
                const processor = new VariableDeclaratorProcessor(node, functionInfos);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.AssignmentExpression:
            {
                const processor = new AssignmentExpressionProcessor(node, functionInfos);
                return processor.getPartialFunctionInfo();
            }
            default:
            {
                return null;
            }
        }
    }
}