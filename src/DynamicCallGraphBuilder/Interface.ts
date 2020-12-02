// used by CallAnalysis.js
export interface PartialFunctionInfo
{
    scriptFilePath: string;
    startRowNumber: number;
    startColumnNumber: number;
    endRowNumber: number;
    endColumnNumber: number;
}

export interface SimpleFunctionCall
{
    readonly caller: PartialFunctionInfo;   // 调用函数
    readonly callee: PartialFunctionInfo;   // 被调用函数
}