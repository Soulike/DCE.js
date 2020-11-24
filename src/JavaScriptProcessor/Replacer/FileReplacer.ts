import {ScriptFile} from '../../DataClass/ScriptFile';
import {ReplaceInfo} from '../Class/ReplaceInfo';
import fse from 'fs-extra';
import {StringReplacer} from './StringReplacer';

export class FileReplacer
{
    private readonly scriptFile: ScriptFile;
    private readonly replaceInfos: Readonly<Readonly<ReplaceInfo>[]>;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: ScriptFile, replaceInfos: Readonly<Readonly<ReplaceInfo>[]>, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.replaceInfos = replaceInfos;
        this.encoding = encoding;
    }

    public async doProcess(): Promise<void>
    {
        const {filePath} = this.scriptFile;
        const fileContent = await fse.promises.readFile(filePath, this.encoding);
        const stringReplacer = new StringReplacer(fileContent, this.replaceInfos);
        const processedFileContent = stringReplacer.getReplacedString();
        await fse.outputFile(filePath, processedFileContent, this.encoding);
    }
}