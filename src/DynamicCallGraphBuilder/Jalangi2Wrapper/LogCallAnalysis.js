function LogCallAnalysis()
{
    /**
     * @type SimpleFunctionCall[]
     * */
    const simpleFunctionCalls = [];

    this.functionEnter = function (iid, _f, _dis, _args)
    {
        if (iid !== undefined)  // undefined if it's native method
        {
            const sourcePartialFunctionInfo = {
                scriptFilePath: null,
                startRowNumber: null,
                startColumnNumber: null,
                endRowNumber: null,
                endColumnNumber: null,
            };
            const targetPartialFunctionInfo = getTargetSimpleFunctionCall(iid, J$.sid);
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
    function getTargetSimpleFunctionCall(functionIid, functionSid)
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

(function (sandbox)
{
    sandbox.analysis = new LogCallAnalysis();
    if (sandbox.Constants.isBrowser)
    {
        setTimeout(() =>
        {
            sandbox.analysis.endExecution();
        }, 5000);   // wait for 5s
    }
}(J$));