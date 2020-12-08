import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {SimpleFunctionCall} from '../Interface';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {SimpleToHashFunctionCallConverter} from './SimpleToHashFunctionCallConverter';
import {HashFunctionCall} from '../../DataClass/HashFunctionCall';
import {HashFunctionCallsToFunctionCallsConverter} from '../../HashFunctionCallsToFunctionCallsConverter';

export class SimpleFunctionCallProcessor implements CallGraphBuilder
{
    private readonly simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>;
    private readonly functionInfos: Readonly<Readonly<FunctionInfo>[]>;
    private readonly sourceCodeEncoding: BufferEncoding;

    constructor(simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>, functionInfos: Readonly<Readonly<FunctionInfo>[]>, sourceCodeEncoding: BufferEncoding = 'utf-8')
    {
        this.simpleFunctionCalls = simpleFunctionCalls;
        this.functionInfos = functionInfos;
        this.sourceCodeEncoding = sourceCodeEncoding;
    }

    public async getCallGraph(): Promise<FunctionCall[]>
    {
        const mergedHashFunctionCalls = await this.getMergedHashFunctionCalls();
        const functionCallsWithNulls: (FunctionCall | null)[] = this.convertMergedHashFunctionCallsToFunctionCalls(mergedHashFunctionCalls);
        return functionCallsWithNulls.filter(value => value !== null) as FunctionCall[];    // ignore nulls
    }

    private async getMergedHashFunctionCalls(): Promise<HashFunctionCall[]>
    {
        const simpleToHashFunctionCallConverter = new SimpleToHashFunctionCallConverter(this.simpleFunctionCalls, this.sourceCodeEncoding);
        const unmergedHashFunctionCalls = await simpleToHashFunctionCallConverter.getHashFunctionCalls();
        const callerHashToCalleeHashes: Map<string, Set<string>> = new Map();    // 'hash of caller' to 'hashes of callee'
        unmergedHashFunctionCalls.forEach(({callerHash, calleeHash}) =>
        {
            if (callerHash !== calleeHash)   // ignore recursive
            {
                const calleeHashes = callerHashToCalleeHashes.get(callerHash);
                if (calleeHashes === undefined)
                {
                    callerHashToCalleeHashes.set(callerHash, new Set([calleeHash]));
                }
                else
                {
                    calleeHashes.add(calleeHash);
                }
            }
        });
        const mergedHashFunctionCalls: HashFunctionCall[] = [];
        callerHashToCalleeHashes.forEach((calleeHashes, callerHash) =>
        {
            mergedHashFunctionCalls.push(new HashFunctionCall(callerHash, Array.from(calleeHashes)));
        });
        return mergedHashFunctionCalls;
    }

    /**
     * @return return null if caller FunctionInfo was not found in previous steps
     * */
    private convertMergedHashFunctionCallsToFunctionCalls(mergedHashFunctionCalls: Readonly<Readonly<HashFunctionCall>[]>): (FunctionCall | null)[]
    {
        const hashFunctionCallsToFunctionCallsConverter = new HashFunctionCallsToFunctionCallsConverter(mergedHashFunctionCalls, this.functionInfos);
        return hashFunctionCallsToFunctionCallsConverter.getFunctionCalls();
    }
}