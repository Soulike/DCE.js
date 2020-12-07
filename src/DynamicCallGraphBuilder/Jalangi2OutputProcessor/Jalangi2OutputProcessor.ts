import {PartialFunctionInfo, SimpleFunctionCall} from '../Interface';
import path from 'path';

export class Jalangi2OutputProcessor
{
    private readonly originalDirectoryPath: string;
    private readonly instrumentedFileDirectoryPath: string;
    private readonly simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>;

    constructor(originalDirectoryPath: string, instrumentedFileDirectoryPath: string, simpleFunctionCalls: Readonly<Readonly<SimpleFunctionCall>[]>)
    {
        this.originalDirectoryPath = originalDirectoryPath;
        this.instrumentedFileDirectoryPath = instrumentedFileDirectoryPath;
        this.simpleFunctionCalls = simpleFunctionCalls;
    }

    /**
     * @description ***_orig_.js => ***.js
     * */
    private static recoverJalangi2FileName(fileName: string): string
    {
        const pattern = /^(.+)_orig_\.js$/;
        return fileName.replace(pattern, '$1.js');
    }

    /**
     * @return processed SimpleFunctionCalls (new instances).
     * */
    public getProcessedSimpleFunctionCalls(): SimpleFunctionCall[]
    {
        return this.simpleFunctionCalls.map(simpleFunctionCall => this.getProcessedSimpleFunctionCall(simpleFunctionCall));
    }

    private getProcessedSimpleFunctionCall(originalSimpleFunctionCall: Readonly<SimpleFunctionCall>): SimpleFunctionCall
    {
        const {caller, callee} = originalSimpleFunctionCall;
        const [newCaller, newCallee]: [PartialFunctionInfo, PartialFunctionInfo] = [{...caller}, {...callee}];

        newCaller.scriptFilePath = path.join(this.originalDirectoryPath,
            Jalangi2OutputProcessor.recoverJalangi2FileName(path.relative(this.instrumentedFileDirectoryPath, caller.scriptFilePath)),
        );
        newCallee.scriptFilePath = path.join(this.originalDirectoryPath,
            Jalangi2OutputProcessor.recoverJalangi2FileName(path.relative(this.instrumentedFileDirectoryPath, callee.scriptFilePath)),
        );

        return {
            caller: newCaller,
            callee: newCallee,
        };
    }
}