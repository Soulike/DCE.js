import {ScriptFile} from '../../DataClass/ScriptFile';

const bindings = require('@persper/js-callgraph/src/bindings');
const astutil = require('@persper/js-callgraph/src/astutil');
const semioptimistic = require('@persper/js-callgraph/src/semioptimistic');

export class JSCallGraphResultBuilder
{
    private readonly scriptFiles: Readonly<Readonly<ScriptFile>[]>;

    constructor(scriptFiles: Readonly<Readonly<ScriptFile>[]>)
    {
        this.scriptFiles = scriptFiles;
    }

    public getJSCallGraphResult()
    {
        const filePaths = this.scriptFiles.map(({filePath}) => filePath);
        const ast = astutil.astFromFiles(filePaths);
        bindings.addBindings(ast);
        return semioptimistic.buildCallGraph(ast);
    }
}