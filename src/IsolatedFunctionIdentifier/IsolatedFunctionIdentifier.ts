import {FunctionCall} from '../DataClass/FunctionCall';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {FunctionCallToHashFunctionCallConverter} from '../FunctionCallToHashFunctionCallConverter';
import {HashFunctionCall} from '../DataClass/HashFunctionCall';
import {getSetComplement} from '../Function/Set';

export class IsolatedFunctionIdentifier
{
    private readonly callerHashToHashFunctionCalls: ReadonlyMap<string, Readonly<HashFunctionCall>>;
    private readonly hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>;

    constructor(functionCalls: ReadonlyArray<Readonly<FunctionCall>>, hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>)
    {
        this.callerHashToHashFunctionCalls = IsolatedFunctionIdentifier.getCallerHashToHashFunctionCallsFromFunctionCalls(functionCalls);
        this.hashToFunctionInfo = hashToFunctionInfo;
    }

    private static getCallerHashToHashFunctionCallsFromFunctionCalls(functionCalls: ReadonlyArray<Readonly<FunctionCall>>): Map<string, HashFunctionCall>
    {
        const hashFunctionCalls = IsolatedFunctionIdentifier.getHashFunctionCallsFromFunctionCalls(functionCalls);
        const callerHashToHashFunctionCalls: Map<string, HashFunctionCall> = new Map();
        hashFunctionCalls.forEach(hashFunctionCall =>
            callerHashToHashFunctionCalls.set(hashFunctionCall.callerHash, hashFunctionCall));
        return callerHashToHashFunctionCalls;
    }

    private static getHashFunctionCallsFromFunctionCalls(functionCalls: ReadonlyArray<Readonly<FunctionCall>>): HashFunctionCall[]
    {
        return functionCalls.map(functionCall =>
        {
            const converter = new FunctionCallToHashFunctionCallConverter(functionCall);
            return converter.getHashFunctionCall();
        });
    }

    public getIsolatedFunctions(): FunctionInfo[]
    {
        const globalHash = FunctionInfo.getGlobalHash();
        const globalHashFunctionCall = this.callerHashToHashFunctionCalls.get(globalHash);
        if (globalHashFunctionCall === undefined)    // no global means all functions are dead ones
        {
            console.warn('no global found in IsolatedFunctionIdentifier');
            return Array.from(this.hashToFunctionInfo.values());
        }
        const reachableFunctionCallHashes = this.getReachableFunctionCallHashesFromGlobalHashFunctionCall(globalHashFunctionCall);
        return this.getIsolatedFunctionInfosFromReachableFunctionCallHashes(reachableFunctionCallHashes);
    }

    private getReachableFunctionCallHashesFromGlobalHashFunctionCall(globalHashFunctionCall: HashFunctionCall): Set<string>
    {
        const reachableFunctionCallHashes: Set<string> = new Set(globalHashFunctionCall.calleeHashes);
        const lastCalleeHashes: Set<string> = new Set(globalHashFunctionCall.calleeHashes);

        while (lastCalleeHashes.size !== 0)
        {
            const currentCalleeHashes: typeof lastCalleeHashes = new Set();
            lastCalleeHashes.forEach(calleeHash =>
            {
                const hashFunctionCallAsCaller = this.callerHashToHashFunctionCalls.get(calleeHash);
                if (hashFunctionCallAsCaller !== undefined)  // may call functions that we didn't found...ignore
                {
                    hashFunctionCallAsCaller.calleeHashes.forEach(calleeHash => currentCalleeHashes.add(calleeHash));
                }
            });

            lastCalleeHashes.clear();
            currentCalleeHashes.forEach(calleeHash =>
            {
                if (!reachableFunctionCallHashes.has(calleeHash))
                {
                    reachableFunctionCallHashes.add(calleeHash);
                    lastCalleeHashes.add(calleeHash);
                }
            });
        }
        return reachableFunctionCallHashes;
    }

    private getIsolatedFunctionInfosFromReachableFunctionCallHashes(reachableFunctionCallHashes: Set<string>): FunctionInfo[]
    {
        const allFunctionInfoHashes = new Set(this.hashToFunctionInfo.keys());
        allFunctionInfoHashes.delete(FunctionInfo.getGlobalHash()); // remove global first
        const isolatedFunctionInfoHashesSet = getSetComplement(allFunctionInfoHashes, reachableFunctionCallHashes);
        const isolatedFunctionInfoHashes = Array.from(isolatedFunctionInfoHashesSet.values());
        const isolatedFunctionInfos: FunctionInfo[] = [];
        isolatedFunctionInfoHashes.forEach(isolatedFunctionInfoHash =>
        {
            const functionInfo = this.hashToFunctionInfo.get(isolatedFunctionInfoHash);
            if (functionInfo !== undefined)  // may find dead functions that we didn't found before...ignore
            {
                isolatedFunctionInfos.push(functionInfo);
            }
        });
        return isolatedFunctionInfos;
    }
}