export class ScriptFile
{
    public readonly filePath: string;

    constructor(filePath: string)
    {
        this.filePath = filePath;
    }

    public equals(scriptFile: ScriptFile): boolean
    {
        return scriptFile.filePath === this.filePath;
    }
}