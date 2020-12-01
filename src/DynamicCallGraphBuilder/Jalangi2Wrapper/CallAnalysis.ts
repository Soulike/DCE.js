import {SimpleFunctionCall} from './SimpleFunctionCall';
import {CodeRowColumnToIndexConverter} from '../../RowColumnToIndexConverter';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionInfo} from '../../DataClass/FunctionInfo';

declare var J$: any;

class CallAnalysis
{
    private readonly hashToSimpleFunctionCalls: Map<string, SimpleFunctionCall>;
    private readonly sourceRowColumnToIndexConverter: CodeRowColumnToIndexConverter;

    constructor()
    {
        const iids = J$.smap[J$.sid];
        const {code} = iids;

        this.hashToSimpleFunctionCalls = new Map();
        this.sourceRowColumnToIndexConverter = new CodeRowColumnToIndexConverter(code);
    }

    public invokeFun(iid: number, _f: Function, _base: any, _args: any[], _result: any, _isConstructor: boolean, _isMethod: boolean, functionIid: number, functionSid: number): any | undefined
    {
        const sourcePartialFunctionInfo = this.getSourcePartialFunctionInfo(iid);
        const targetPartialFunctionInfo = this.getTargetSimpleFunctionCall(functionIid, functionSid);
        const simpleFunctionCall = new SimpleFunctionCall(sourcePartialFunctionInfo, targetPartialFunctionInfo);
        const simpleFunctionCallHash = simpleFunctionCall.getHash();
        if (FunctionInfo.getHash(sourcePartialFunctionInfo) !== FunctionInfo.getHash(targetPartialFunctionInfo) // ignore self calls
            && !this.hashToSimpleFunctionCalls.has(simpleFunctionCallHash))   // check whether has logged
        {
            this.hashToSimpleFunctionCalls.set(simpleFunctionCallHash, simpleFunctionCall);
        }
    }

    public endExecution()
    {
        console.log(JSON.stringify(this.hashToSimpleFunctionCalls.values()));
    }

    private getSourcePartialFunctionInfo(iid: number): Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>
    {
        const iids = J$.smap[J$.sid];
        const {originalCodeFileName} = iids;
        const [beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber] = iids[iid];
        const startIndex = this.sourceRowColumnToIndexConverter.getIndex(beginLineNumber, beginColumnNumber);
        const endIndex = this.sourceRowColumnToIndexConverter.getIndex(endLineNumber, endColumnNumber);
        return {scriptFile: new ScriptFile(originalCodeFileName), startIndex, endIndex};
    }

    private getTargetSimpleFunctionCall(functionIid: number, functionSid: number): Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>
    {
        if (functionSid === J$.sid) // in the same file
        {
            return this.getSourcePartialFunctionInfo(functionIid);
        }
        else
        {
            const iids = J$.smap[functionSid];
            const {originalCodeFileName, code} = iids;
            const [beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber] = iids[functionIid];
            const targetRowColumnToIndexConverter = new CodeRowColumnToIndexConverter(code);
            const startIndex = targetRowColumnToIndexConverter.getIndex(beginLineNumber, beginColumnNumber);
            const endIndex = targetRowColumnToIndexConverter.getIndex(endLineNumber, endColumnNumber);
            return {scriptFile: new ScriptFile(originalCodeFileName), startIndex, endIndex};
        }
    }
}

(function (sandbox)
{
    sandbox.analysis = new CallAnalysis();
    if (sandbox.Constants.isBrowser)
    {
        setTimeout(() =>
        {
            sandbox.analysis.endExecution();
        }, 5000);   // wait for 5s
    }
}(J$));