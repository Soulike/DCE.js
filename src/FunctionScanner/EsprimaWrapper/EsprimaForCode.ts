import * as ESTree from 'estree';
import * as esprima from 'esprima';
import {EsprimaWrapper} from './Interface/EsprimaWrapper';
import {ASTNodeFilter} from './Interface/ASTNodeFilter';

export class EsprimaForCode implements EsprimaWrapper
{
    private readonly code: string;
    private readonly filter: ASTNodeFilter;

    constructor(code: string, filter: ASTNodeFilter)
    {
        this.code = code;
        this.filter = filter;
    }

    public async getNodes()
    {
        const {filter} = this;
        return new Promise<ESTree.Node[]>((resolve, reject) =>
        {
            try
            {
                const nodes: ESTree.Node[] = [];
                esprima.parseScript(this.code, {range: true}, node =>
                {
                    if (filter.shouldKeepNode(node))
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