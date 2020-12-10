import {PartialFunctionInfo, SimpleFunctionCall} from '../Interface';
import {SingleHashFunctionCall} from './SingleHashFunctionCall';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {CodeRowColumnToIndexConverter} from '../../RowColumnToIndexConverter';
import fse from 'fs-extra';
import {FunctionInfo} from '../../DataClass/FunctionInfo';

export class SimpleFunctionCallsToSingleHashFunctionCallsConverter
{
    /**
     * @description processing multiple simpleFunctionCalls at one time enables us to cache files. see getFileContent()
     * */
    private readonly simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>;
    private readonly filePathToCode: Map<string, string>; // filePath to code
    private readonly sourceCodeEncoding: BufferEncoding;

    constructor(simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>, sourceCodeEncoding: BufferEncoding = 'utf-8')
    {
        this.simpleFunctionCalls = simpleFunctionCalls;
        this.filePathToCode = new Map();
        this.sourceCodeEncoding = sourceCodeEncoding;
    }

    public async getSingleHashFunctionCalls(): Promise<SingleHashFunctionCall[]>
    {
        const {simpleFunctionCalls} = this;
        const singleHashFunctionCalls: SingleHashFunctionCall[] = [];
        // do not use Promise.all here or getFileContent() will fail to cache file content
        for (const {caller, callee} of simpleFunctionCalls)
        {
            const callerHash = await this.convertPartialFunctionInfoToHash(caller);
            const calleeHash = await this.convertPartialFunctionInfoToHash(callee);
            singleHashFunctionCalls.push(new SingleHashFunctionCall(callerHash, calleeHash));
        }
        return singleHashFunctionCalls;
    }

    private async convertPartialFunctionInfoToHash(partialFunctionInfo: Readonly<PartialFunctionInfo>): Promise<string>
    {
        const {scriptFilePath, startRowNumber, startColumnNumber, endRowNumber, endColumnNumber} = partialFunctionInfo;
        if (scriptFilePath !== null && startRowNumber !== null && startColumnNumber !== null && endRowNumber !== null && endColumnNumber !== null)
        {
            const fileContent = await this.getFileContent(scriptFilePath);
            const rowColumnToIndexConverter = new CodeRowColumnToIndexConverter(fileContent);
            const startIndex = rowColumnToIndexConverter.getIndex(startRowNumber, startColumnNumber);
            const endIndex = rowColumnToIndexConverter.getIndex(endRowNumber, endColumnNumber);
            return FunctionInfo.getHash({
                scriptFile: new ScriptFile(scriptFilePath),
                startIndex, endIndex,
            });
        }
        else    // global
        {
            return FunctionInfo.getHash(FunctionInfo.GLOBAL);
        }
    }

    private async getFileContent(filePath: string): Promise<string>
    {
        let fileContent = this.filePathToCode.get(filePath);
        if (fileContent === undefined)
        {
            fileContent = await fse.promises.readFile(filePath, this.sourceCodeEncoding);
            this.filePathToCode.set(filePath, fileContent);
        }
        return fileContent;
    }
}