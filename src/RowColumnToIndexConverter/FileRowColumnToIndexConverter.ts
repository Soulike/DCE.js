import {ScriptFile} from '../DataClass/ScriptFile';
import fse from 'fs-extra';
import {CodeRowColumnToIndexConverter} from './CodeRowColumnToIndexConverter';

/**
 * @description the scriptFile passed to a FileRowColumnToIndexConverter should not be modified.
 * If the file is modified, you must create a new FileRowColumnToIndexConverter.
 * */
export class FileRowColumnToIndexConverter
{
    private readonly scriptFile: Readonly<ScriptFile>;
    private fileContent: string | null;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: Readonly<ScriptFile>, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.encoding = encoding;
        this.fileContent = null;
    }

    public async getIndex(rowNumber: number, columnNumber: number): Promise<number>
    {
        if (this.fileContent === null)
        {
            this.fileContent = await this.readFileContentLines();
        }
        const codeRowColumnToIndexConverter = new CodeRowColumnToIndexConverter(this.fileContent);
        return codeRowColumnToIndexConverter.getIndex(rowNumber, columnNumber);
    }

    private async readFileContentLines()
    {
        const {filePath} = this.scriptFile;
        return await fse.promises.readFile(filePath, this.encoding);
    }
}