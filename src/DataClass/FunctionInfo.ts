import {ScriptFile} from './ScriptFile';

export class FunctionInfo
{
    public static readonly GLOBAL = 'global';

    public readonly scriptFile: Readonly<ScriptFile> | null;
    public readonly startIndex: number | null;
    public readonly endIndex: number | null;
    public readonly bodyStartIndex: number | null;
    public readonly bodyEndIndex: number | null;
    public readonly name: Set<string> | typeof FunctionInfo.GLOBAL;

    constructor(scriptFile: Readonly<ScriptFile> | null, startIndex: number | null, endIndex: number | null, bodyStartIndex: number | null, bodyEndIndex: number | null, name: Set<string> | typeof FunctionInfo.GLOBAL)
    {
        if (name === FunctionInfo.GLOBAL)
        {
            this.scriptFile = null;
            this.startIndex = null;
            this.endIndex = null;
            this.bodyStartIndex = null;
            this.bodyEndIndex = null;
        }
        else
        {
            this.scriptFile = scriptFile;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.bodyStartIndex = bodyStartIndex;
            this.bodyEndIndex = bodyEndIndex;
        }
        this.name = name;
    }

    public equals(functionInfo: FunctionInfo): boolean
    {
        const {scriptFile, startIndex, endIndex, name} = functionInfo;
        if (scriptFile === null)
        {
            return this.name === FunctionInfo.GLOBAL;
        }
        else if (this.scriptFile === null)
        {
            return name === FunctionInfo.GLOBAL;
        }
        else
        {
            return scriptFile.equals(this.scriptFile)
                && startIndex === this.startIndex
                && endIndex === this.endIndex;
        }
    }
}