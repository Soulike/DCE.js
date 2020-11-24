import * as ESTree from 'estree';
import * as esprima from 'esprima';
import {ASTNodeFilter as IASTNodeFilter} from './Interface/ASTNodeFilter';

export class ASTNodeFilter implements IASTNodeFilter
{
    private static readonly SYNTAX_SHOULD_BE_KEEP: Readonly<Array<string>> = Object.freeze([
        esprima.Syntax.FunctionDeclaration,
        esprima.Syntax.FunctionExpression,
        esprima.Syntax.VariableDeclarator,
        esprima.Syntax.AssignmentExpression,
        esprima.Syntax.CallExpression,
    ]);

    public shouldKeepNode(node: ESTree.Node): boolean
    {
        return ASTNodeFilter.SYNTAX_SHOULD_BE_KEEP.includes(node.type);
    }
}