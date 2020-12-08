import {HTMLFileScanner} from '../HTMLFileScanner';
import {HTMLParser} from './HTMLParser';

/**
 * @class
 * @description Split inline js code from all html files in a certain directory
 * */
export class HTMLProcessor
{
    private readonly htmlScanner: HTMLFileScanner;

    constructor(directoryPath: string)
    {
        this.htmlScanner = new HTMLFileScanner(directoryPath);
    }

    public async doProcess(): Promise<void>
    {
        const htmlFilePaths = await this.htmlScanner.getFilePaths();
        let htmlParser: HTMLParser | null = null;
        await Promise.all(htmlFilePaths.map(async htmlFilePath =>
        {
            htmlParser = new HTMLParser(htmlFilePath);
            await htmlParser.processHtml();
        }));
    }
}