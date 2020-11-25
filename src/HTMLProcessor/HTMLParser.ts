import jsdom from 'jsdom';
import cryptoRandomString from 'crypto-random-string';
import path from 'path';
import fse from 'fs-extra';

export class HTMLParser
{
    private readonly htmlFilePath: string;

    /**
     * @constructor
     * @param htmlFilePath - html file to be processed
     * @throws Error
     * */
    constructor(htmlFilePath: string)
    {
        if (!path.isAbsolute(htmlFilePath))
        {
            throw new Error('htmlFilePath should be an absolute path');
        }
        this.htmlFilePath = htmlFilePath;
    }

    private static isJavaScriptScriptTag(tag: HTMLScriptElement): boolean
    {
        const {type} = tag;
        return type === 'text/javascript'
            || type === 'application/javascript'
            || type === ''
            || type === undefined;
    }

    private static async getScriptTags(dom: jsdom.JSDOM)
    {
        return dom.window.document.getElementsByTagName('script');
    }

    /**
     * @description replace inline <script> to external js and <script src="xxx">
     * @throws Error
     * */
    public async processHtml(): Promise<void>
    {
        if (!(await fse.pathExists(this.htmlFilePath)))
        {
            throw new Error('File in htmlFilePath does not exist');
        }
        const dom = await jsdom.JSDOM.fromFile(this.htmlFilePath);
        const scriptTags = await HTMLParser.getScriptTags(dom);
        if (scriptTags.length !== 0)
        {
            for (let i = 0; i < scriptTags.length; i++)
            {
                const tag = scriptTags[i];
                const {src, innerHTML: scriptContent} = tag;
                if ((src === undefined || src.length === 0) && HTMLParser.isJavaScriptScriptTag(tag))
                {
                    const scriptFilePath = await this.createScriptFile(scriptContent);
                    tag.innerHTML = '';
                    tag.src = scriptFilePath;
                }
            }
            await this.writeHtml(dom.serialize());
        }
    }

    /**
     * @return The relative path to html of js file containing fileContent
     * */
    private async createScriptFile(fileContent: string): Promise<string>
    {
        const fileName = this.generateScriptFileName();
        const fileAbsolutePath = path.join(path.resolve(this.htmlFilePath, '..'), fileName);
        await fse.outputFile(fileAbsolutePath, fileContent);
        return `./${fileName}`;
    }

    private generateScriptFileName(): string
    {
        const fileName = path.basename(this.htmlFilePath);
        return `${fileName}-${cryptoRandomString({length: 10, type: 'alphanumeric'})}.js`;
    }

    private async writeHtml(fileContent: string): Promise<void>
    {
        await fse.writeFile(this.htmlFilePath, fileContent);
    }
}