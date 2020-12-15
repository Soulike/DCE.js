import {ReplaceInfo} from './Class/ReplaceInfo';

export class StringReplacer
{
    private readonly processedString: string;
    private readonly replaceInfos: Readonly<Readonly<ReplaceInfo>[]>;

    /**
     * @param processedString - the string to be processed
     * @param replaceInfos - ReplaceInfo[]. There should be only including relationship between ranges. Overlaps like [1,3],[2,4] is not allowed.
     * */
    constructor(processedString: string, replaceInfos: Readonly<Readonly<ReplaceInfo>[]>)
    {
        this.processedString = processedString;
        this.replaceInfos = replaceInfos;
    }

    private static inRange(value: number, start: number, end: number): boolean
    {
        return value > start && value < end;
    }

    public getReplacedString(): string
    {
        if (this.replaceInfos.length === 0)
        {
            return this.processedString;
        }
        const stringBuffer: string[] = [];
        const {processedString} = this;
        const processReplaceInfos = this.processReplaceInfos();
        let lastEndIndex = 0;
        processReplaceInfos.forEach(({range: {startIndex, endIndex}, code}) =>
        {
            stringBuffer.push(processedString.slice(lastEndIndex, startIndex), code);
            lastEndIndex = endIndex;
        });
        stringBuffer.push(processedString.slice(lastEndIndex));
        return stringBuffer.join('');
    }

    /**
     * @description merge ReplaceInfos whose ranges are inclusive and do sort. e.g. [9,10],[1,6],[2,3],[4,5] => [1,6],[9,10]
     * */
    private processReplaceInfos(): ReplaceInfo[]
    {
        let replaceInfos: Readonly<ReplaceInfo>[] = [];
        let processedReplaceInfos = [...this.replaceInfos];

        while (replaceInfos.length !== processedReplaceInfos.length)
        {
            replaceInfos = processedReplaceInfos;
            processedReplaceInfos = [];
            replaceInfos.forEach(replaceInfo =>
            {
                let foundPlace = false;
                const {range: {startIndex: currentStartIndex, endIndex: currentEndIndex}} = replaceInfo;
                for (let i = 0; i < processedReplaceInfos.length; i++)
                {
                    const {range: {startIndex, endIndex}} = processedReplaceInfos[i];
                    if (startIndex <= currentStartIndex && endIndex >= currentEndIndex)  // included
                    {
                        foundPlace = true;
                        break;
                    }
                    else if (startIndex >= currentStartIndex && endIndex <= currentEndIndex) // including
                    {
                        processedReplaceInfos[i] = replaceInfo;
                        foundPlace = true;
                        break;
                    }
                    else if (StringReplacer.inRange(currentStartIndex, startIndex, endIndex) && currentEndIndex > endIndex
                        || StringReplacer.inRange(currentEndIndex, startIndex, endIndex) && currentStartIndex < startIndex)
                    {
                        throw new Error('ranges should not overlap');
                    }
                }
                if (!foundPlace)
                {
                    processedReplaceInfos.push(replaceInfo);
                }
            });
        }
        return processedReplaceInfos.sort((a, b) => a.range.startIndex - b.range.startIndex);
    }
}