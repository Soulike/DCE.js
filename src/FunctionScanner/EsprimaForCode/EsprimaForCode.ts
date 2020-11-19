import * as ESTree from 'estree';
import * as esprima from 'esprima';
import {EsprimaWrapper} from '../Interface/EsprimaWrapper';
import {ASTNodeFilter} from '../ASTNodeFilter';

export class EsprimaForCode implements EsprimaWrapper
{
    private readonly code: string;

    constructor(code: string)
    {
        this.code = code;
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
                    if (ASTNodeFilter.shouldKeep(node))
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