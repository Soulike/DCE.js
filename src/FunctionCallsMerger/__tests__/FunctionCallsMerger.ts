import {FunctionCallsMerger} from '../FunctionCallsMerger';
import {FunctionCall} from '../../DataClass/FunctionCall';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {ScriptFile} from '../../DataClass/ScriptFile';

describe(FunctionCallsMerger, () =>
{
    const functionInfoA = new FunctionInfo(new ScriptFile('a'), 1, 2, 3, 4);
    const functionInfoB = new FunctionInfo(new ScriptFile('b'), 2, 3, 4, 5);
    const functionInfoC = new FunctionInfo(new ScriptFile('c'), 3, 4, 5, 6);
    const functionInfoD = new FunctionInfo(new ScriptFile('d'), 4, 5, 6, 7);
    const functionInfos = [functionInfoA, functionInfoB, functionInfoC, functionInfoD];

    it('should not merge FunctionCalls whose callers are different', function ()
    {
        const functionCallA = new FunctionCall(functionInfoA, [functionInfoC]);
        const functionCallB = new FunctionCall(functionInfoB, [functionInfoD]);
        const functionCallC = new FunctionCall(functionInfoC, [functionInfoD]);
        const functionCallsMerger = new FunctionCallsMerger(functionInfos, [functionCallA, functionCallB], [functionCallC]);
        const mergedFunctionCalls = functionCallsMerger.getMergedFunctionCalls();
        // .toContainEqual is not working here
        expect(JSON.stringify(mergedFunctionCalls.sort())).toBe(JSON.stringify([
            functionCallA, functionCallB, functionCallC,
        ].sort()));
    });

    it('should merge FunctionCalls whose callers are the same', function ()
    {
        const functionCallA = new FunctionCall(functionInfoA, []);
        const functionCallB = new FunctionCall(functionInfoA, []);
        const functionCallC = new FunctionCall(functionInfoC, []);
        const functionCallsMerger = new FunctionCallsMerger(functionInfos, [functionCallA, functionCallB], [functionCallC]);
        const mergedFunctionCalls = functionCallsMerger.getMergedFunctionCalls();
        // .toContainEqual is not working here
        expect(JSON.stringify(mergedFunctionCalls.sort())).toBe(JSON.stringify([
            functionCallA, functionCallC,
        ].sort()));
    });

    it('should merge callee correctly with duplicates', function ()
    {
        const functionCallA = new FunctionCall(functionInfoA, [functionInfoB]);
        const functionCallB = new FunctionCall(functionInfoA, [functionInfoB]);
        const functionCallC = new FunctionCall(functionInfoA, [functionInfoC]);
        const functionCallD = new FunctionCall(functionInfoA, [functionInfoC]);
        const functionCallsMerger = new FunctionCallsMerger(functionInfos, [functionCallA, functionCallB], [functionCallC, functionCallD]);
        const mergedFunctionCalls = functionCallsMerger.getMergedFunctionCalls();
        // .toContainEqual is not working here
        expect(JSON.stringify(mergedFunctionCalls.sort())).toBe(JSON.stringify([
            new FunctionCall(functionInfoA, [functionInfoB, functionInfoC]),
        ].sort()));
    });

    it('should merge callee correctly without duplicates', function ()
    {
        const functionCallA = new FunctionCall(functionInfoA, [functionInfoB]);
        const functionCallB = new FunctionCall(functionInfoA, [functionInfoC]);
        const functionCallC = new FunctionCall(functionInfoA, [functionInfoD]);
        const functionCallsMerger = new FunctionCallsMerger(functionInfos, [functionCallA, functionCallB], [functionCallC]);
        const mergedFunctionCalls = functionCallsMerger.getMergedFunctionCalls();
        // .toContainEqual is not working here
        expect(JSON.stringify(mergedFunctionCalls.sort())).toBe(JSON.stringify([
            new FunctionCall(functionInfoA, [functionInfoB, functionInfoC, functionInfoD]),
        ].sort()));
    });
});