import {FunctionInfo} from '../../DataClass/FunctionInfo';

export interface ASTNodeProcessor
{
    getFunctionInfo(): FunctionInfo | null;
}