import {JavaScriptProcessor} from '../Interface/JavaScriptProcessor';
import * as ESTree from 'estree';
import {ReplaceInfo} from '../Class/ReplaceInfo';
import {throwRangeIsUndefinedException} from '../../Function/Throw';
import * as esprima from 'esprima';
import {Range} from '../Class/Range';

export class EvalProcessor implements JavaScriptProcessor
{
    private readonly node: Readonly<ESTree.CallExpression>;

    constructor(node: ESTree.CallExpression)
    {
        this.node = node;
    }

    public getReplaceInfo(): ReplaceInfo | null
    {
        const {callee, range, arguments: args} = this.node;
        const arg = args[0];    // eval() will ignore parameters following the first one
        if (range === undefined)
        {
            throwRangeIsUndefinedException();
        }
        if (callee.type !== esprima.Syntax.Identifier || callee.name !== 'eval')
        {
            return null;
        }
        else if (arg.type !== esprima.Syntax.Literal || typeof arg.value !== 'string')
        {
            return null;
        }
        else
        {
            return new ReplaceInfo(new Range(range[0], range[1]), arg.value);
        }
    }
}