import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {SimpleFunctionCall} from '../Interface';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {FunctionInfoMapConverter} from '../../FunctionInfoMapConverter';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {SimpleToHashFunctionCallConverter} from './SimpleToHashFunctionCallConverter';
import {HashFunctionCall} from '../../DataClass/HashFunctionCall';

export class SimpleFunctionCallProcessor implements CallGraphBuilder
{
    private readonly simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>;
    private readonly hashToFunctionInfo: Map<string, FunctionInfo>;
    private readonly sourceCodeEncoding: BufferEncoding;

    constructor(simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>, functionInfos: Readonly<Readonly<FunctionInfo>[]>, sourceCodeEncoding: BufferEncoding = 'utf-8')
    {
        this.simpleFunctionCalls = simpleFunctionCalls;
        const converter = new FunctionInfoMapConverter(functionInfos);
        this.hashToFunctionInfo = converter.getFunctionInfoMap();
        this.sourceCodeEncoding = sourceCodeEncoding;
    }

    public async getCallGraph(): Promise<FunctionCall[]>
    {
        const mergedHashFunctionCalls = await this.getMergedHashFunctionCalls();
        const functionCalls: FunctionCall[] = [];
        mergedHashFunctionCalls.forEach(mergedHashFunctionCall =>
        {
            const functionCall = this.convertMergedHashFunctionCallToFunctionCall(mergedHashFunctionCall);
            if (functionCall !== null)
            {
                functionCalls.push(functionCall);
            }
        });
        return functionCalls;
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
    private convertMergedHashFunctionCallToFunctionCall(mergedHashFunctionCall: HashFunctionCall): FunctionCall | null
    {
        const {callerHash, calleeHashes} = mergedHashFunctionCall;
        const caller = this.hashToFunctionInfo.get(callerHash);
        if (caller === undefined)
        {
            return null;
        }
        const callees: FunctionInfo[] = [];
        calleeHashes.forEach(hash =>
        {
            const callee = this.hashToFunctionInfo.get(hash);
            if (callee !== undefined)    // ignore callee that was not found in previous steps
            {
                callees.push(callee);
            }
        });
        return new FunctionCall(caller, callees);
    }
}