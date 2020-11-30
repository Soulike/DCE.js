import {RowColumnToIndexConverter} from '../RowColumnToIndexConverter';
import {createTempDirectory} from '../../Function/File';
import fse from 'fs-extra';
import path from 'path';
import cryptoRandomString from 'crypto-random-string';
import {ScriptFile} from '../../DataClass/ScriptFile';

describe(RowColumnToIndexConverter, () =>
{
    let tempDir = '';

    afterEach(async () =>
    {
        await fse.remove(tempDir);
    });

    it('should handle row number less than 0', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(-1, 2)).rejects.toThrow(Error);
    });

    it('should handle col number less than 0', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(2, -2)).rejects.toThrow(Error);
    });

    it('should handle row number equaling 0', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(0, 2)).rejects.toThrow(Error);
    });

    it('should handle col number equaling 0', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(3, 0)).rejects.toThrow(Error);
    });

    it('should handle row number not being a integer', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(1.3, 2)).rejects.toThrow(Error);
    });

    it('should handle col number not being a integer', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(1, 2.1)).rejects.toThrow(Error);
    });

    it('should handle empty string', async function ()
    {
        const tempFile = await createTempFile('');
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(1, 1)).rejects.toThrow(Error);
    });

    it('should handle string having only one \\n', async function ()
    {
        const tempFile = await createTempFile('\n');
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(1, 1)).resolves.toBe(1);
    });

    it('should handle string having only \\n', async function ()
    {
        const tempFile = await createTempFile('\n\n\n\n\n');
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(5, 1)).resolves.toBe(5);
    });

    it('should handle string in one line', async function ()
    {
        const tempFile = await createTempFile(cryptoRandomString({length: 10}));
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(1, 5)).resolves.toBe(5);
    });

    it('should handle string in multiple lines', async function ()
    {
        const tempFile = await createTempFile(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}`);
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(2, 2)).resolves.toBe(13);
    });

    it('should handle row number out of range', async function ()
    {
        const tempFile = await createTempFile(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}`);
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(4, 2)).rejects.toThrow(Error);
    });

    it('should handle col number out of range', async function ()
    {
        const tempFile = await createTempFile(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}`);
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(3, 6)).rejects.toThrow(Error);
    });

    it('should handle \\r\\n', async function ()
    {
        const tempFile = await createTempFile(`${cryptoRandomString({length: 10})}\r\n${cryptoRandomString({length: 3})}\r\n${cryptoRandomString({length: 5})}`);
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(2, 2)).resolves.toBe(14);
    });

    it('should handle tailing \\n', async function ()
    {
        const tempFile = await createTempFile(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}\n`);
        const converter = new RowColumnToIndexConverter(new ScriptFile(tempFile));
        await expect(converter.getIndex(3, 6)).resolves.toBe(21);
    });

    async function createTempFile(content: string)
    {
        tempDir = await createTempDirectory();
        const tempFile = path.join(tempDir, 'test');
        await fse.outputFile(tempFile, content);
        return tempFile;
    }
});