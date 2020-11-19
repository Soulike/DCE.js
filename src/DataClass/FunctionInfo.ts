import {ScriptFile} from './ScriptFile';

export class FunctionInfo
{
    public static readonly GLOBAL = 'global';

    public readonly scriptFile: Readonly<ScriptFile> | null;
    public readonly bodyStartIndex: number | null;
    public readonly bodyEndIndex: number | null;
    public readonly name: Set<string> | typeof FunctionInfo.GLOBAL;

    constructor(scriptFile: Readonly<ScriptFile> | null, bodyStartIndex: number | null, bodyEndIndex: number | null, name: Set<string> | typeof FunctionInfo.GLOBAL)
    {
        if (name === FunctionInfo.GLOBAL)
        {
            this.scriptFile = null;
            this.bodyStartIndex = null;
            this.bodyEndIndex = null;
        }
        else
        {
            this.scriptFile = scriptFile;
            this.bodyStartIndex = bodyStartIndex;
            this.bodyEndIndex = bodyEndIndex;
        }
        this.name = name;
    }

    public equals(functionInfo: FunctionInfo): boolean
    {
        const {scriptFile, bodyStartIndex, bodyEndIndex, name} = functionInfo;
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
                && bodyStartIndex === this.bodyStartIndex
                && bodyEndIndex === this.bodyEndIndex;
        }
    }
}