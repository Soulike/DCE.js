import {FunctionInfo} from '../DataClass/FunctionInfo';
import {FileReplacer} from '../Replacer';
import {ScriptFile} from '../DataClass/ScriptFile';
import {FilePathToFileReplacersGenerator} from './FilePathToFileReplacersGenerator';

export class DeadFunctionEliminator
{
    private readonly deadFunctionInfos: ReadonlyArray<FunctionInfo>;
    private readonly sourceFileEncoding: BufferEncoding;

    constructor(deadFunctionInfos: ReadonlyArray<FunctionInfo>, sourceFileEncoding: BufferEncoding = 'utf-8')
    {
        this.deadFunctionInfos = deadFunctionInfos;
        this.sourceFileEncoding = sourceFileEncoding;
    }

    public async doProcess(): Promise<void>
    {
        const filePathToFileReplacersGenerator = new FilePathToFileReplacersGenerator(this.deadFunctionInfos);
        const scriptFilePathToReplaceInfos = filePathToFileReplacersGenerator.getFilePathToReplaceInfos();

        const fileReplacers: FileReplacer[] = [];
        scriptFilePathToReplaceInfos.forEach((replaceInfos, filePath) =>
        {
            fileReplacers.push(new FileReplacer(new ScriptFile(filePath), replaceInfos, this.sourceFileEncoding));
        });
        await Promise.all(fileReplacers.map(async fileReplacer => await fileReplacer.doProcess()));
    }
}