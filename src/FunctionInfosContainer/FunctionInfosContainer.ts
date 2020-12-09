import {FunctionInfo} from '../DataClass/FunctionInfo';
import {FunctionInfoMapConverter} from './FunctionInfoMapConverter';

export class FunctionInfosContainer
{
    private readonly functionInfos: FunctionInfo[];
    private readonly hashToFunctionInfos: Map<string, FunctionInfo>;

    constructor(functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.functionInfos = Array.from(functionInfos);

        const converter = new FunctionInfoMapConverter(functionInfos);
        this.hashToFunctionInfos = converter.getFunctionInfoMap();
    }

    public getFunctionInfos(): Readonly<Readonly<FunctionInfo>[]>
    {
        return this.functionInfos;
    }

    public getHashToFunctionInfos(): ReadonlyMap<string, Readonly<FunctionInfo>>
    {
        return this.hashToFunctionInfos;
    }

    public addFunctionInfo(functionInfo: Readonly<FunctionInfo>): void
    {
        const hash = functionInfo.getHash();
        if (this.hashToFunctionInfos.has(hash))
        {
            throw new Error(`functionInfo ${JSON.stringify(functionInfo)} already exists in the container.`);
        }
        this.hashToFunctionInfos.set(hash, functionInfo);
        this.functionInfos.push(functionInfo);
    }
}