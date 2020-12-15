import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {ScriptFile} from '../../DataClass/ScriptFile';

export class JSCallGraphResultToFunctionCallsConverter
{
    private readonly callGraph: any;
    private readonly functionInfoMap: ReadonlyMap<string, Readonly<FunctionInfo>>;

    constructor(callGraph: any, hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>)
    {
        this.callGraph = callGraph;
        this.functionInfoMap = hashToFunctionInfo;
    }

    public getFunctionCalls(): FunctionCall[]
    {
        const callerFunctionInfoHashToFunctionCall = new Map<string, FunctionCall>();
        this.callGraph.edges.iter((caller: any, callee: any) =>
        {
            // 'callee' node has type NativeVertex and is a function that accepts a function as one of its arguments.
            if (callee.type === 'NativeVertex')
            {
                const args = caller.call.arguments;
                args.forEach((arg: any) =>
                {
                    if (arg.type === 'FunctionExpression' || arg.types === 'ArrowFunctionExpression')
                    {
                        const callerFunctionInfo = this.getCallerFunctionInfo(caller);
                        const calleeFunctionInfo = this.getCalleeFunctionInfo(arg);
                        const functionCall = callerFunctionInfoHashToFunctionCall.get(callerFunctionInfo.getHash());
                        if (functionCall === undefined)
                        {
                            callerFunctionInfoHashToFunctionCall.set(
                                callerFunctionInfo.getHash(),
                                new FunctionCall(callerFunctionInfo, [calleeFunctionInfo]));
                        }
                        else
                        {
                            functionCall.callee.push(calleeFunctionInfo);
                        }
                    }
                });
            }
            const callerFunctionInfo = this.getCallerFunctionInfo(caller);
            const calleeFunctionInfo = this.getCalleeFunctionInfo(callee);
            const functionCall = callerFunctionInfoHashToFunctionCall.get(callerFunctionInfo.getHash());
            if (functionCall === undefined)
            {
                callerFunctionInfoHashToFunctionCall.set(
                    callerFunctionInfo.getHash(),
                    new FunctionCall(callerFunctionInfo, [calleeFunctionInfo]));
            }
            else
            {
                functionCall.callee.push(calleeFunctionInfo);
            }
        });
        return Array.from(callerFunctionInfoHashToFunctionCall.values());
    }

    private getCallerFunctionInfo(caller: any): FunctionInfo
    {
        const filePath = caller.call.attr.enclosingFile;
        let enclosingFunction = caller.call.callee.attr.enclosingFunction;
        if (enclosingFunction)
        {
            const startIndex = enclosingFunction.range[0];
            const endIndex = enclosingFunction.range[1];
            return this.getFunctionInfoFromFunctionInfoMap({
                scriptFile: new ScriptFile(filePath),
                startIndex,
                endIndex,
            });
        }
        else    // global
        {
            return this.getFunctionInfoFromFunctionInfoMap(FunctionInfo.GLOBAL);
        }
    }

    private getCalleeFunctionInfo(callee: any): FunctionInfo
    {
        const filePath = callee.func.attr.enclosingFile;
        const startIndex = callee.func.range[0];
        const endIndex = callee.func.range[1];
        const partialFunctionInfo = {
            scriptFile: new ScriptFile(filePath),
            startIndex,
            endIndex,
        };
        const functionInfo = this.functionInfoMap.get(FunctionInfo.getHash(partialFunctionInfo));
        if (functionInfo === undefined)
        {
            throw new Error(`functionInfo ${JSON.stringify(partialFunctionInfo)} does not exist in FunctionInfo[]`);
        }
        return functionInfo;
    }

    private getFunctionInfoFromFunctionInfoMap(partialFunctionInfo: Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>): FunctionInfo
    {
        const functionInfo = this.functionInfoMap.get(FunctionInfo.getHash(partialFunctionInfo));
        if (functionInfo === undefined)
        {
            throw new Error(`functionInfo ${JSON.stringify(partialFunctionInfo)} does not exist in FunctionInfo[]`);
        }
        return functionInfo;
    }
}