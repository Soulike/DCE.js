import {HTMLScanner} from './HTMLScanner';
import {HTMLParser} from './HTMLParser';

/**
 * @class
 * @description Split inline js code from all html files in a certain directory
 * */
export class HTMLProcessor
{
    private readonly htmlScanner: HTMLScanner;

    constructor(directoryPath: string)
    {
        this.htmlScanner = new HTMLScanner(directoryPath);
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