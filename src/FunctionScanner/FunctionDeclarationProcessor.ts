import {ASTNodeProcessor} from './Interface/ASTNodeProcessor';
import * as ESTree from 'estree';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import {ScriptFile} from '../DataClass/ScriptFile';

export class FunctionDeclarationProcessor implements ASTNodeProcessor
{
    private readonly functionDeclaration: ESTree.FunctionDeclaration;
    private readonly scriptFile: ScriptFile;

    constructor(functionDeclaration: ESTree.FunctionDeclaration, scriptFile: ScriptFile)
    {
        this.functionDeclaration = functionDeclaration;
        this.scriptFile = scriptFile;
    }

    private static getFunctionNameFromASTNode(functionDeclaration: ESTree.FunctionDeclaration): string | null
    {
        const {id} = functionDeclaration;
        if (id === null)
        {
            return null;
        }
        else
        {
            const {name} = id;
            return name;
        }
    }

    private static getFunctionBodyRangeFromASTNode(functionDeclaration: ESTree.FunctionDeclaration): [number, number]
    {
        const {body: {range}} = functionDeclaration;
        if (range === undefined)
        {
            throw new Error('"range" in FunctionDeclaration should not be undefined. Check esprima config and set "range" to true');
        }
        return range;
    }

    public getFunctionInfo(): FunctionInfo
    {
        const scriptFile = this.scriptFile;
        const currentName = FunctionDeclarationProcessor.getFunctionNameFromASTNode(this.functionDeclaration);
        // actually for now js in browsers won't have function declarations without names
        const name = currentName === null ? new Set<string>() : new Set([currentName]);
        const [bodyStartIndex, bodyEndIndex] =
            FunctionDeclarationProcessor.getFunctionBodyRangeFromASTNode(this.functionDeclaration);
        return new FunctionInfo(scriptFile, bodyStartIndex, bodyEndIndex, name);
    }
}