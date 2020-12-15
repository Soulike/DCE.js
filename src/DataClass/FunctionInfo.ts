import {ScriptFile} from './ScriptFile';
import sha1 from 'crypto-js/sha1';

export class FunctionInfo
{
    public readonly scriptFile: Readonly<ScriptFile> | null;
    public readonly startIndex: number | null;
    public readonly endIndex: number | null;
    public readonly bodyStartIndex: number | null;
    public readonly bodyEndIndex: number | null;

    public static readonly GLOBAL = Object.freeze(new FunctionInfo(null, null, null, null, null));

    constructor(scriptFile: Readonly<ScriptFile> | null, startIndex: number | null, endIndex: number | null, bodyStartIndex: number | null, bodyEndIndex: number | null)
    {
        if (scriptFile === null || startIndex === null || endIndex === null || bodyStartIndex === null || bodyEndIndex === null)
        {
            this.scriptFile = null;
            this.startIndex = null;
            this.endIndex = null;
            this.bodyStartIndex = null;
            this.bodyEndIndex = null;
        }
        else
        {
            this.scriptFile = scriptFile;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.bodyStartIndex = bodyStartIndex;
            this.bodyEndIndex = bodyEndIndex;
        }
    }

    /**
     * @description 获取其他类 FunctionInfo 对象的唯一哈希值
     * */
    public static getHash(functionInfo: Readonly<Pick<FunctionInfo, 'scriptFile' | 'startIndex' | 'endIndex'>>): string
    {
        const {scriptFile, startIndex, endIndex} = functionInfo;
        return sha1(JSON.stringify({scriptFile, startIndex, endIndex})).toString();
    }

    /**
     * @description 获取 global 的唯一哈希值
     * */
    public static getGlobalHash(): string
    {
        return FunctionInfo.GLOBAL.getHash();
    }

    /**
     * @description 获取本对象的唯一哈希值
     * */
    public getHash(): string
    {
        const {scriptFile, startIndex, endIndex} = this;
        return FunctionInfo.getHash({scriptFile, startIndex, endIndex});
    }
}