import {ScriptFile} from '../DataClass/ScriptFile';
import fse from 'fs-extra';

/**
 * @description the scriptFile passed to a RowColumnToIndexConverter should not be modified.
 * If the file is modified, you must create a new RowColumnToIndexConverter.
 * */
export class RowColumnToIndexConverter
{
    private readonly scriptFile: Readonly<ScriptFile>;
    private fileContentLines: string[] | null;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: Readonly<ScriptFile>, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.encoding = encoding;
        this.fileContentLines = null;
    }

    public async getIndex(rowNumber: number, columnNumber: number): Promise<number>
    {
        if (rowNumber < 1 || columnNumber < 1
            || !Number.isInteger(rowNumber) || !Number.isInteger(columnNumber))
        {
            throw new Error(`rowNumber and columnNumber should be positive integers`);
        }
        if (this.fileContentLines === null)
        {
            await this.readFileContentLines();
        }
        // fileContent should not be null ofter readFileContentLines()
        const fileContentLines = this.fileContentLines as string[];
        if (rowNumber > fileContentLines.length)
        {
            throw new Error(`non-existent row number ${rowNumber} for file ${this.scriptFile.filePath}`);
        }
        if (columnNumber > fileContentLines[rowNumber - 1].length + 1)   // +1 for '\n' consumed in split()
        {
            throw new Error(`non-existent column number ${columnNumber} for file ${this.scriptFile.filePath}`);
        }
        let index = 0;
        for (let i = 0; i < rowNumber - 1; i++)
        {
            index += fileContentLines[i].length + 1;  // +1 for '\n' consumed in split()
        }
        index += columnNumber;
        return index;
    }

    private async readFileContentLines()
    {
        const {filePath} = this.scriptFile;
        const fileContent = await fse.promises.readFile(filePath, this.encoding);
        if (fileContent.length === 0)
        {
            throw new Error(`file ${filePath} is empty`);
        }
        this.fileContentLines = fileContent.split('\n');
    }
}