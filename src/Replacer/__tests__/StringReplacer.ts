import {StringReplacer} from '../StringReplacer';
import {ReplaceInfo} from '../Class/ReplaceInfo';
import {Range} from '../Class/Range';

describe(StringReplacer, () =>
{
    it('should replace string', function ()
    {
        const originalString = '0123456789';
        const stringReplacer = new StringReplacer(originalString, [
            new ReplaceInfo(new Range(0, 2), '1'),
            new ReplaceInfo(new Range(6, 9), '686846'),
            new ReplaceInfo(new Range(9, 10), '878'),
            new ReplaceInfo(new Range(3, 4), '335533'),
        ]);
        expect(stringReplacer.getReplacedString()).toBe('1233553345686846878');
    });

    it('should not modify string when no replaceInfo', function ()
    {
        const originalString = '0123456789';
        const stringReplacer = new StringReplacer(originalString, []);
        expect(stringReplacer.getReplacedString()).toBe(originalString);
    });

    it('should handle inclusive ranges', function ()
    {
        const originalString = '0123456789';
        const stringReplacer = new StringReplacer(originalString, [
            new ReplaceInfo(new Range(0, 1), '1'),
            new ReplaceInfo(new Range(6, 9), '686846'),
            new ReplaceInfo(new Range(3, 4), '335533'),
            new ReplaceInfo(new Range(0, 2), '1'),
            new ReplaceInfo(new Range(9, 10), '878'),
            new ReplaceInfo(new Range(7, 8), '686846'),
        ]);
        expect(stringReplacer.getReplacedString()).toBe('1233553345686846878');
    });

    it('should handle overlap ranges', function ()
    {
        const originalString = '0123456789';
        const stringReplacer = new StringReplacer(originalString, [
            new ReplaceInfo(new Range(0, 3), '1'),
            new ReplaceInfo(new Range(1, 4), '1'),
        ]);
        expect(() => stringReplacer.getReplacedString()).toThrow(Error);
    });
});