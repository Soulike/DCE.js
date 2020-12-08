import {PartialFunctionInfo, SimpleFunctionCall} from '../Interface';
import {HashFunctionCall} from './HashFunctionCall';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {CodeRowColumnToIndexConverter} from '../../RowColumnToIndexConverter';
import fse from 'fs-extra';
import {FunctionInfo} from '../../DataClass/FunctionInfo';

export class SimpleToHashFunctionCallConverter
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

    public async getHashFunctionCalls(): Promise<HashFunctionCall[]>
    {
        const {simpleFunctionCalls} = this;
        return await Promise.all(simpleFunctionCalls.map(
            async ({caller, callee}) =>
            {
                const [callerHash, calleeHash] = await Promise.all([
                    this.convertPartialFunctionInfoToHash(caller),
                    this.convertPartialFunctionInfoToHash(callee),
                ]);
                return new HashFunctionCall(callerHash, calleeHash);
            }));
    }

    private async convertPartialFunctionInfoToHash(partialFunctionInfo: Readonly<PartialFunctionInfo>): Promise<string>
    {
        const {scriptFilePath, startRowNumber, startColumnNumber, endRowNumber, endColumnNumber} = partialFunctionInfo;
        if (scriptFilePath !== null && startRowNumber !== null && startColumnNumber !== null && endRowNumber !== null && endColumnNumber !== null)
        {
            const fileContent = await this.getFileContent(scriptFilePath);
            const rowColumnToIndexConverter = new CodeRowColumnToIndexConverter(fileContent);
            const [startIndex, endIndex] = await Promise.all([
                rowColumnToIndexConverter.getIndex(startRowNumber, startColumnNumber),
                rowColumnToIndexConverter.getIndex(endRowNumber, endColumnNumber),
            ]);
            return FunctionInfo.getHash({
                scriptFile: new ScriptFile(scriptFilePath),
                startIndex, endIndex,
            });
        }
        else    // global
        {
            return FunctionInfo.getHash({
                scriptFile: null, startIndex: null, endIndex: null,
            });
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