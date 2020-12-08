import {HashFunctionCall} from '../DataClass/HashFunctionCall';
import {FunctionCall} from '../DataClass/FunctionCall';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {FunctionInfoMapConverter} from '../FunctionInfoMapConverter';

export class HashFunctionCallsToFunctionCallsConverter
{
    private readonly hashFunctionCalls: Readonly<Readonly<HashFunctionCall>[]>;
    private readonly hashToFunctionInfo: Map<string, Readonly<FunctionInfo>>;

    constructor(hashFunctionCalls: Readonly<Readonly<HashFunctionCall>[]>, functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.hashFunctionCalls = hashFunctionCalls;
        const functionInfoMapConverter = new FunctionInfoMapConverter(functionInfos);
        this.hashToFunctionInfo = functionInfoMapConverter.getFunctionInfoMap();
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