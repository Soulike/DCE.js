import {CallGraphBuilder} from '../Interface/CallGraphBuilder';
import {FunctionCall} from '../DataClass/FunctionCall';
import {Jalangi2Wrapper} from './Jalangi2Wrapper';
import {PuppeteerWrapper} from './PuppeteerWrapper';
import {HTMLFileScanner} from '../HTMLFileScanner';
import {Jalangi2OutputProcessor} from './Jalangi2OutputProcessor';
import {SimpleFunctionCallProcessor} from './SimpleFunctionCallProcessor';
import {FunctionInfo} from '../DataClass/FunctionInfo';

export class DynamicCallGraphBuilder implements CallGraphBuilder
{
    private readonly directoryPath: string;
    private readonly hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>;
    private readonly encoding: BufferEncoding;

    constructor(directoryPath: string, hashToFunctionInfo: ReadonlyMap<string, Readonly<FunctionInfo>>, encoding: BufferEncoding = 'utf-8')
    {
        this.directoryPath = directoryPath;
        this.hashToFunctionInfo = hashToFunctionInfo;
        this.encoding = encoding;
    }

    public async getCallGraph(): Promise<FunctionCall[]>
    {
        console.time('DynamicCallGraphBuilder');
        try
        {
            const jalangi2Wrapper = new Jalangi2Wrapper(this.directoryPath);
            const instrumentedFilesDirectoryPath = await jalangi2Wrapper.getInstrumentedFilesDirectoryPath();

            const htmlFileScanner = new HTMLFileScanner(instrumentedFilesDirectoryPath);
            const htmlFilePaths = await htmlFileScanner.getFilePaths();

            const callGraphsPerHTMLFile = await Promise.all(htmlFilePaths.map(async filePath =>
            {
                const puppeteerWrapper = new PuppeteerWrapper(filePath);
                const simpleFunctionCalls = await puppeteerWrapper.getSimpleFunctionCalls();

                const jalangi2OutputProcessor = new Jalangi2OutputProcessor(this.directoryPath, instrumentedFilesDirectoryPath, simpleFunctionCalls);
                const processedSimpleFunctionCalls = jalangi2OutputProcessor.getProcessedSimpleFunctionCalls();

                const simpleFunctionCallProcessor = new SimpleFunctionCallProcessor(processedSimpleFunctionCalls, this.hashToFunctionInfo, this.encoding);
                return await simpleFunctionCallProcessor.getCallGraph();
            }));
            return callGraphsPerHTMLFile.flat();
        }
        finally
        {
            console.timeEnd('DynamicCallGraphBuilder');
        }
    }
}