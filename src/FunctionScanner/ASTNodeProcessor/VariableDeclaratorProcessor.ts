import {ASTNodeProcessor} from '../Interface/ASTNodeProcessor';
import * as ESTree from 'estree';
import {ScriptFile} from '../../DataClass/ScriptFile';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import * as esprima from 'esprima';

// TODO：重构
export class VariableDeclaratorProcessor implements ASTNodeProcessor
{
    private readonly variableDeclarator: Readonly<ESTree.VariableDeclarator>;
    private readonly scriptFile: ScriptFile;
    private readonly knownFunctionInfoInScriptFile: Readonly<FunctionInfo[]>;

    constructor(variableDeclarator: Readonly<ESTree.VariableDeclarator>, scriptFile: ScriptFile, knownFunctionInfoInScriptFile: Readonly<FunctionInfo[]>)
    {
        this.variableDeclarator = variableDeclarator;
        this.scriptFile = scriptFile;
        this.knownFunctionInfoInScriptFile = knownFunctionInfoInScriptFile;
    }

    private static isInitializedByNewExpression(variableDeclarator: Readonly<ESTree.VariableDeclarator>): boolean
    {
        if (variableDeclarator.init === undefined || variableDeclarator.init === null)
        {
            return false;
        }
        return variableDeclarator.init.type === esprima.Syntax.NewExpression
            && variableDeclarator.init.callee.type === esprima.Syntax.Identifier
            && variableDeclarator.init.callee.name === 'Function';
    }

    private static getFunctionInfoFromNewExpression(variableDeclarator: Readonly<ESTree.VariableDeclarator>): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | null
    {
        if (!VariableDeclaratorProcessor.isInitializedByNewExpression(variableDeclarator))
        {
            throw new Error('Node is not initialized by NewExpression');
        }
        const name = new Set<string>();
        // should be impossible in VariableDeclarator
        if (variableDeclarator.id.type !== esprima.Syntax.Identifier)
        {
            // empty
        }
        else
        {
            name.add(variableDeclarator.id.name);
        }
        if (variableDeclarator.init !== undefined && variableDeclarator.init !== null
            && variableDeclarator.init.type === esprima.Syntax.NewExpression
            && variableDeclarator.init.callee.type === esprima.Syntax.Identifier
            && variableDeclarator.init.callee.name === 'Function')
        {
            const args = variableDeclarator.init.arguments;
            const {range} = args[args.length - 1];
            if (range === undefined)
            {
                throw new Error('"range" should not be undefined. Check esprima config and set "range" to true');
            }
            return {
                bodyStartIndex: range[0] + 1,
                bodyEndIndex: range[1] - 1,
                name,
            };
        }
        // should be impossible after isInitializedByNewExpression(), bypass type check
        else
        {
            return null;
        }
    }

    private static isInitializedByFunctionExpression(variableDeclarator: Readonly<ESTree.VariableDeclarator>): boolean
    {
        if (variableDeclarator.init === undefined || variableDeclarator.init === null)
        {
            return false;
        }
        return variableDeclarator.init.type === esprima.Syntax.FunctionExpression;
    }

    private static getFunctionInfoFromFunctionExpression(variableDeclarator: Readonly<ESTree.VariableDeclarator>): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | null
    {
        if (!VariableDeclaratorProcessor.isInitializedByFunctionExpression(variableDeclarator))
        {
            throw new Error('Node is not initialized by FunctionExpression');
        }
        const name = new Set<string>();
        // should be impossible in VariableDeclarator
        if (variableDeclarator.id.type !== esprima.Syntax.Identifier)
        {
            // empty
        }
        else
        {
            name.add(variableDeclarator.id.name);
        }
        if (variableDeclarator.init !== undefined && variableDeclarator.init !== null
            && variableDeclarator.init.type === esprima.Syntax.FunctionExpression)
        {
            const range = variableDeclarator.init.body.range;
            if (range === undefined)
            {
                throw new Error('"range" should not be undefined. Check esprima config and set "range" to true');
            }
            return {
                bodyStartIndex: range[0] + 1,
                bodyEndIndex: range[1] - 1,
                name,
            };
        }
        // should be impossible after isInitializedByFunctionExpression(), bypass type check
        else
        {
            return null;
        }
    }

