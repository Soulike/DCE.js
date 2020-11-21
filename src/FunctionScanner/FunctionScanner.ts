import {ScriptFile} from '../DataClass/ScriptFile';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import fse from 'fs-extra';
import {FunctionScannerForCode} from './FunctionScannerForCode';

export class FunctionScanner
{
    private readonly scriptFile: Readonly<ScriptFile>;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: Readonly<ScriptFile>, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.encoding = encoding;
    }

    public async getFunctionInfos(): Promise<FunctionInfo[]>
    {
        const code = await fse.promises.readFile(this.scriptFile.filePath, this.encoding);
        const functionScannerForCode = new FunctionScannerForCode(code);
        const partialFunctionInfos = await functionScannerForCode.getPartialFunctionInfos();
        return partialFunctionInfos.map(
            ({name, bodyStartIndex, bodyEndIndex}) =>
                new FunctionInfo(this.scriptFile, bodyStartIndex, bodyEndIndex, name),
        );
    }
}