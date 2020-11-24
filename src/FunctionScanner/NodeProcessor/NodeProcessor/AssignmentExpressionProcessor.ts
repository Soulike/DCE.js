import {NodeProcessor} from '../Interface/NodeProcessor';
import * as ESTree from 'estree';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import * as esprima from 'esprima';
import {FunctionExpressionProcessor} from '../RightProcessor/FunctionExpressionProcessor';
import {ArrowFunctionExpressionProcessor} from '../RightProcessor/ArrowFunctionExpressionProcessor';
import {NewExpressionProcessor} from '../RightProcessor/NewExpressionProcessor';
import {IdentifierProcessor} from '../RightProcessor/IdentifierProcessor';
import {MemberExpressionProcessor} from '../RightProcessor/MemberExpressionProcessor';
import {getNamesFromChainedMemberExpression} from '../../Function';
import {ObjectExpressionProcessor} from '../RightProcessor/ObjectExpressionProcessor';

export class AssignmentExpressionProcessor implements NodeProcessor
{
    private readonly assignmentExpression: Readonly<ESTree.AssignmentExpression>;
    private readonly knownFunctionInfos: Readonly<Readonly<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>>[]>;

    constructor(assignmentExpression: Readonly<ESTree.AssignmentExpression>, knownFunctionInfos: Readonly<Readonly<Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>>[]>)
    {
        this.assignmentExpression = assignmentExpression;
        this.knownFunctionInfos = knownFunctionInfos;
    }

    /**
     * @return A new FunctionInfo that should be logged, or null if no new FunctionInfo.
     * */
    public getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] | null
    {
        const {assignmentExpression} = this;
        const leftNames = this.getLeftNames();
        if (leftNames === null)
        {
            return null;
        }

        switch (assignmentExpression.right.type)
        {
            case esprima.Syntax.FunctionExpression:
            {
                const functionExpressionProcessor = new FunctionExpressionProcessor(assignmentExpression.right);
                const {startIndex, endIndex, bodyStartIndex, bodyEndIndex} = functionExpressionProcessor.getPartialFunctionInfo();
                return {name: leftNames, startIndex, endIndex, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.ArrowFunctionExpression:
            {
                const arrowFunctionExpressionProcessor = new ArrowFunctionExpressionProcessor(assignmentExpression.right);
                const {startIndex, endIndex, bodyStartIndex, bodyEndIndex} = arrowFunctionExpressionProcessor.getPartialFunctionInfo();
                return {name: leftNames, startIndex, endIndex, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.NewExpression:
            {
                const newExpressionProcessor = new NewExpressionProcessor(assignmentExpression.right);
                const partialFunctionInfo = newExpressionProcessor.getPartialFunctionInfo();
                if (partialFunctionInfo === null)
                {
                    return null;
                }
                const {startIndex, endIndex, bodyStartIndex, bodyEndIndex} = partialFunctionInfo;
                return {name: leftNames, startIndex, endIndex, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.ObjectExpression:
            {
                const processor = new ObjectExpressionProcessor(assignmentExpression.right);
                const partialFunctionInfos = processor.getPartialFunctionInfo();
                partialFunctionInfos.forEach(partialFunctionInfo =>
                {
                    const {name: nameSet} = partialFunctionInfo;
                    if (nameSet !== FunctionInfo.GLOBAL)
                    {
                        const names = [...nameSet];
                        names.forEach(name =>
                        {
                            leftNames.forEach(leftName =>
                            {
                                nameSet.add(`${leftName}.${name}`);
                            });
                        });
                    }
                });
                return partialFunctionInfos;
            }
            case esprima.Syntax.Identifier:
            {
                const identifierProcessor = new IdentifierProcessor(new Set(leftNames), assignmentExpression.right, this.knownFunctionInfos);
                identifierProcessor.getPartialFunctionInfo();
                return null;
            }
            case esprima.Syntax.MemberExpression:
            {
                const memberExpressionProcessor = new MemberExpressionProcessor(new Set(leftNames), assignmentExpression.right, this.knownFunctionInfos);
                memberExpressionProcessor.getPartialFunctionInfo();
                return null;
            }
            default:
            {
                return null;
            }
        }

    }

    private getLeftNames(): Set<string> | null
    {
        const {assignmentExpression} = this;
        if (assignmentExpression.left.type === esprima.Syntax.Identifier)   // variable
        {
            return new Set([assignmentExpression.left.name]);
        }
        else if (assignmentExpression.left.type === esprima.Syntax.MemberExpression) // object access
        {
            const chainName = getNamesFromChainedMemberExpression(assignmentExpression.left);
            if (chainName === null)
            {
                return null;
            }
            else
            {
                return new Set(chainName);
            }
        }
        else
        {
            return null;
        }
    }
}