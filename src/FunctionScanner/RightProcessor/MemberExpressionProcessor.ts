import {NodeProcessor} from '../Interface/NodeProcessor';
import * as ESTree from 'estree';
import {FunctionInfo} from '../../DataClass/FunctionInfo';
import {getNamesFromChainedMemberExpression} from '../Function';
import {IdentifierProcessor} from './IdentifierProcessor';
import * as esprima from 'esprima';

export class MemberExpressionProcessor implements NodeProcessor
{
    private readonly leftIdentifierNames: Set<string>;
    private readonly memberExpression: Readonly<ESTree.MemberExpression>;
    private readonly knownFunctionInfos: Readonly<Readonly<FunctionInfo>[]>;

    constructor(leftIdentifierNames: Set<string>, memberExpression: Readonly<ESTree.MemberExpression>, knownFunctionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.leftIdentifierNames = leftIdentifierNames;
        this.memberExpression = memberExpression;
        this.knownFunctionInfos = knownFunctionInfos;
    }

    /**
     * @return return null since the function just finds FunctionInfo that has the same function name and add it to name set
     * */
    getPartialFunctionInfo(): null
    {
        const chainName = getNamesFromChainedMemberExpression(this.memberExpression);
        if (chainName === null)
        {
            return null;
        }
        else
        {
            // just think that each chain name is a identifier
            chainName.forEach(name =>
            {
                const identifierProcessor = new IdentifierProcessor(this.leftIdentifierNames,
                    {type: esprima.Syntax.Identifier, name},
                    this.knownFunctionInfos);
                identifierProcessor.getPartialFunctionInfo();
            });
            return null;
        }
    }
}