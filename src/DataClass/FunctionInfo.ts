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
        if (scriptFile === null || startIndex === null || endIndex === null || bodyStartIndex === null || bodyEndIndex === null)
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
    }

    public equals(functionInfo: FunctionInfo): boolean
    {
        const {scriptFile, startIndex, endIndex} = functionInfo;
        if (scriptFile === null || this.scriptFile === null)
        {
            return this.isGlobal() && functionInfo.isGlobal();
        }
        return scriptFile.equals(this.scriptFile)
            && startIndex === this.startIndex
            && endIndex === this.endIndex;
    }

    public isGlobal(): boolean
    {
        const {scriptFile, endIndex, startIndex, bodyEndIndex, bodyStartIndex} = this;
        return scriptFile === null
            || endIndex === null
            || startIndex === null
            || bodyStartIndex === null
            || bodyEndIndex === null;
    }
}