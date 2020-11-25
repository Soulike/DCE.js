import {CallGraph} from './Type/CallGraph';
import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {CallNode} from './Type/CallNode';
import {ScriptFile} from '../../DataClass/ScriptFile';

export class JSCallGraphConverter implements CallGraphBuilder
{
    private readonly jsCallGraphResult: Readonly<CallGraph>;
    private readonly functionInfoMap: Readonly<Map<string, FunctionInfo>>;

    /**
     * @param jsCallGraphResult - call graph from js-callgraph
     * @param functionInfoMap - a hash to FunctionInfo Map
     * */
    constructor(jsCallGraphResult: Readonly<CallGraph>, functionInfoMap: Readonly<Map<string, FunctionInfo>>)
    {
        this.jsCallGraphResult = jsCallGraphResult;
        this.functionInfoMap = functionInfoMap;
    }

    public getCallGraph(): FunctionCall[]
    {
        const {jsCallGraphResult} = this;
        const functionInfoToFunctionCall = new Map<FunctionInfo, FunctionCall>();
        jsCallGraphResult.forEach(call =>
        {
            const {source, target} = call;
            const sourceFunctionInfo = this.getFunctionInfoFromCallNode(source);
            const targetFunctionInfo = this.getFunctionInfoFromCallNode(target);
            const functionCall = functionInfoToFunctionCall.get(sourceFunctionInfo);
            if (functionCall === undefined)
            {
                functionInfoToFunctionCall.set(sourceFunctionInfo, new FunctionCall(sourceFunctionInfo, [targetFunctionInfo]));
            }
            else
            {
                functionCall.callee.push(targetFunctionInfo);
            }
        });
        return Array.from(functionInfoToFunctionCall.values());
    }

    private getFunctionInfoFromCallNode(callNode: Readonly<CallNode>): FunctionInfo
    {
        const {file, range: {start, end}} = callNode;
        const hash = FunctionInfo.getHash({scriptFile: new ScriptFile(file), startIndex: start, endIndex: end});
        const functionInfo = this.functionInfoMap.get(hash);
        if (functionInfo === undefined)
        {
            throw new Error('Function info does not exist in functionInfoMap');
        }
        return functionInfo;
    }
}