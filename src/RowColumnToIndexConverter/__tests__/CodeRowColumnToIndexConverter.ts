import cryptoRandomString from 'crypto-random-string';
import {CodeRowColumnToIndexConverter} from '../CodeRowColumnToIndexConverter';

describe(CodeRowColumnToIndexConverter, () =>
{
    it('should handle row number less than 0', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(() => converter.getIndex(-1, 2)).toThrow(Error);
    });

    it('should handle col number less than 0', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(() => converter.getIndex(2, -2)).toThrow(Error);
    });

    it('should handle row number equaling 0', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(() => converter.getIndex(0, 2)).toThrow(Error);
    });

    it('should handle col number equaling 0', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(() => converter.getIndex(3, 0)).toThrow(Error);
    });

    it('should handle row number not being a integer', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(() => converter.getIndex(1.3, 2)).toThrow(Error);
    });

    it('should handle col number not being a integer', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(() => converter.getIndex(1, 2.1)).toThrow(Error);
    });

    it('should handle empty string', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter('');
        expect(() => converter.getIndex(1, 1)).toThrow(Error);
    });

    it('should handle string having only one \\n', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter('\n');
        expect(converter.getIndex(1, 1)).toBe(1);
    });

    it('should handle string having only \\n', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter('\n\n\n\n\n');
        expect(converter.getIndex(5, 1)).toBe(5);
    });

    it('should handle string in one line', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(cryptoRandomString({length: 10}));
        expect(converter.getIndex(1, 5)).toBe(5);
    });

    it('should handle string in multiple lines', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}`);
        expect(converter.getIndex(2, 2)).toBe(13);
    });

    it('should handle row number out of range', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}`);
        expect(() => converter.getIndex(4, 2)).toThrow(Error);
    });

    it('should handle col number out of range', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}`);
        expect(() => converter.getIndex(3, 6)).toThrow(Error);
    });

    it('should handle \\r\\n', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(`${cryptoRandomString({length: 10})}\r\n${cryptoRandomString({length: 3})}\r\n${cryptoRandomString({length: 5})}`);
        expect(converter.getIndex(2, 2)).toBe(14);
    });

    it('should handle tailing \\n', async function ()
    {
        const converter = new CodeRowColumnToIndexConverter(`${cryptoRandomString({length: 10})}\n${cryptoRandomString({length: 3})}\n${cryptoRandomString({length: 5})}\n`);
        expect(converter.getIndex(3, 6)).toBe(21);
    });
});