import * as ESTree from 'estree';

export interface ASTNodeFilter
{
    shouldKeepNode(node: ESTree.Node): boolean
}