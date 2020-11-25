import {CallGraph} from './Type/CallGraph';
import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {CallNode} from './Type/CallNode';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionInfoMapConverter} from '../../FunctionInfoMapConverter';

export class JSCallGraphConverter implements CallGraphBuilder
{
    private readonly jsCallGraphResult: Readonly<CallGraph>;
    private readonly functionInfos: Readonly<Readonly<FunctionInfo>[]>;
    private readonly functionInfoMap: Map<string, FunctionInfo>;

    constructor(jsCallGraphResult: Readonly<CallGraph>, functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.jsCallGraphResult = jsCallGraphResult;
        this.functionInfos = functionInfos;

        const functionInfoMapConverter = new FunctionInfoMapConverter(this.functionInfos);
        this.functionInfoMap = functionInfoMapConverter.getFunctionInfoMap();
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
        const {label, file, range: {start, end}} = callNode;
        let hash = '';
        // TODO: 区分全局和名字叫 global 的函数
        if (label === 'global')  // 'global' is set by js-callgraph
        {
            hash = FunctionInfo.getHash({scriptFile: null, startIndex: null, endIndex: null});
        }
        else
        {
            hash = FunctionInfo.getHash({scriptFile: new ScriptFile(file), startIndex: start, endIndex: end});
        }
        const functionInfo = this.functionInfoMap.get(hash);
        if (functionInfo === undefined)
        {
            throw new Error('Function info does not exist in functionInfoMap');
        }
        return functionInfo;
    }
}