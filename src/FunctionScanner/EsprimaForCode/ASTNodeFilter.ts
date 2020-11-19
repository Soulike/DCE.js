import * as ESTree from 'estree';
import * as esprima from 'esprima';

export class ASTNodeFilter
{
    public static shouldKeep(node: ESTree.Node): boolean
    {
        return ASTNodeFilter.isFunctionDeclarationNode(node)
            || ASTNodeFilter.isEvalCallExpressionNode(node)
            || ASTNodeFilter.isVariableDeclarator(node)
            || ASTNodeFilter.isAssignmentExpression(node);
    }

    private static isFunctionDeclarationNode(node: ESTree.Node): boolean
    {
        return node.type === esprima.Syntax.FunctionDeclaration;
    }

    private static isEvalCallExpressionNode(node: ESTree.Node): boolean
    {
        return node.type === esprima.Syntax.CallExpression
            && node.callee.type === esprima.Syntax.Identifier
            && node.callee.name === 'eval';
    }

    private static isVariableDeclarator(node: ESTree.Node): boolean
    {
        if (node.type === esprima.Syntax.VariableDeclarator
            && node.init !== null && node.init !== undefined)
        {
            if (node.init.type === esprima.Syntax.Identifier)
            {
                return true;
            }
            if (node.init.type === esprima.Syntax.NewExpression
                && node.init.callee.type === esprima.Syntax.Identifier
                && node.init.callee.name === 'Function')
            {
                return true;
            }
            if (node.init.type === esprima.Syntax.FunctionExpression
                || node.init.type === esprima.Syntax.ArrowFunctionExpression)
            {
                return true;
            }
        }
        return false;
    }

    private static isAssignmentExpression(node: ESTree.Node): boolean
    {
        if (node.type === esprima.Syntax.AssignmentExpression)
        {
            if (node.right.type === esprima.Syntax.Identifier)
            {
                return true;
            }
            if (node.right.type === esprima.Syntax.NewExpression
                && node.right.callee.type === esprima.Syntax.Identifier
                && node.right.callee.name === 'Function')
            {
                return true;
            }
            if (node.right.type === esprima.Syntax.FunctionExpression
                || node.right.type === esprima.Syntax.ArrowFunctionExpression)
            {
                return true;
            }
        }
        return false;
    }
}