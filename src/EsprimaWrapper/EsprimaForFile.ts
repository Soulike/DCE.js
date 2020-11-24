import {EsprimaWrapper} from './Interface/EsprimaWrapper';
import {ScriptFile} from '../DataClass/ScriptFile';
import fse from 'fs-extra';
import {EsprimaForCode} from './EsprimaForCode';
import {ASTNodeFilter} from './Interface/ASTNodeFilter';

export class EsprimaForFile implements EsprimaWrapper
{
    private readonly scriptFile: ScriptFile;
    private readonly filter: ASTNodeFilter;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: ScriptFile, filter: ASTNodeFilter, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.filter = filter;
        this.encoding = encoding;
    }

    public async getNodes()
    {
        const code = await fse.promises.readFile(this.scriptFile.filePath, this.encoding);
        try
        {
            const esprimaForCode = new EsprimaForCode(code, this.filter);
            return await esprimaForCode.getNodes();
        }
        catch (e)
        {
            throw new Error(`Error when esprima parsing ${this.scriptFile.filePath}\n${e}`);
        }
    }
}