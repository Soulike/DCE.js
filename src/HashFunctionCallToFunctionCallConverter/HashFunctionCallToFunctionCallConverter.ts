import {HashFunctionCall} from '../DataClass/HashFunctionCall';
import {FunctionCall} from '../DataClass/FunctionCall';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {FunctionInfoMapConverter} from '../FunctionInfoMapConverter';

export class HashFunctionCallToFunctionCallConverter
{
    private readonly hashFunctionCall: Readonly<HashFunctionCall>;
    private readonly hashToFunctionInfo: Map<string, Readonly<FunctionInfo>>;

    constructor(hashFunctionCall: Readonly<HashFunctionCall>, functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.hashFunctionCall = hashFunctionCall;
        const functionInfoMapConverter = new FunctionInfoMapConverter(functionInfos);
        this.hashToFunctionInfo = functionInfoMapConverter.getFunctionInfoMap();
    }

    /**
     * @return return null if caller FunctionInfo was not found in functionInfos
     * */
    public getFunctionCall(): FunctionCall | null
    {
        const {callerHash, calleeHashes} = this.hashFunctionCall;
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