export class HashFunctionCall
{
    public readonly callerHash: string;   // 调用函数
    public readonly calleeHash: string;   // 被调用函数

    constructor(callerHash: string, calleeHash: string)
    {
        this.callerHash = callerHash;
        this.calleeHash = calleeHash;
    }
}

export class MergedHashFunctionCall
{
    public readonly callerHash: string;         // 调用函数
    public readonly calleeHashes: Readonly<string[]>;     // 被调用函数

    constructor(callerHash: string, calleeHashes: Readonly<string[]>)
    {
        this.callerHash = callerHash;
        this.calleeHashes = calleeHashes;
    }
}