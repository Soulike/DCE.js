import {FunctionInfo} from '../DataClass/FunctionInfo';
import {Range, ReplaceInfo} from '../Replacer';

export class FilePathToFileReplacersGenerator
{
    private readonly functionInfos: ReadonlyArray<FunctionInfo>;

    constructor(functionInfos: ReadonlyArray<FunctionInfo>)
    {
        this.functionInfos = functionInfos;
    }

    private static getReplaceInfoFromIndexes(startIndex: number, endIndex: number): ReplaceInfo | null
    {
        const bodyLength = endIndex - startIndex;
        if (bodyLength <= 1)
        {
            return null;
        }
        else
        {
            return new ReplaceInfo(new Range(startIndex, endIndex), `1`);
        }
    }

    public getFilePathToReplaceInfos(): Map<string, ReplaceInfo[]>
    {
        const filePathToReplaceInfos: Map<string, ReplaceInfo[]> = new Map();
        this.functionInfos.forEach(({scriptFile, bodyStartIndex, bodyEndIndex}) =>
        {
            if (scriptFile === null || bodyStartIndex === null || bodyEndIndex === null)
            {
                throw new Error('try to modify "global"');
            }
            const replaceInfo = FilePathToFileReplacersGenerator.getReplaceInfoFromIndexes(bodyStartIndex, bodyEndIndex);
            if (replaceInfo !== null)
            {
                const {filePath} = scriptFile;
                const replaceInfos = filePathToReplaceInfos.get(filePath);
                if (replaceInfos === undefined)
                {
                    filePathToReplaceInfos.set(filePath, [replaceInfo]);
                }
                else
                {
                    // TODO: prevent overlap
                    replaceInfos.push(replaceInfo);
                }
            }
        });
        return filePathToReplaceInfos;
    }
}