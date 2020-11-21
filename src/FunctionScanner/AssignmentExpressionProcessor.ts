import {NodeProcessor} from './Interface/NodeProcessor';
import * as ESTree from 'estree';
import {FunctionInfo} from '../DataClass/FunctionInfo';
import * as esprima from 'esprima';
import {FunctionExpressionProcessor} from './RightProcessor/FunctionExpressionProcessor';
import {ArrowFunctionExpressionProcessor} from './RightProcessor/ArrowFunctionExpressionProcessor';
import {NewExpressionProcessor} from './RightProcessor/NewExpressionProcessor';
import {IdentifierProcessor} from './RightProcessor/IdentifierProcessor';
import {MemberExpressionProcessor} from './RightProcessor/MemberExpressionProcessor';
import {getNamesFromChainedMemberExpression} from './Function';

export class AssignmentExpressionProcessor implements NodeProcessor
{
    private readonly assignmentExpression: Readonly<ESTree.AssignmentExpression>;
    private readonly knownFunctionInfos: Readonly<Readonly<FunctionInfo>[]>;

    constructor(assignmentExpression: Readonly<ESTree.AssignmentExpression>, knownFunctionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.assignmentExpression = assignmentExpression;
        this.knownFunctionInfos = knownFunctionInfos;
    }

    /**
     * @return A new FunctionInfo that should be logged, or null if no new FunctionInfo.
     * */
    public getPartialFunctionInfo(): Pick<FunctionInfo, 'bodyStartIndex' | 'bodyEndIndex' | 'name'> | null
    {
        const {assignmentExpression} = this;
        const names = this.getLeftNames();
        if (names === null)
        {
            return null;
        }

        switch (assignmentExpression.right.type)
        {
            case esprima.Syntax.FunctionExpression:
            {
                const functionExpressionProcessor = new FunctionExpressionProcessor(assignmentExpression.right);
                const {bodyStartIndex, bodyEndIndex} = functionExpressionProcessor.getPartialFunctionInfo();
                return {name: names, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.ArrowFunctionExpression:
            {
                const arrowFunctionExpressionProcessor = new ArrowFunctionExpressionProcessor(assignmentExpression.right);
                const {bodyStartIndex, bodyEndIndex} = arrowFunctionExpressionProcessor.getPartialFunctionInfo();
                return {name: names, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.NewExpression:
            {
                const newExpressionProcessor = new NewExpressionProcessor(assignmentExpression.right);
                const partialFunctionInfo = newExpressionProcessor.getPartialFunctionInfo();
                if (partialFunctionInfo === null)
                {
                    return null;
                }
                const {bodyStartIndex, bodyEndIndex} = partialFunctionInfo;
                return {name: names, bodyStartIndex, bodyEndIndex};
            }
            case esprima.Syntax.Identifier:
            {
                const identifierProcessor = new IdentifierProcessor(new Set(names), assignmentExpression.right, this.knownFunctionInfos);
                identifierProcessor.getPartialFunctionInfo();
                return null;
            }
            case esprima.Syntax.MemberExpression:
            {
                const memberExpressionProcessor = new MemberExpressionProcessor(new Set(names), assignmentExpression.right, this.knownFunctionInfos);
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
            return new Set(assignmentExpression.left.name);
        }
        else if (assignmentExpression.left.type === esprima.Syntax.MemberExpression) // object access
        {
            return new Set(getNamesFromChainedMemberExpression(assignmentExpression.left));
        }
        else
        {
            return null;
        }
    }
}