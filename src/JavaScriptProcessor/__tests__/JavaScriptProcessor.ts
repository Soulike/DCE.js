import {JavaScriptProcessor} from '../JavaScriptProcessor';
import {createTempDirectory} from '../../Function/File';
import fse from 'fs-extra';
import path from 'path';
import {ScriptFile} from '../../DataClass/ScriptFile';

describe(JavaScriptProcessor, () =>
{
    let tempDirectoryPath = '';
    let tempFilePath = '';

    beforeEach(async () =>
    {
        tempDirectoryPath = await createTempDirectory();
        tempFilePath = await createTempFile(tempDirectoryPath);
    });

    afterEach(async () =>
    {
        await removeTempFiles(tempDirectoryPath);
    });

    it('should process JavaScript file', async function ()
    {
        const javaScriptProcessor = new JavaScriptProcessor(new ScriptFile(tempFilePath));
        await javaScriptProcessor.doProcess();
        await expect(readTempFile(tempFilePath)).resolves.toBe(
            `const sum1 = (a,b) => a+b;const sum2 = function(a,b){return a+b};const sum3 = function(a,b){return a+b};`);
    });

    async function createTempFile(tempDirectoryPath: string): Promise<string>
    {
        const tempFilePath = path.join(tempDirectoryPath, 'test.js');
        const code =
            `const sum1 = (a,b) => a+b;const sum2 = new Function('a,b', 'return a+b');eval("const sum3 = Function('a', 'b', 'return a+b')");`;
        await fse.outputFile(tempFilePath, code);
        return tempFilePath;
    }

    async function removeTempFiles(tempDirectoryPath: string): Promise<void>
    {
        await fse.remove(tempDirectoryPath);
    }

    async function readTempFile(tempFilePath: string): Promise<string>
    {
        return await fse.promises.readFile(tempFilePath, 'utf-8');
    }
});