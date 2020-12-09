import {FunctionCall} from '../DataClass/FunctionCall';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {HashFunctionCall} from '../DataClass/HashFunctionCall';
import {FunctionCallToHashFunctionCallConverter} from '../FunctionCallToHashFunctionCallConverter';
import {HashFunctionCallsToFunctionCallsConverter} from '../HashFunctionCallsToFunctionCallsConverter';

export class FunctionCallsMerger
{
    private readonly hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>;
    private readonly functionCalls: Readonly<Readonly<FunctionCall>[]>;

    constructor(hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>, ...functionCalls: Readonly<Readonly<FunctionCall>[]>[])
    {
        this.hashToFunctionInfo = hashToFunctionInfo;
        this.functionCalls = functionCalls.flat();
    }

    public getMergedFunctionCalls(): FunctionCall[]
    {
        const mergedHashFunctionCalls: HashFunctionCall[] = this.getMergedHashFunctionCalls();
        const mergedFunctionCallsWithNulls = this.convertMergedHashFunctionCallsToFunctionCalls(mergedHashFunctionCalls);
        return mergedFunctionCallsWithNulls.filter(value => value !== null) as FunctionCall[];
    }

    private getMergedHashFunctionCalls(): HashFunctionCall[]
    {
        const unmergedHashFunctionCalls = this.getHashFunctionCalls();
        const callerHashToCalleeHashes: Map<string, Set<string>> = new Map();
        unmergedHashFunctionCalls.forEach(({callerHash, calleeHashes}) =>
        {
            const knownCalleeHashes = callerHashToCalleeHashes.get(callerHash);
            if (knownCalleeHashes === undefined)
            {
                callerHashToCalleeHashes.set(callerHash, new Set(calleeHashes));
            }
            else
            {
                calleeHashes.forEach(calleeHash => knownCalleeHashes.add(calleeHash));
            }
        });

        const mergedHashFunctionCalls: HashFunctionCall[] = [];
        callerHashToCalleeHashes.forEach((calleeHashes, callerHash) =>
        {
            mergedHashFunctionCalls.push(new HashFunctionCall(callerHash, Array.from(calleeHashes)));
        });
        return mergedHashFunctionCalls;
    }

    private getHashFunctionCalls(): HashFunctionCall[]
    {
        return this.functionCalls.map(functionCall =>
        {
            const functionCallToHashFunctionCallConverter = new FunctionCallToHashFunctionCallConverter(functionCall);
            return functionCallToHashFunctionCallConverter.getHashFunctionCall();
        });
    }

    private convertMergedHashFunctionCallsToFunctionCalls(mergedHashFunctionCalls: Readonly<Readonly<HashFunctionCall>[]>): (FunctionCall | null)[]
    {
        const hashFunctionCallsToFunctionCallsConverter = new HashFunctionCallsToFunctionCallsConverter(mergedHashFunctionCalls, this.hashToFunctionInfo);
        return hashFunctionCallsToFunctionCallsConverter.getFunctionCalls();
    }
}