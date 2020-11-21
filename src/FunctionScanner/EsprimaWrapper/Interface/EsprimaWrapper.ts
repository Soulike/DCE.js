import * as ESTree from 'estree';

export interface EsprimaWrapper
{
    getNodes(): Promise<ESTree.Node[]>
}