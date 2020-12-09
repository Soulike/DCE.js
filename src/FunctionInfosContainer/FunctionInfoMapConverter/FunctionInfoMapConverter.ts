import {FunctionInfo} from '../../DataClass/FunctionInfo';

/**
 * @description Convert FunctionInfo[] to Map<hash, FunctionInfo>. The hash is from functionInfo.getHash()
 * */
export class FunctionInfoMapConverter<T extends Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>>
{
    private readonly functionInfos: Readonly<Readonly<T>[]>;

    constructor(functionInfos: Readonly<Readonly<T>[]>)
    {
        this.functionInfos = functionInfos;
    }

    public getFunctionInfoMap(): Map<string, T>
    {
        const {functionInfos} = this;
        const functionInfoMap = new Map<string, T>();
        functionInfos.forEach(functionInfo =>
        {
            functionInfoMap.set(FunctionInfo.getHash(functionInfo), functionInfo);
        });
        return functionInfoMap;
    }
}