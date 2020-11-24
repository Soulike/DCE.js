import * as ESTree from 'estree';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import {NodeProcessor} from '../Interface/NodeProcessor';

export class IdentifierProcessor implements NodeProcessor
{
    private readonly leftIdentifierNames: Set<string>;
    private readonly identifier: Readonly<ESTree.Identifier>;
    private readonly knownFunctionInfos: Readonly<Readonly<FunctionInfo>[]>;

    constructor(leftIdentifierNames: Set<string>, identifier: Readonly<ESTree.Identifier>, knownFunctionInfos: Readonly<Readonly<FunctionInfo>[]>)
    {
        this.leftIdentifierNames = leftIdentifierNames;
        this.identifier = identifier;
        this.knownFunctionInfos = knownFunctionInfos;
    }

    /**
     * @return return null since the function just finds FunctionInfo that has the same function name and add it to name set
     * */
    getPartialFunctionInfo(): null
    {
        const {identifier: {name}, knownFunctionInfos} = this;
        // find last declaration
        for (let i = knownFunctionInfos.length - 1; i >= 0; i--)
        {
            const functionInfo = knownFunctionInfos[i];
            const {name: nameSet} = functionInfo;
            if (nameSet !== FunctionInfo.GLOBAL && nameSet.has(name))
            {
                this.leftIdentifierNames.forEach(name => nameSet.add(name));
                break;
            }
        }
        return null;
    }
}