import {Jalangi2OutputProcessor} from '../Jalangi2OutputProcessor';
import path from 'path';
import {SimpleFunctionCall} from '../../Interface';

describe(Jalangi2OutputProcessor, () =>
{
    it('should process jalangi2 original output correctly', function ()
    {
        const originalDirectoryPath = path.join('a', 'b', 'c');
        const instrumentedFileDirectoryPath = path.join('d', 'c', 'e');
        const testcase: SimpleFunctionCall[] = [{
            'caller': {
                'scriptFilePath': path.join(instrumentedFileDirectoryPath, '_orig_example_orig_.js'),
                'startRowNumber': 11,
                'startColumnNumber': 9,
                'endRowNumber': 11,
                'endColumnNumber': 14,
            },
            'callee': {
                'scriptFilePath': path.join(instrumentedFileDirectoryPath, 'example_orig_', 'example2_orig_.js'),
                'startRowNumber': 1,
                'startColumnNumber': 1,
                'endRowNumber': 3,
                'endColumnNumber': 2,
            },
        }];

        const jalangi2OutputProcessor = new Jalangi2OutputProcessor(originalDirectoryPath, instrumentedFileDirectoryPath, testcase);
        expect(jalangi2OutputProcessor.getProcessedSimpleFunctionCalls()).toEqual(<SimpleFunctionCall[]>[{
            'caller': {
                'scriptFilePath': path.join(originalDirectoryPath, '_orig_example.js'),
                'startRowNumber': 11,
                'startColumnNumber': 9,
                'endRowNumber': 11,
                'endColumnNumber': 14,
            },
            'callee': {
                'scriptFilePath': path.join(originalDirectoryPath, 'example_orig_', 'example2.js'),
                'startRowNumber': 1,
                'startColumnNumber': 1,
                'endRowNumber': 3,
                'endColumnNumber': 2,
            },
        }]);
    });

    it('should handle empty array', function ()
    {
        const originalDirectoryPath = path.join('a', 'b', 'c');
        const instrumentedFileDirectoryPath = path.join('d', 'c', 'e');
        const testcase: SimpleFunctionCall[] = [];

        const jalangi2OutputProcessor = new Jalangi2OutputProcessor(originalDirectoryPath, instrumentedFileDirectoryPath, testcase);
        expect(jalangi2OutputProcessor.getProcessedSimpleFunctionCalls()).toEqual(<SimpleFunctionCall[]>[]);
    });
});