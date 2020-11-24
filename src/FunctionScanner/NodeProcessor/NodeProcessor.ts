import * as ESTree from 'estree';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {NodeProcessor as INodeProcessor} from './Interface/NodeProcessor';
import * as esprima from 'esprima';
import {FunctionDeclarationProcessor} from './NodeProcessor/FunctionDeclarationProcessor';
import {VariableDeclaratorProcessor} from './NodeProcessor/VariableDeclaratorProcessor';
import {AssignmentExpressionProcessor} from './NodeProcessor/AssignmentExpressionProcessor';
import {CallExpressionProcessor} from './NodeProcessor/CallExpressionProcessor';

export class NodeProcessor implements INodeProcessor
{
    private readonly node: ESTree.Node;
    private readonly knownPartialFunctionInfos: Readonly<Readonly<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>>[]>;

    constructor(node: ESTree.Node, knownPartialFunctionInfos: Readonly<Readonly<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>>[]>)
    {
        this.node = node;
        this.knownPartialFunctionInfos = knownPartialFunctionInfos;
    }

    /**
     * @description if need to add new processors, add them here. Remember to add the new node type to ASTNodeFilter.ts
     * */
    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] | null
    {
        const {node, knownPartialFunctionInfos} = this;
        switch (node.type)
        {
            case esprima.Syntax.FunctionDeclaration:
            {
                const processor = new FunctionDeclarationProcessor(node);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.VariableDeclarator:
            {
                const processor = new VariableDeclaratorProcessor(node, knownPartialFunctionInfos);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.AssignmentExpression:
            {
                const processor = new AssignmentExpressionProcessor(node, knownPartialFunctionInfos);
                return processor.getPartialFunctionInfo();
            }
            case esprima.Syntax.CallExpression:
            {
                const processor = new CallExpressionProcessor(node);
                return processor.getPartialFunctionInfo();
            }
            default:
            {
                return null;
            }
        }
    }
}