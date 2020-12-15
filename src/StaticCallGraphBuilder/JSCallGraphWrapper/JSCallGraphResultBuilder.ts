import {ScriptFile} from '../../DataClass/ScriptFile';
import util from 'util';

const bindings = require('@persper/js-callgraph/src/bindings');
const astutil = require('@persper/js-callgraph/src/astutil');
const semioptimistic = require('@persper/js-callgraph/src/semioptimistic');

export class JSCallGraphResultBuilder
{
    private readonly scriptFiles: Readonly<Readonly<ScriptFile>[]>;
    private readonly setImmediatePromise = util.promisify(setImmediate);

    constructor(scriptFiles: Readonly<Readonly<ScriptFile>[]>)
    {
        this.scriptFiles = scriptFiles;
    }

    public async getJSCallGraphResult()
    {
        const filePaths = this.scriptFiles.map(({filePath}) => filePath);
        // separate sync works to async ones to optimize performance
        const ast = await this.setImmediatePromise(astutil.astFromFiles(filePaths));
        await this.setImmediatePromise(bindings.addBindings(ast));
        return await this.setImmediatePromise(semioptimistic.buildCallGraph(ast));
    }
}