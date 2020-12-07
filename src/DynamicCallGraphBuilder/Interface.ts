// used by CallAnalysis.js
export interface PartialFunctionInfo
{
    scriptFilePath: string | null;
    startRowNumber: number | null;
    startColumnNumber: number | null;
    endRowNumber: number | null;
    endColumnNumber: number | null;
}

export interface SimpleFunctionCall
{
    readonly caller: PartialFunctionInfo;   // 调用函数
    readonly callee: PartialFunctionInfo;   // 被调用函数
}

export function isPartialFunctionInfo(obj: any): obj is PartialFunctionInfo
{
    if (obj === undefined || obj === null)
    {
        return false;
    }
    const partialFunctionInfo: PartialFunctionInfo = {
        scriptFilePath: '',
        startRowNumber: 0,
        startColumnNumber: 0,
        endRowNumber: 0,
        endColumnNumber: 0,
    };
    return Object.keys(partialFunctionInfo).join('') === Object.keys(obj).join('');
}

export function isSimpleFunctionCall(obj: any): obj is SimpleFunctionCall
{
    if (obj === undefined || obj === null)
    {
        return false;
    }
    const {caller, callee} = obj;
    return isPartialFunctionInfo(caller) && isPartialFunctionInfo(callee);
}