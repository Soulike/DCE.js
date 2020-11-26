import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionInfoMapConverter} from '../../FunctionInfoMapConverter';

export class JSCallGraphResultToFunctionCallsConverter
{
    private readonly callGraph: any;
    private readonly functionInfoMap: Map<string, FunctionInfo>;

    constructor(callGraph: any, functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.callGraph = callGraph;

        const functionInfoMapConverter = new FunctionInfoMapConverter(functionInfos);
        this.functionInfoMap = functionInfoMapConverter.getFunctionInfoMap();
    }

    public getFunctionCalls(): FunctionCall[]
    {
        const callerFunctionInfoHashToFunctionCall = new Map<string, FunctionCall>();
        this.callGraph.edges.iter((caller: any, callee: any) =>
        {
            if (callee.type === 'NativeVertex')  // ignore native function calls
            {
                return;
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
            return this.getFunctionInfoFromFunctionInfoMap({
                scriptFile: null, startIndex: null, endIndex: null,
            });
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