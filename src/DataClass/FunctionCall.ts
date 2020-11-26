import {FunctionInfo} from './FunctionInfo';

export class FunctionCall
{
    public readonly caller: Readonly<FunctionInfo>;   // 调用函数
    public readonly callee: Readonly<FunctionInfo>[]; // 被调用函数数组

    constructor(caller: Readonly<FunctionInfo>, callee: Readonly<FunctionInfo>[])
    {
        this.caller = caller;
        this.callee = callee;
    }
}