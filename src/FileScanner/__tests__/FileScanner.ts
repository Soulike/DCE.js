import {FileScanner} from '../FileScanner';
import fse from 'fs-extra';
import path from 'path';
import {createTempDirectory} from '../../Function/File';

describe(FileScanner, () =>
{
    /* File tree in temp directory
     * |
     * |- test1.html
     * |- test2.js
     * |- testDirectory/
     * |     |- test3.html
     * */

    let tempDirectoryPath = '';

    beforeAll(async () =>
    {
        tempDirectoryPath = await createTempDirectory();
        await createTempFiles(tempDirectoryPath);
    });

    afterAll(async () =>
    {
        await removeTempFiles(tempDirectoryPath);
    });

    it('should scan certain type of file', async function ()
    {
        const fileScannerForHtml = new FileScanner(tempDirectoryPath, 'html');
        const fileScannerForJs = new FileScanner(tempDirectoryPath, 'js');
        const [htmlFilePaths, jsFilePaths] = await Promise.all([
            fileScannerForHtml.getFilePaths(),
            fileScannerForJs.getFilePaths(),
        ]);
        expect(htmlFilePaths).toEqual([
            path.join(tempDirectoryPath, 'test1.html'),
            path.join(tempDirectoryPath, 'testDirectory/test3.html'),
        ]);
        expect(jsFilePaths).toEqual([
            path.join(tempDirectoryPath, 'test2.js'),
        ]);
    });

    it('should throw error', async function ()
    {
        // 'directoryPath' does not exist
        const fileScanner = new FileScanner(tempDirectoryPath + 'wadawe', 'html');
        await expect(fileScanner.getFilePaths()).rejects.toThrow();
    });

    async function createTempFiles(tempDirectoryPath: string): Promise<void>
    {
        await Promise.all([
            fse.ensureFile(path.join(tempDirectoryPath, 'test1.html')),
            fse.ensureFile(path.join(tempDirectoryPath, 'test2.js')),
            fse.ensureDir(path.join(tempDirectoryPath, 'testDirectory')),
        ]);
        await fse.ensureFile(path.join(tempDirectoryPath, 'testDirectory', 'test3.html'));
    }

    async function removeTempFiles(tempDirectoryPath: string): Promise<void>
    {
        await fse.remove(tempDirectoryPath);
    }
});