import {FunctionInfo} from '../../../DataClass/FunctionInfo';

export interface NodeProcessor
{
    getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex'> | null;
}