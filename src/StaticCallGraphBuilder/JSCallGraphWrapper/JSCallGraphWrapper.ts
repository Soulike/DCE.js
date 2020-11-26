import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {JSCallGraphResultToFunctionCallsConverter} from './JSCallGraphResultToFunctionCallsConverter';
import {JSCallGraphResultBuilder} from './JSCallGraphResultBuilder';

export class JSCallGraphWrapper implements CallGraphBuilder
{
    private readonly scriptFiles: Readonly<Readonly<ScriptFile>[]>;
    private readonly functionInfos: Readonly<Readonly<FunctionInfo>[]>;

    constructor(scriptFiles: Readonly<Readonly<ScriptFile>[]>, functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.scriptFiles = scriptFiles;
        this.functionInfos = functionInfos;
    }

    public async getCallGraph(): Promise<FunctionCall[]>
    {
        const jsCallGraphResultBuilder = new JSCallGraphResultBuilder(this.scriptFiles);
        const jsCallGraphResult = jsCallGraphResultBuilder.getJSCallGraphResult();

        const converter = new JSCallGraphResultToFunctionCallsConverter(jsCallGraphResult, this.functionInfos);
        return converter.getFunctionCalls();
    }
}