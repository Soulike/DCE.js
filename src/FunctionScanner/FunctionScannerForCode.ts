import {FunctionInfo} from '../DataClass/FunctionInfo';
import {EsprimaForCode} from './EsprimaWrapper';
import {NodeProcessor} from './NodeProcessor';
import {ASTNodeFilter} from './ASTNodeFilter';
import {ASTNodeFilter as IASTNodeFilter} from './EsprimaWrapper/Interface/ASTNodeFilter';

export class FunctionScannerForCode
{
    private readonly code: string;
    private readonly astNodeFilter: IASTNodeFilter;

    constructor(code: string, astNodeFilter: IASTNodeFilter = new ASTNodeFilter())
    {
        this.code = code;
        this.astNodeFilter = astNodeFilter;
    }

    public async getPartialFunctionInfos(): Promise<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[]>
    {
        const esprimaForCode = new EsprimaForCode(this.code, this.astNodeFilter);
        const nodes = await esprimaForCode.getNodes();
        const knownPartialFunctionInfosInCurrentCode: Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] = [];
        for (const node of nodes)
        {
            const nodeProcessor = new NodeProcessor(node, knownPartialFunctionInfosInCurrentCode);
            const partialFunctionInfosFromNode = nodeProcessor.getPartialFunctionInfo();
            if (partialFunctionInfosFromNode !== null)
            {
                if (Array.isArray(partialFunctionInfosFromNode))
                {
                    knownPartialFunctionInfosInCurrentCode.push(...partialFunctionInfosFromNode);
                }
                else
                {
                    knownPartialFunctionInfosInCurrentCode.push(partialFunctionInfosFromNode);
                }
            }
        }
        return knownPartialFunctionInfosInCurrentCode;
    }
}