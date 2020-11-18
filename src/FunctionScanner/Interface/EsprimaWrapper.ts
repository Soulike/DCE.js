import * as ESTree from 'estree';

export interface EsprimaWrapper
{
    getFunctionRelatedASTNodes(): Promise<ESTree.Node[]>
}