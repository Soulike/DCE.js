import {FunctionInfo} from '../../../DataClass/FunctionInfo';

type PartialFunctionInfo = Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'>;

export interface NodeProcessor
{
    getPartialFunctionInfo(): PartialFunctionInfo | PartialFunctionInfo[] | null;
}