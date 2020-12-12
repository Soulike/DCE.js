export class Range
{
    public readonly startIndex: number;
    public readonly endIndex: number;

    constructor(startIndex: number, endIndex: number)
    {
        if (startIndex < 0 || endIndex < 0)
        {
            throw new Error('index should not be negative.');
        }
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }
}