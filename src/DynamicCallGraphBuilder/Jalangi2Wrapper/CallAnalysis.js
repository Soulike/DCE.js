function CallAnalysis()
{
    /**
     * @type SimpleFunctionCall[]
     * */
    const simpleFunctionCalls = [];
    let functionIIDStack = [null];  // null for global

    this.functionEnter = function (iid, _f, _dis, _args)
    {
        functionIIDStack.push(iid);
    };

    this.functionExit = function (_iid, _returnVal, _wrappedExceptionVal)
    {
        functionIIDStack.pop();
    };

    this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid)
    {
        if (functionSid !== undefined && functionIid !== undefined)  // undefined if it's native method
        {
            const sourcePartialFunctionInfo = getSourcePartialFunctionInfo(functionIIDStack[functionIIDStack.length - 1]);
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
        if (iid === null)    // global
        {
            return {
                scriptFilePath: null,
                startRowNumber: null,
                startColumnNumber: null,
                endRowNumber: null,
                endColumnNumber: null,
            };
        }
        else
        {
            const [beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber] = iids[iid];
            return {
                scriptFilePath: originalCodeFileName,
                startRowNumber: beginLineNumber,
                startColumnNumber: beginColumnNumber,
                endRowNumber: endLineNumber,
                endColumnNumber: endColumnNumber,
            };
        }
    }

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
    sandbox.analysis = new CallAnalysis();
    if (sandbox.Constants.isBrowser)
    {
        setTimeout(() =>
        {
            sandbox.analysis.endExecution();
        }, 5000);   // wait for 5s
    }
}(J$));