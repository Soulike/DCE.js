function CallAnalysis()
{
    /**
     * @type SimpleFunctionCall[]
     * */
    const simpleFunctionCalls = [];

    this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid)
    {
        if (functionSid !== undefined && functionIid !== undefined)  // undefined if it's native method
        {
            const sourcePartialFunctionInfo = getSourcePartialFunctionInfo(iid);
            const targetPartialFunctionInfo = getTargetSimpleFunctionCall(functionIid, functionSid);
            simpleFunctionCalls.push({
                caller: sourcePartialFunctionInfo,
                callee: targetPartialFunctionInfo,
            });
        }
    };

    this.endExecution = function ()
    {
        console.log(JSON.stringify(simpleFunctionCalls));
    };

    /**
     * @returns PartialFunctionInfo
     * */
    function getSourcePartialFunctionInfo(iid)
    {
        const iids = J$.smap[J$.sid];
        const {originalCodeFileName} = iids;
        const [beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber] = iids[iid];
        return {
            scriptFilePath: originalCodeFileName,
            startRowNumber: beginLineNumber,
            startColumnNumber: beginColumnNumber,
            endRowNumber: endLineNumber,
            endColumnNumber: endColumnNumber,
        };
    }

    /**
     * @returns PartialFunctionInfo
     * */
    function getTargetSimpleFunctionCall(functionIid, functionSid)
    {
        if (functionSid === J$.sid) // in the same file
        {
            return getSourcePartialFunctionInfo(functionIid);
        }
        else
        {
            const iids = J$.smap[functionSid];
            const {originalCodeFileName} = iids;
            const [beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber] = iids[functionIid];
            return {
                scriptFilePath: originalCodeFileName,
                startRowNumber: beginLineNumber,
                startColumnNumber: beginColumnNumber,
                endRowNumber: endLineNumber,
                endColumnNumber: endColumnNumber,
            };
        }
    }
}

(function (sandbox)
{
    sandbox.analysis = new CallAnalysis();
    if (sandbox.Constants.isBrowser)
    {
        setTimeout(() =>
        {
            sandbox.analysis.endExecution();
        }, 5000);   // wait for 5s
    }
}(J$));