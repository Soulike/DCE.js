import {ScriptFile} from '../DataClass/ScriptFile';
import {ReplaceInfo} from './Class/ReplaceInfo';
import {EsprimaForFile} from '../EsprimaWrapper';
import {ASTNodeFilter} from './ASTNodeFilter';
import * as esprima from 'esprima';
import {FunctionConstructionProcessor} from './Processor/FunctionConstructionProcessor';
import {EvalProcessor} from './Processor/EvalProcessor';
import {FileReplacer} from './Replacer/FileReplacer';

export class JavaScriptProcessor
{
    private readonly scriptFile: Readonly<ScriptFile>;
    private readonly encoding: BufferEncoding;

    constructor(scriptFile: Readonly<ScriptFile>, encoding: BufferEncoding = 'utf-8')
    {
        this.scriptFile = scriptFile;
        this.encoding = encoding;
    }

    public async doProcess(): Promise<void>
    {
        let replaceInfos = await this.getReplaceInfos();
        while (replaceInfos.length !== 0)   // do process until no replacement is needed
        {
            const fileReplacer = new FileReplacer(this.scriptFile, replaceInfos, this.encoding);
            await fileReplacer.doProcess();
            replaceInfos = await this.getReplaceInfos();
        }
    }

    private async getReplaceInfos(): Promise<ReplaceInfo[]>
    {
        const esprimaForFile = new EsprimaForFile(this.scriptFile, new ASTNodeFilter(), this.encoding);
        const nodes = await esprimaForFile.getNodes();
        const replaceInfos: ReplaceInfo[] = [];
        nodes.forEach(node =>
        {
            switch (node.type)
            {
                case esprima.Syntax.CallExpression:
                {
                    const functionConstructionProcessor = new FunctionConstructionProcessor(node);
                    const evalProcessor = new EvalProcessor(node);
                    const functionConstructionProcessorReplaceInfo = functionConstructionProcessor.getReplaceInfo();
                    const evalProcessorReplaceInfo = evalProcessor.getReplaceInfo();
                    if (functionConstructionProcessorReplaceInfo !== null)
                    {
                        replaceInfos.push(functionConstructionProcessorReplaceInfo);
                    }
                    if (evalProcessorReplaceInfo !== null)
                    {
                        replaceInfos.push(evalProcessorReplaceInfo);
                    }
                    break;
                }
                case esprima.Syntax.NewExpression:
                {
                    const functionConstructionProcessor = new FunctionConstructionProcessor(node);
                    const functionConstructionProcessorReplaceInfo = functionConstructionProcessor.getReplaceInfo();
                    if (functionConstructionProcessorReplaceInfo !== null)
                    {
                        replaceInfos.push(functionConstructionProcessorReplaceInfo);
                    }
                    break;
                }
            }
        });
        return replaceInfos;
    }
}