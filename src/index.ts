import fse from 'fs-extra';
import {createTempDirectory} from './Function/File';
import {HTMLProcessor} from './HTMLProcessor';
import {ScriptFileScanner} from './ScriptFileScanner';
import {JavaScriptProcessor} from './JavaScriptProcessor';
import {FunctionScanner} from './FunctionScanner';
import {FunctionInfo} from './DataClass/FunctionInfo';
import {FunctionInfosContainer} from './FunctionInfosContainer';
import {StaticCallGraphBuilder} from './StaticCallGraphBuilder';
import {DynamicCallGraphBuilder} from './DynamicCallGraphBuilder';
import {FunctionCallsMerger} from './FunctionCallsMerger';
import {IsolatedFunctionIdentifier} from './IsolatedFunctionIdentifier';
import {DeadFunctionEliminator} from './DeadFunctionEliminator';

export interface Options
{
    infoOnly?: boolean;
    destination?: string | null;
}

export default async function (sourceDirectoryPath: string, options: Partial<Options> = {
    infoOnly: false,
    destination: null,
})
{
    let processingDirectoryPath = '';
    const {infoOnly, destination} = options;

    console.time('All Finished');
    try
    {
        if (typeof destination === 'string')
        {
            await fse.copy(sourceDirectoryPath, destination, {
                overwrite: false,
                errorOnExist: true,
            });
            processingDirectoryPath = destination;
        }
        else if (infoOnly)
        {
            const tempDirectoryPath = await createTempDirectory();
            await fse.copy(sourceDirectoryPath, tempDirectoryPath, {
                overwrite: true,
            });
            processingDirectoryPath = tempDirectoryPath;
        }
        else
        {
            processingDirectoryPath = sourceDirectoryPath;
        }

        console.time('HTMLProcessor');

        const htmlProcessor = new HTMLProcessor(processingDirectoryPath);
        await htmlProcessor.doProcess();

        console.timeEnd('HTMLProcessor');
        console.time('ScriptFileScanner');


        const scriptFileScanner = new ScriptFileScanner(processingDirectoryPath);
        const scriptFiles = await scriptFileScanner.getScriptFiles();

        console.timeEnd('ScriptFileScanner');
        console.time('JavaScriptProcessor');

        await Promise.all(scriptFiles.map(async scriptFile =>
        {
            const javaScriptProcessor = new JavaScriptProcessor(scriptFile);
            await javaScriptProcessor.doProcess();
        }));

        console.timeEnd('JavaScriptProcessor');
        console.time('FunctionScanner');

        const functionInfos = (await Promise.all(scriptFiles.map(async scriptFile =>
        {
            const functionScanner = new FunctionScanner(scriptFile);
            return await functionScanner.getFunctionInfos();
        }))).flat();

        console.timeEnd('FunctionScanner');

        functionInfos.push(FunctionInfo.GLOBAL);

        const functionInfosContainer = new FunctionInfosContainer(functionInfos);

        console.time('CallGraphBuilder');

        const staticCallGraphBuilder = new StaticCallGraphBuilder(scriptFiles, functionInfosContainer.getHashToFunctionInfos());
        const dynamicCallGraphBuilder = new DynamicCallGraphBuilder(processingDirectoryPath, functionInfosContainer.getHashToFunctionInfos());

        const [staticCallGraph, dynamicCallGraph] = await Promise.all([
            staticCallGraphBuilder.getCallGraph(),
            dynamicCallGraphBuilder.getCallGraph(),
        ]);

        console.timeEnd('CallGraphBuilder');
        console.time('FunctionCallsMerger');

        const functionCallsMerger = new FunctionCallsMerger(functionInfosContainer.getHashToFunctionInfos(), staticCallGraph, dynamicCallGraph);
        const mergedFunctionCalls = functionCallsMerger.getMergedFunctionCalls();

        console.timeEnd('FunctionCallsMerger');
        console.time('IsolatedFunctionIdentifier');

        const isolatedFunctionIdentifier = new IsolatedFunctionIdentifier(mergedFunctionCalls, functionInfosContainer.getHashToFunctionInfos());
        const isolatedFunctionInfos = isolatedFunctionIdentifier.getIsolatedFunctions();

        console.timeEnd('IsolatedFunctionIdentifier');

        if (!infoOnly)
        {
            console.time('DeadFunctionEliminator');

            const deadFunctionEliminator = new DeadFunctionEliminator(isolatedFunctionInfos);
            await deadFunctionEliminator.doProcess();

            console.timeEnd('DeadFunctionEliminator');
        }
        else
        {
            console.log(JSON.stringify(isolatedFunctionInfos, null, 2));
        }
    }
    finally
    {
        console.timeEnd('All Finished');
    }
}