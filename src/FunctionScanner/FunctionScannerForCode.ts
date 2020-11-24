import {FunctionInfo} from '../DataClass/FunctionInfo';
import {EsprimaForCode} from './EsprimaWrapper';
import {NodeProcessor} from './NodeProcessor';
import {ASTNodeFilter} from './EsprimaWrapper/ASTNodeFilter';

export class FunctionScannerForCode
{
    private readonly code: string;

    constructor(code: string)
    {
        this.code = code;
    }

    public async getPartialFunctionInfos(): Promise<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[]>
    {
        const esprimaForCode = new EsprimaForCode(this.code, new ASTNodeFilter());
        const nodes = await esprimaForCode.getNodes();
        const partialFunctionInfos: Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] = [];
        for (const node of nodes)
        {
            const nodeProcessor = new NodeProcessor(node);
            const partialFunctionInfosFromNode = nodeProcessor.getPartialFunctionInfo();
            if (partialFunctionInfosFromNode !== null)
            {
                if (Array.isArray(partialFunctionInfosFromNode))
                {
                    partialFunctionInfos.push(...partialFunctionInfosFromNode);
                }
                else
                {
                    partialFunctionInfos.push(partialFunctionInfosFromNode);
                }
            }
        }
        return partialFunctionInfos;
    }
}