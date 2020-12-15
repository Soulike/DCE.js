function CallAnalysis()
{
    /**
     * @type SimpleFunctionCall[]
     * */
    const simpleFunctionCalls = [];
    /**
     * @type (null|{iid: any, sid: any})[]
     * */
    let functionStack = [null];  // null for global

    this.functionEnter = function (iid, _f, _dis, _args)
    {
        functionStack.push({
            iid,
            sid: J$.sid,
        });
    };

    this.functionExit = function (_iid, _returnVal, _wrappedExceptionVal)
    {
        functionStack.pop();
    };

    this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid)
    {
        if (functionSid !== undefined && functionIid !== undefined)  // undefined if it's native method
        {
            const iidAndSid = functionStack[functionStack.length - 1];
            const sourcePartialFunctionInfo = getSourcePartialFunctionInfo(iidAndSid);
            const targetPartialFunctionInfo = getTargetSimpleFunctionCall(functionIid, functionSid);
            if (sourcePartialFunctionInfo !== null && targetPartialFunctionInfo !== null)
            {
                simpleFunctionCalls.push({
                    caller: sourcePartialFunctionInfo,
                    callee: targetPartialFunctionInfo,
                });
            }
        }
    };

    this.endExecution = function ()
    {
        console.log(JSON.stringify(simpleFunctionCalls));
    };

    /**
     * @returns PartialFunctionInfo | null
     * */
    function getSourcePartialFunctionInfo(iidAndSId)
    {
        if (iidAndSId === null)    // global
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
            const {
                iid,
                sid,
            } = iidAndSId;
            const iids = J$.smap[sid];
            const {originalCodeFileName} = iids;
            if (originalCodeFileName === 'evalIndirect' || originalCodeFileName === 'eval')
            {
                return null;
            }
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
     * @returns PartialFunctionInfo | null
     * */
    function getTargetSimpleFunctionCall(functionIid, functionSid)
    {
        const iids = J$.smap[functionSid];
        const {originalCodeFileName} = iids;
        if (originalCodeFileName === 'evalIndirect' || originalCodeFileName === 'eval')
        {
            return null;
        }
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