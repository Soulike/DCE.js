import {ScriptFile} from './ScriptFile';

export class FunctionInfo
{
    public readonly scriptFile: Readonly<ScriptFile> | null;
    public readonly startIndex: number | null;
    public readonly endIndex: number | null;
    public readonly bodyStartIndex: number | null;
    public readonly bodyEndIndex: number | null;

    constructor(scriptFile: Readonly<ScriptFile> | null, startIndex: number | null, endIndex: number | null, bodyStartIndex: number | null, bodyEndIndex: number | null)
    {
        this.scriptFile = scriptFile;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.bodyStartIndex = bodyStartIndex;
        this.bodyEndIndex = bodyEndIndex;
    }

    public equals(functionInfo: FunctionInfo): boolean
    {
        const {scriptFile, startIndex, endIndex} = functionInfo;
        if (scriptFile === null && startIndex === null && endIndex === null
            && this.scriptFile === null && this.startIndex === null && this.endIndex === null)
        {
            return true;
        }
        if (scriptFile === null || startIndex === null || endIndex === null
            || this.scriptFile === null || this.startIndex === null || this.endIndex === null)
        {
            return false;
        }
        return scriptFile.equals(this.scriptFile)
            && startIndex === this.startIndex
            && endIndex === this.endIndex;
    }
}