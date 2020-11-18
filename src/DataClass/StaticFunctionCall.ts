import {FunctionInfo} from './FunctionInfo';

export class StaticFunctionCall
{
    public readonly functionInfo: FunctionInfo;
    public readonly calleeNames: Set<string>;

    constructor(functionInfo: FunctionInfo, calleeNames: Set<string>)
    {
        this.functionInfo = functionInfo;
        this.calleeNames = calleeNames;
    }
}