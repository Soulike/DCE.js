import {ScriptFile} from './ScriptFile';

export class FunctionInfo
{
    public readonly scriptFile: Readonly<ScriptFile> | null;
    public readonly startIndex: number | null;
    public readonly endIndex: number | null;
    public readonly name: Set<string> | 'global';

    constructor(scriptFile: Readonly<ScriptFile> | null, startIndex: number | null, endIndex: number | null, name: Set<string> | 'global')
    {
        this.scriptFile = scriptFile;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.name = name;
    }

    public equals(functionInfo: FunctionInfo): boolean
    {
        const {scriptFile, startIndex, endIndex, name} = functionInfo;
        if (scriptFile === null)
        {
            return this.name === 'global';
        }
        else if (this.scriptFile === null)
        {
            return name === 'global';
        }
        else
        {
            return scriptFile.equals(this.scriptFile)
                && startIndex === this.startIndex
                && endIndex === this.endIndex
                && name === this.name;
        }
    }
}