import * as ESTree from 'estree';
import * as esprima from 'esprima';

export function throwRangeIsUndefinedException(): never
{
    throw new Error('the key "range" should not be undefined. check esprima config');
}

/**
 * @description e.g. obj.a['b'].c => [c, b.c, a.b.c, obj.a.b.c], ignore other attribute values like Symbol and returns null
 * */
export function getNamesFromChainedMemberExpression(expression: ESTree.MemberExpression): string[] | null
{
    const nameChain = getNamesFromChainedMemberExpressionHelper(expression);
    if (nameChain === null)
    {
        return null;
    }
    const nameChainSplit = nameChain.split('.');
    const names: string[] = [];
    for (let i = nameChainSplit.length - 1; i >= 0; i--)
    {
        const id = nameChainSplit[i];
        if (names.length === 0)
        {
            names.push(id);
        }
        else
        {
            const lastName = names[names.length - 1];
            names.push(`${id}.${lastName}`);
        }
    }
    return names;
}

/**
 * @description e.g. obj.a['b'].c[0].d => obj.a.b.c.0.d
 * */
function getNamesFromChainedMemberExpressionHelper(expression: ESTree.MemberExpression | ESTree.Identifier | ESTree.Literal): string | null
{
    if (expression.type === esprima.Syntax.MemberExpression)
    {
        if (expression.property.type === esprima.Syntax.Identifier || expression.property.type === esprima.Syntax.Literal)
        {
            let name: string;
            if (expression.property.type === esprima.Syntax.Identifier)
            {
                name = expression.property.name;
            }
            else
            {
                name = String(expression.property.value);
            }
            if (expression.object.type === esprima.Syntax.MemberExpression
                || expression.object.type === esprima.Syntax.Identifier
                || expression.object.type === esprima.Syntax.Literal)
            {
                const objectChainName = getNamesFromChainedMemberExpressionHelper(expression.object);
                if (objectChainName === null)
                {
                    return null;
                }
                return `${objectChainName}.${name}`;
            }
            else
            {
                return null;
            }
        }
        else    // ignore other types
        {
            return null;
        }
    }
    else if (expression.type === esprima.Syntax.Identifier)
    {
        const {name} = expression;
        return name;
    }
    else
    {
        return null;
    }
}