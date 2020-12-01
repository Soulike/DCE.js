import {FunctionInfo} from '../../DataClass/FunctionInfo';

export class SimpleFunctionCall
{
    public readonly caller: Readonly<Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>>;   // 调用函数
    public readonly callee: Readonly<Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>>;   // 被调用函数

    constructor(caller: Readonly<Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>>, callee: Readonly<Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>>)
    {
        this.caller = caller;
        this.callee = callee;
    }

    getHash(): string
    {
        return FunctionInfo.getHash(this.caller) + FunctionInfo.getHash(this.callee);
    }
}