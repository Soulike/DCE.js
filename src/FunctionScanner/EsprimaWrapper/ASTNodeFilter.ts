import * as ESTree from 'estree';
import * as esprima from 'esprima';

export class ASTNodeFilter
{
    private static readonly SYNTAX_SHOULD_BE_KEEP: Readonly<Array<string>> = Object.freeze([
        esprima.Syntax.FunctionExpression,
        esprima.Syntax.VariableDeclarator,
        esprima.Syntax.AssignmentExpression,
        esprima.Syntax.CallExpression,
    ]);

    public static shouldKeep(node: ESTree.Node): boolean
    {
        return ASTNodeFilter.SYNTAX_SHOULD_BE_KEEP.includes(node.type);
    }
}