import {FunctionInfo} from '../FunctionInfo';
import {ScriptFile} from '../ScriptFile';

describe(FunctionInfo, () =>
{
    const global = new FunctionInfo(null, null, null, null, null, FunctionInfo.GLOBAL);
    const nonGlobal = new FunctionInfo(new ScriptFile('/a/b.js'), 0, 20, 0, 20, new Set());
    const global2 = new FunctionInfo(null, null, null, null, null, FunctionInfo.GLOBAL);
    const nonGlobal2 = new FunctionInfo(new ScriptFile('/a/b.js'), 0, 20, 0, 20, new Set());
    const changeScriptFileNonGlobal = new FunctionInfo(new ScriptFile('/a/c.js'), 0, 20, 0, 20, new Set());
    const changeStartIndexNonGlobal = new FunctionInfo(new ScriptFile('/a/b.js'), 2, 20, 2, 20, new Set());
    const changeEndIndexNonGlobal = new FunctionInfo(new ScriptFile('/a/b.js'), 0, 21, 0, 21, new Set());

    it('global to global', function ()
    {
        expect(global.equals(global2)).toBe(true);
    });

    it('global to non-global', function ()
    {
        expect(global.equals(nonGlobal)).toBe(false);
    });

    it('non-global to non-global', function ()
    {
        expect(nonGlobal.equals(nonGlobal2)).toBe(true);
    });

    it('non-global to non-global with scriptFile changed', function ()
    {
        expect(nonGlobal.equals(changeScriptFileNonGlobal)).toBe(false);
    });

    it('non-global to non-global with bodyStartIndex changed', function ()
    {
        expect(nonGlobal.equals(changeStartIndexNonGlobal)).toBe(false);
    });

    it('non-global to non-global with bodyEndIndex changed', function ()
    {
        expect(nonGlobal.equals(changeEndIndexNonGlobal)).toBe(false);
    });
});