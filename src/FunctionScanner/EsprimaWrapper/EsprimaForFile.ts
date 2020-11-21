import {EsprimaWrapper} from './Interface/EsprimaWrapper';
import {ScriptFile} from '../../DataClass/ScriptFile';
import fse from 'fs-extra';
import {EsprimaForCode} from './EsprimaForCode';

export class EsprimaForFile implements EsprimaWrapper
{
    private readonly scriptFile: ScriptFile;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: ScriptFile, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.encoding = encoding;
    }

    public async getNodes()
    {
        const code = await fse.promises.readFile(this.scriptFile.filePath, this.encoding);
        const esprimaForCode = new EsprimaForCode(code);
        return await esprimaForCode.getNodes();
    }
}