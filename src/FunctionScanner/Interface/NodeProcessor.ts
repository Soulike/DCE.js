import {FunctionInfo} from '../../DataClass/FunctionInfo';

export interface NodeProcessor
{
    getPartialFunctionInfo(): Partial<FunctionInfo>;
}