import {FunctionInfoMapConverter} from '../FunctionInfoMapConverter';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {ScriptFile} from '../../DataClass/ScriptFile';

describe(FunctionInfoMapConverter, () =>
{
    it('should handle empty FunctionInfo[]', function ()
    {
        const converter = new FunctionInfoMapConverter([]);
        expect(converter.getFunctionInfoMap()).toEqual(new Map());
    });

    it('should convert FunctionInfo[] to Map', function ()
    {
        const functionInfos = [
            new FunctionInfo(new ScriptFile('a'), 0, 1, 2, 3),
            new FunctionInfo(new ScriptFile('b'), 4, 5, 6, 7),
            new FunctionInfo(new ScriptFile('c'), 8, 9, 10, 11),
        ];
        const functionInfoMap = new Map(functionInfos.map(info => [info.getHash(), info]));
        const converter = new FunctionInfoMapConverter(functionInfos);
        expect([...converter.getFunctionInfoMap()].sort()).toEqual([...functionInfoMap].sort());    // ignore sequence
    });
});