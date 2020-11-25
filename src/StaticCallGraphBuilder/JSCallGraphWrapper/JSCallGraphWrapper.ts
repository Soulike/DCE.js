import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {JSCallGraphConverter} from './JSCallGraphConverter';

const JCG = require('@persper/js-callgraph');

export class JSCallGraphWrapper implements CallGraphBuilder
{
    private readonly scriptFiles: Readonly<Readonly<ScriptFile>[]>;
    private readonly functionInfos: Readonly<Readonly<FunctionInfo>[]>;

    constructor(scriptFiles: Readonly<Readonly<ScriptFile>[]>, functionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.scriptFiles = scriptFiles;
        this.functionInfos = functionInfos;
    }

    public getCallGraph(): FunctionCall[]
    {
        const filePaths = this.scriptFiles.map(({filePath}) => filePath);
        JCG.setArgs({cg: true});
        JCG.setFiles(filePaths);
        JCG.setConsoleOutput(false);
        const callGraphFromJSCallGraph = JCG.build();
        const functionInfoMap = this.getFunctionInfoMap();
        const converter = new JSCallGraphConverter(callGraphFromJSCallGraph, functionInfoMap);
        return converter.getCallGraph();
    }

    private getFunctionInfoMap(): Map<string, FunctionInfo>
    {
        const {functionInfos} = this;
        const functionInfoMap = new Map<string, FunctionInfo>();
        functionInfos.forEach(functionInfo =>
        {
            functionInfoMap.set(functionInfo.getHash(), functionInfo);
        });
        return functionInfoMap;
    }
}