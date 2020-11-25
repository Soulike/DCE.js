import {CallGraphBuilder} from '../../Interface/CallGraphBuilder';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {JSCallGraphConverter} from './JSCallGraphConverter';
import {CallGraph} from './Type/CallGraph';

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
        const callGraphFromJSCallGraph = this.getJSCallGraphResult();

        const converter = new JSCallGraphConverter(callGraphFromJSCallGraph, this.functionInfos);
        return converter.getCallGraph();
    }

    private getJSCallGraphResult(): CallGraph
    {
        const filePaths = this.scriptFiles.map(({filePath}) => filePath);
        JCG.setArgs({
            cg: true,
            output: null,
            strategy: 'ONESHOT',
        });
        JCG.setFiles(filePaths);
        JCG.setConsoleOutput(false);
        return JCG.build();
    }
}