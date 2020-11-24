import {JavaScriptProcessor} from '../Interface/JavaScriptProcessor';
import * as ESTree from 'estree';
import {ReplaceInfo} from '../Class/ReplaceInfo';
import * as esprima from 'esprima';
import {throwRangeIsUndefinedException} from '../../Function/Throw';
import {Range} from '../Class/Range';

export class FunctionConstructionProcessor implements JavaScriptProcessor
{
    private readonly node: Readonly<ESTree.CallExpression> | Readonly<ESTree.NewExpression>;

    constructor(node: ESTree.CallExpression | ESTree.NewExpression)
    {
        this.node = node;
    }

    /**
     * @return a,b,c where a,b and c are parameter list of a function
     * */
    private static getArgumentStringFromArgumentNodes(argumentNodes: Readonly<Readonly<ESTree.Literal>[]>): string
    {
        const argumentNames: string[] = [];
        argumentNodes.forEach(({value}) =>
        {
            if (typeof value !== 'string')
            {
                throw new TypeError('parameters of Function() should be string literals');
            }
            argumentNames.push(...(value.split(',').filter(name => name.length > 0)));
        });
        return argumentNames.join(',');
    }

    public getReplaceInfo(): ReplaceInfo | null
    {
        const {callee, range} = this.node;
        if (range === undefined)
        {
            throwRangeIsUndefinedException();
        }
        if (callee.type !== esprima.Syntax.Identifier || callee.name !== 'Function')
        {
            return null;
        }
        else
        {
            const {arguments: args} = this.node;
            const argLiterals: ESTree.Literal[] = [];
            for (const arg of args)
            {
                if (arg.type !== esprima.Syntax.Literal || typeof arg.value !== 'string')
                {
                    return null;
                }
                argLiterals.push(arg);
            }
            const argsWithoutBody = argLiterals.slice(0, -1);
            const parameterList = FunctionConstructionProcessor.getArgumentStringFromArgumentNodes(argsWithoutBody);
            const body = argLiterals[argLiterals.length - 1].value; // must be string
            const code = `function(${parameterList}){${body}}`;
            return new ReplaceInfo(new Range(range[0], range[1]), code);
        }
    }
}