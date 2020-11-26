import {FunctionInfo} from '../DataClass/FunctionInfo';

/**
 * @description Convert FunctionInfo[] to Map<hash, FunctionInfo>. The hash is from functionInfo.getHash()
 * */
export class FunctionInfoMapConverter
{
    private readonly functionInfos: Readonly<Readonly<FunctionInfo>[]>;

    constructor(functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.functionInfos = functionInfos;
    }

    public getFunctionInfoMap(): Map<string, FunctionInfo>
    {
        const {functionInfos} = this;
        const functionInfoMap = new Map<string, FunctionInfo>();
        functionInfos.forEach(functionInfo =>
        {
            functionInfoMap.set(functionInfo.getHash(), functionInfo);
        });
        return functionInfoMap;
    }
}