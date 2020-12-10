import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {JSCallGraphResultToFunctionCallsConverter} from './JSCallGraphResultToFunctionCallsConverter';
import {JSCallGraphResultBuilder} from './JSCallGraphResultBuilder';

export class JSCallGraphWrapper implements CallGraphBuilder
{
    private readonly scriptFiles: Readonly<Readonly<ScriptFile>[]>;
    private readonly hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>;

    constructor(scriptFiles: Readonly<Readonly<ScriptFile>[]>, hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>)
    {
        this.scriptFiles = scriptFiles;
        this.hashToFunctionInfo = hashToFunctionInfo;
    }

    public async getCallGraph(): Promise<FunctionCall[]>
    {
        try
        {
            console.time('StaticCallGraphBuilder');
            const jsCallGraphResultBuilder = new JSCallGraphResultBuilder(this.scriptFiles);
            const jsCallGraphResult = await jsCallGraphResultBuilder.getJSCallGraphResult();

            const converter = new JSCallGraphResultToFunctionCallsConverter(jsCallGraphResult, this.hashToFunctionInfo);
            return converter.getFunctionCalls();
        }
        finally
        {
            console.timeEnd('StaticCallGraphBuilder');
        }
    }
}