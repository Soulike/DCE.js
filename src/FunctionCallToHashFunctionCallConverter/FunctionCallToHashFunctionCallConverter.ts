import {FunctionCall} from '../DataClass/FunctionCall';
import {HashFunctionCall} from '../DataClass/HashFunctionCall';

export class FunctionCallToHashFunctionCallConverter
{
    private readonly functionCall: Readonly<FunctionCall>;

    constructor(functionCall: Readonly<FunctionCall>)
    {
        this.functionCall = functionCall;
    }

    public getHashFunctionCall(): HashFunctionCall
    {
        const {caller, callee} = this.functionCall;
        return new HashFunctionCall(
            caller.getHash(),
            callee.map(functionInfo => functionInfo.getHash()));
    }
}