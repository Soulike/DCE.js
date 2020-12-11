import {FilePathToFileReplacersGenerator} from '../FilePathToFileReplacersGenerator';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {Range, ReplaceInfo} from '../../Replacer';

describe(FilePathToFileReplacersGenerator, () =>
{
    it('should handle empty FunctionInfo[]', function ()
    {
        const generator = new FilePathToFileReplacersGenerator([]);
        expect(generator.getFilePathToReplaceInfos().size).toBe(0);
    });

    it('should convert FunctionInfo[] to Map', function ()
    {
        const functionInfos = [
            new FunctionInfo(new ScriptFile('a'), 1, 90, 45, 89),
            new FunctionInfo(new ScriptFile('a'), 1, 100, 78, 96),
            new FunctionInfo(new ScriptFile('b'), 1, 25, 5, 20),
            new FunctionInfo(new ScriptFile('c'), 1, 512, 100, 256),
        ];
        const generator = new FilePathToFileReplacersGenerator(functionInfos);
        const map = generator.getFilePathToReplaceInfos();
        const obj: { [key: string]: ReplaceInfo[] } = {};
        map.forEach((replaceInfo, filePath) =>
        {
            obj[filePath] = replaceInfo;
        });
        expect(obj).toEqual({
            a: [
                new ReplaceInfo(new Range(45, 89), `1${' '.repeat(89 - 45 - 1)}`),
                new ReplaceInfo(new Range(78, 96), `1${' '.repeat(96 - 78 - 1)}`),
            ],
            b: [new ReplaceInfo(new Range(5, 20), `1${' '.repeat(20 - 5 - 1)}`)],
            c: [new ReplaceInfo(new Range(100, 256), `1${' '.repeat(256 - 100 - 1)}`)],
        });
    });
});