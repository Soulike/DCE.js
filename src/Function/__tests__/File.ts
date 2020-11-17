import {createTempDirectory} from '../File';
import fse from 'fs-extra';
import path from 'path';

describe(createTempDirectory, () =>
{
    it('should return an absolute path', async function ()
    {
        const directoryPath = await createTempDirectory();
        expect(path.isAbsolute(directoryPath)).toBe(true);

        await fse.remove(directoryPath);

    });

    it('should create temporary directory', async function ()
    {
        const directoryPath = await createTempDirectory();
        const stat = await fse.promises.stat(directoryPath);
        expect(stat.isDirectory()).toBe(true);

        await fse.remove(directoryPath);
    });
});