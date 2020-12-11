import {ReplaceInfo} from './Class/ReplaceInfo';

export class StringReplacer
{
    private readonly processedString: string;
    private readonly replaceInfos: Readonly<Readonly<ReplaceInfo>[]>;

    /**
     * @param processedString - the string to be processed
     * @param replaceInfos - ReplaceInfo[], ranges should have not overlap
     * */
    constructor(processedString: string, replaceInfos: Readonly<Readonly<ReplaceInfo>[]>)
    {
        this.processedString = processedString;
        this.replaceInfos = replaceInfos;
    }

    public getReplacedString(): string
    {
        if (this.replaceInfos.length === 0)
        {
            return this.processedString;
        }
        const stringBuffer: string[] = [];
        const {processedString, replaceInfos} = this;
        const sortedReplaceInfos = Array.from(replaceInfos)
            .sort((a, b) => a.range.startIndex - b.range.startIndex);
        let lastEndIndex = 0;
        sortedReplaceInfos.forEach(({range: {startIndex, endIndex}, code}) =>
        {
            stringBuffer.push(processedString.slice(lastEndIndex, startIndex), code);
            lastEndIndex = endIndex;
        });
        stringBuffer.push(processedString.slice(lastEndIndex));
        return stringBuffer.join('');
    }
}