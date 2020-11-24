import {NodeProcessor} from '../Interface/NodeProcessor';
import * as ESTree from 'estree';
import * as esprima from 'esprima';
import {FunctionExpressionProcessor} from './FunctionExpressionProcessor';
import {FunctionInfo} from '../../../DataClass/FunctionInfo';
import {ArrowFunctionExpressionProcessor} from './ArrowFunctionExpressionProcessor';

export class ObjectExpressionProcessor implements NodeProcessor
{
    private readonly objectExpression: Readonly<ESTree.ObjectExpression>;

    constructor(objectExpression: Readonly<ESTree.ObjectExpression>)
    {
        this.objectExpression = objectExpression;
    }

    getPartialFunctionInfo(): Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[]
    {
        const {objectExpression: {properties}} = this;
        const partialFunctionInfos: Pick<FunctionInfo, 'startIndex' | 'endIndex' | 'bodyStartIndex' | 'bodyEndIndex' | 'name'>[] = [];
        properties.forEach(prop =>
        {
            if (prop.type === esprima.Syntax.Property)
            {
                const {value, key} = prop;
                const name = new Set<string>();
                if (key.type === esprima.Syntax.Identifier)  // if the key name is got from calculation, ignore
                {
                    name.add(key.name);
                }

                if (value.type === esprima.Syntax.FunctionExpression)
                {
                    const processor = new FunctionExpressionProcessor(value);
                    partialFunctionInfos.push({name, ...processor.getPartialFunctionInfo()});
                }
                else if (value.type === esprima.Syntax.ArrowFunctionExpression)
                {
                    const processor = new ArrowFunctionExpressionProcessor(value);
                    partialFunctionInfos.push({name, ...processor.getPartialFunctionInfo()});
                }
            }
        });
        return partialFunctionInfos;
    }
}