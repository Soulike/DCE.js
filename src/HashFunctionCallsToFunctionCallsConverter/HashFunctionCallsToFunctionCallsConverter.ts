import {HashFunctionCall} from '../DataClass/HashFunctionCall';
import {FunctionCall} from '../DataClass/FunctionCall';
import {FunctionInfo} from '../DataClass/FunctionInfo';

export class HashFunctionCallsToFunctionCallsConverter
{
    private readonly hashFunctionCalls: Readonly<Readonly<HashFunctionCall>[]>;
    private readonly hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>;

    constructor(hashFunctionCalls: Readonly<Readonly<HashFunctionCall>[]>, hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>)
    {
        this.hashFunctionCalls = hashFunctionCalls;
        this.hashToFunctionInfo = hashToFunctionInfo;
    }

    public getFunctionCalls(): (FunctionCall | null)[]
    {
        return this.hashFunctionCalls.map(hashFunctionCall => this.getFunctionCall(hashFunctionCall));
    }

    /**
     * @return return null if caller FunctionInfo was not found in functionInfos
     * */
    private getFunctionCall(hashFunctionCall: HashFunctionCall): FunctionCall | null
    {
        const {callerHash, calleeHashes} = hashFunctionCall;
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