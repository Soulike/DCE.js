import {JSScanner} from './JSScanner';
import {ScriptFile} from '../DataClass/ScriptFile';

export class ScriptFileScanner
{
    private readonly jSScanner: JSScanner;

    constructor(directoryPath: string)
    {
        this.jSScanner = new JSScanner(directoryPath);
    }

    public async getScriptFiles(): Promise<ScriptFile[]>
    {
        const jsFilePaths = await this.jSScanner.getFilePaths();
        return jsFilePaths.map(jsFilePath => new ScriptFile(jsFilePath));
    }
}