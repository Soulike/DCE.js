import {NodeProcessor} from './Interface/NodeProcessor';
import * as ESTree from 'estree';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import * as esprima from 'esprima';
import {FunctionExpressionProcessor} from './RightProcessor/FunctionExpressionProcessor';
import {ArrowFunctionExpressionProcessor} from './RightProcessor/ArrowFunctionExpressionProcessor';
import {NewExpressionProcessor} from './RightProcessor/NewExpressionProcessor';
import {IdentifierProcessor} from './RightProcessor/IdentifierProcessor';
import {MemberExpressionProcessor} from './RightProcessor/MemberExpressionProcessor';
import {ObjectExpressionProcessor} from './RightProcessor/ObjectExpressionProcessor';

export class VariableDeclaratorProcessor implements NodeProcessor
{
    private readonly variableDeclarator: Readonly<ESTree.VariableDeclarator>;
    private readonly knownFunctionInfos: Readonly<Readonly<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>>[]>;

    constructor(variableDeclarator: Readonly<ESTree.VariableDeclarator>, knownFunctionInfos: Readonly<Readonly<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>>[]>)
    {
        this.variableDeclarator = variableDeclarator;
        this.knownFunctionInfos = knownFunctionInfos;
    }

    /**
     * @return A new FunctionInfo that should be logged, or null if no new FunctionInfo.
     * */
    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] | null
    {
        const {variableDeclarator} = this;
        if (variableDeclarator.init === undefined || variableDeclarator.init === null)
        {
            return null;
        }
        const variableName = this.getVariableName();
        if (variableName === null)
        {
            return null;
        }

        switch (variableDeclarator.init.type)
        {
            case esprima.Syntax.FunctionExpression:
            {
                const functionExpressionProcessor = new FunctionExpressionProcessor(variableDeclarator.init);
                const {startIndex, endIndex, bodyStartIndex, bodyEndIndex} = functionExpressionProcessor.getPartialFunctionInfo();
                return {name: new Set([variableName]), startIndex, endIndex, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.ArrowFunctionExpression:
            {
                const arrowFunctionExpressionProcessor = new ArrowFunctionExpressionProcessor(variableDeclarator.init);
                const {startIndex, endIndex, bodyStartIndex, bodyEndIndex} = arrowFunctionExpressionProcessor.getPartialFunctionInfo();
                return {name: new Set([variableName]), startIndex, endIndex, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.NewExpression:
            {
                const newExpressionProcessor = new NewExpressionProcessor(variableDeclarator.init);
                const partialFunctionInfo = newExpressionProcessor.getPartialFunctionInfo();
                if (partialFunctionInfo === null)
                {
                    return null;
                }
                const {startIndex, endIndex, bodyStartIndex, bodyEndIndex} = partialFunctionInfo;
                return {name: new Set([variableName]), startIndex, endIndex, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.ObjectExpression:
            {
                const processor = new ObjectExpressionProcessor(variableDeclarator.init);
                const partialFunctionInfos = processor.getPartialFunctionInfo();
                partialFunctionInfos.forEach(partialFunctionInfo =>
                {
                    const {name: nameSet} = partialFunctionInfo;
                    if (nameSet !== FunctionInfo.GLOBAL)
                    {
                        const names = [...nameSet];
                        names.forEach(name =>
                        {
                            nameSet.add(`${variableName}.${name}`);
                        });
                    }
                });
                return partialFunctionInfos;
            }
            case esprima.Syntax.Identifier:
            {
                const identifierProcessor = new IdentifierProcessor(new Set([variableName]), variableDeclarator.init, this.knownFunctionInfos);
                identifierProcessor.getPartialFunctionInfo();
                return null;
            }
            case esprima.Syntax.MemberExpression:
            {
                const memberExpressionProcessor = new MemberExpressionProcessor(new Set([variableName]), variableDeclarator.init, this.knownFunctionInfos);
                memberExpressionProcessor.getPartialFunctionInfo();
                return null;
            }
            default:
            {
                return null;
            }
        }

    }

    private getVariableName(): string | null
    {
        const {variableDeclarator} = this;
        if (variableDeclarator.id.type !== esprima.Syntax.Identifier)
        {
            return null;
        }
        else
        {
            return variableDeclarator.id.name;
        }
    }
}