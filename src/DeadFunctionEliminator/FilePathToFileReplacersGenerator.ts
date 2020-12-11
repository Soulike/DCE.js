import {FunctionInfo} from '../DataClass/FunctionInfo';
import {Range, ReplaceInfo} from '../Replacer';

export class FilePathToFileReplacersGenerator
{
    private readonly functionInfos: ReadonlyArray<FunctionInfo>;

    constructor(functionInfos: ReadonlyArray<FunctionInfo>)
    {
        this.functionInfos = functionInfos;
    }

    private static getReplaceInfoFromIndexes(startIndex: number, endIndex: number): ReplaceInfo
    {
        const bodyLength = endIndex - startIndex;
        return new ReplaceInfo(new Range(startIndex, endIndex), `1${' '.repeat(bodyLength - 1)}`);
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
            const {filePath} = scriptFile;
            const replaceInfos = filePathToReplaceInfos.get(filePath);
            if (replaceInfos === undefined)
            {
                filePathToReplaceInfos.set(filePath, [replaceInfo]);
            }
            else
            {
                replaceInfos.push(replaceInfo);
            }
        });
        return filePathToReplaceInfos;
    }
}