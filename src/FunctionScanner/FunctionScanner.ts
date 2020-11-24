import {ScriptFile} from '../DataClass/ScriptFile';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import fse from 'fs-extra';
import {FunctionScannerForCode} from './FunctionScannerForCode';
import {ASTNodeFilter as IASTNodeFilter} from './EsprimaWrapper';
import {ASTNodeFilter} from './ASTNodeFilter';

export class FunctionScanner
{
    private readonly scriptFile: Readonly<ScriptFile>;
    private readonly encoding: BufferEncoding;
    private readonly astNodeFilter: IASTNodeFilter;

    constructor(scriptFile: Readonly<ScriptFile>, astNodeFilter: IASTNodeFilter = new ASTNodeFilter(), encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.astNodeFilter = astNodeFilter;
        this.encoding = encoding;
    }

    public async getFunctionInfos(): Promise<FunctionInfo[]>
    {
        const code = await fse.promises.readFile(this.scriptFile.filePath, this.encoding);
        const functionScannerForCode = new FunctionScannerForCode(code, this.astNodeFilter);
        const partialFunctionInfos = await functionScannerForCode.getPartialFunctionInfos();
        return partialFunctionInfos.map(
            ({name, startIndex, endIndex, bodyStartIndex, bodyEndIndex}) =>
                new FunctionInfo(this.scriptFile, startIndex, endIndex, bodyStartIndex, bodyEndIndex, name),
        );
    }
}