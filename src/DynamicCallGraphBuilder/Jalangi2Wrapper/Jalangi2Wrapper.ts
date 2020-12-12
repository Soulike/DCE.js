import path from 'path';
import childProcess from 'child_process';
import {createTempDirectory} from '../../Function/File';

export class Jalangi2Wrapper
{
    // all paths of jalangi2 analysis
    private static readonly ANALYSIS_PATHS: Readonly<string[]> = [
        path.join(__dirname, 'LogCallAnalysis.js'),
    ];

    private readonly directoryPath: string;

    constructor(directoryPath: string)
    {
        this.directoryPath = directoryPath;
    }

    private static getAnalysisParameters(): string[]
    {
        const stringBuffer: string[] = [];
        for (const analysisPath of Jalangi2Wrapper.ANALYSIS_PATHS)
        {
            stringBuffer.push('--analysis', analysisPath);
        }
        return stringBuffer;
    }

    public async getInstrumentedFilesDirectoryPath(): Promise<string>
    {
        const tempDir = await createTempDirectory();
        const jalangi2Path = path.join(__dirname, '..', '..', '..', 'node_modules', 'jalangi2');
        return new Promise((resolve, reject) =>
        {
            const cp = childProcess.spawn(
                'node', [
                    path.join(jalangi2Path, 'src', 'js', 'commands', 'instrument.js'),
                    '--inlineIID', '--inlineJalangi', '-d', '--verbose',
                    ...Jalangi2Wrapper.getAnalysisParameters(),
                    '--outputDir', tempDir,
                    this.directoryPath], {cwd: __dirname, shell: true});
            cp.stdout.on('data', data => console.log(data.toString()));
            cp.stdout.on('error', data => console.error(data.toString()));
            cp.on('exit', () => resolve(path.join(tempDir)));
            cp.on('error', (e) => reject(e));
        });
    }
}