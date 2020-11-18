import * as ESTree from 'estree';
import * as esprima from 'esprima';
import {EsprimaWrapper} from './Interface/EsprimaWrapper';

export class EsprimaForCode implements EsprimaWrapper
{
    private readonly code: string;

    constructor(code: string)
    {
        this.code = code;
    }

    private static shouldKeep(node: ESTree.Node): boolean
    {
        return EsprimaForCode.isFunctionDeclarationNode(node)
            || EsprimaForCode.isEvalCallExpressionNode(node)
            || EsprimaForCode.isVariableDeclarator(node)
            || EsprimaForCode.isAssignmentExpression(node);
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

    public async getFunctionRelatedASTNodes()
    {
        return new Promise<ESTree.Node[]>((resolve, reject) =>
        {
            try
            {
                const nodes: ESTree.Node[] = [];
                esprima.parseScript(this.code, {range: true}, node =>
                {
                    if (EsprimaForCode.shouldKeep(node))
                    {
                        nodes.push(node);
                    }
                });
                resolve(nodes);
            }
            catch (e)
            {
                reject(e);
            }
        });
    }
}