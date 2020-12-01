export class CodeRowColumnToIndexConverter
{
    private readonly fileContentLines: string[];

    constructor(fileContent: string)
    {
        this.fileContentLines = fileContent.split('\n');
    }

    public getIndex(rowNumber: number, columnNumber: number): number
    {
        if (rowNumber < 1 || columnNumber < 1
            || !Number.isInteger(rowNumber) || !Number.isInteger(columnNumber))
        {
            throw new Error(`rowNumber and columnNumber should be positive integers`);
        }
        const {fileContentLines} = this;
        if (rowNumber > fileContentLines.length)
        {
            throw new Error(`non-existent row number ${rowNumber}`);
        }
        if (columnNumber > this.getRowLength(rowNumber))
        {
            throw new Error(`non-existent column number ${columnNumber}`);
        }
        let index = 0;
        for (let i = 0; i < rowNumber - 1; i++)
        {
            index += fileContentLines[i].length + 1;  // +1 for '\n' consumed in split()
        }
        index += columnNumber;
        return index;
    }

    private getRowLength(rowNumber: number): number
    {
        if (this.fileContentLines === null)
        {
            throw new Error(`fileContentLines should not be null`);
        }
        const lineAmount = this.fileContentLines.length;
        if (rowNumber === lineAmount)   // no tailing \n
        {
            return this.fileContentLines[rowNumber - 1].length;
        }
        else
        {
            return this.fileContentLines[rowNumber - 1].length + 1; // +1 for '\n' consumed in split()
        }
    }
}