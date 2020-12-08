export class SingleHashFunctionCall
{
    public readonly callerHash: string;   // 调用函数
    public readonly calleeHash: string;   // 被调用函数

    constructor(callerHash: string, calleeHash: string)
    {
        this.callerHash = callerHash;
        this.calleeHash = calleeHash;
    }
}