    private static isInitializedByArrowFunctionExpression(variableDeclarator: Readonly<ESTree.VariableDeclarator>): boolean
    {
        if (variableDeclarator.init === undefined || variableDeclarator.init === null)
        {
            return false;
        }
        return variableDeclarator.init.type === esprima.Syntax.ArrowFunctionExpression;
    }

    private static getFunctionInfoFromArrowFunctionExpression(variableDeclarator: Readonly<ESTree.VariableDeclarator>): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | null
    {
        if (!VariableDeclaratorProcessor.isInitializedByArrowFunctionExpression(variableDeclarator))
        {
            throw new Error('Node is not initialized by ArrowFunctionExpression');
        }
        const name = new Set<string>();
        // should be impossible in VariableDeclarator
        if (variableDeclarator.id.type !== esprima.Syntax.Identifier)
        {
            // empty
        }
        else
        {
            name.add(variableDeclarator.id.name);
        }
        if (variableDeclarator.init !== undefined && variableDeclarator.init !== null
            && variableDeclarator.init.type === esprima.Syntax.ArrowFunctionExpression)
        {
            const range = variableDeclarator.init.body.range;
            if (range === undefined)
            {
                throw new Error('"range" should not be undefined. Check esprima config and set "range" to true');
            }
            return {
                bodyStartIndex: range[0] + 1,
                bodyEndIndex: range[1] - 1,
                name,
            };
        }
        // should be impossible after isInitializedByArrowFunctionExpression(), bypass type check
        else
        {
            return null;
        }
    }

    private static getRightNameFromVariableDeclaratorNode(variableDeclarator: Readonly<ESTree.VariableDeclarator>): string | null
    {
        if (variableDeclarator.init === undefined || variableDeclarator.init === null)
        {
            return null;
        }
        if (variableDeclarator.init.type !== esprima.Syntax.Identifier)
        {
            return null;
        }
        return variableDeclarator.init.name;
    }

    public getFunctionInfo(): FunctionInfo | null
    {
        if (VariableDeclaratorProcessor.isInitializedByNewExpression(this.variableDeclarator))
        {
            const functionInfo = VariableDeclaratorProcessor.getFunctionInfoFromNewExpression(this.variableDeclarator);
            if (functionInfo === null)
            {
                return null;
            }
            else
            {
                const {bodyStartIndex, bodyEndIndex, name} = functionInfo;
                return new FunctionInfo(this.scriptFile, bodyStartIndex, bodyEndIndex, name);
            }
        }
        else if (VariableDeclaratorProcessor.isInitializedByFunctionExpression(this.variableDeclarator))
        {
            const functionInfo = VariableDeclaratorProcessor.getFunctionInfoFromFunctionExpression(this.variableDeclarator);
            if (functionInfo === null)
            {
                return null;
            }
            else
            {
                const {bodyStartIndex, bodyEndIndex, name} = functionInfo;
                return new FunctionInfo(this.scriptFile, bodyStartIndex, bodyEndIndex, name);
            }
        }
        else if (VariableDeclaratorProcessor.isInitializedByArrowFunctionExpression(this.variableDeclarator))
        {
            const functionInfo = VariableDeclaratorProcessor.getFunctionInfoFromArrowFunctionExpression(this.variableDeclarator);
            if (functionInfo === null)
            {
                return null;
            }
            else
            {
                const {bodyStartIndex, bodyEndIndex, name} = functionInfo;
                return new FunctionInfo(this.scriptFile, bodyStartIndex, bodyEndIndex, name);
            }
        }
        else
        {
            const rightName = VariableDeclaratorProcessor.getRightNameFromVariableDeclaratorNode(this.variableDeclarator);
            if (rightName === null)
            {
                return null;
            }
            else
            {
                return this.getFunctionInfoByName(rightName);
            }
        }
    }

    private getFunctionInfoByName(functionName: string): FunctionInfo | null
    {
        const length = this.knownFunctionInfoInScriptFile.length;
        // find last function declaration
        for (let i = length - 1; i >= 0; i--)
        {
            const functionInfo = this.knownFunctionInfoInScriptFile[i];
            const {name} = functionInfo;
            if (name !== FunctionInfo.GLOBAL && name.has(functionName))
            {
                return functionInfo;
            }
        }
        return null;    // if can't find it, just ignore it.
    }
}