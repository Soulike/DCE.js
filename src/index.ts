import {HTMLProcessor} from './HTMLProcessor';
import {JavaScriptProcessor} from './JavaScriptProcessor';
import {ScriptFileScanner} from './ScriptFileScanner';
import {FunctionScanner} from './FunctionScanner';
import {DynamicCallGraphBuilder} from './DynamicCallGraphBuilder';
import {FunctionInfo} from './DataClass/FunctionInfo';
import {FunctionInfosContainer} from './FunctionInfosContainer';
import {StaticCallGraphBuilder} from './StaticCallGraphBuilder';
import {FunctionCallsMerger} from './FunctionCallsMerger';
import {IsolatedFunctionIdentifier} from './IsolatedFunctionIdentifier';
import {DeadFunctionEliminator} from './DeadFunctionEliminator';
import {ArgumentParser} from './ArgumentParser';
import fse from 'fs-extra';
import {createTempDirectory} from './Function/File';

const argumentParser = new ArgumentParser(process.argv);
const {'info-only': infoOnly, help, d, _} = argumentParser.getParsedArguments();

if (help)
{
    ArgumentParser.printHelp();
}
else
{
    (async () =>
    {
        console.time('All Finished');
        try
        {
            let directoryPath = '';
            if (_.length === 0)
            {
                console.error(`no input directory is specified`);
                return;
            }
            if (_.length > 1)
            {
                console.warn(`more than one input directories specified. Only the first one will be processed.`);
            }

            if (d !== null)
            {
                await fse.copy(_[0], d, {
                    overwrite: false,
                    errorOnExist: true,
                });
                directoryPath = d;
            }
            else if (infoOnly)
            {
                const tempDirectoryPath = await createTempDirectory();
                await fse.copy(_[0], tempDirectoryPath, {
                    overwrite: true,
                });
                directoryPath = tempDirectoryPath;
            }
            else
            {
                directoryPath = _[0];
            }

            console.time('HTMLProcessor');

            const htmlProcessor = new HTMLProcessor(directoryPath);
            await htmlProcessor.doProcess();

            console.timeEnd('HTMLProcessor');
            console.time('ScriptFileScanner');


            const scriptFileScanner = new ScriptFileScanner(directoryPath);
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
            const dynamicCallGraphBuilder = new DynamicCallGraphBuilder(directoryPath, functionInfosContainer.getHashToFunctionInfos());

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
        catch (e)
        {
            console.log(e);
        }
        finally
        {
            console.timeEnd('All Finished');
        }
    })();
}