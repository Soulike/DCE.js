import puppeteer, {Browser, Page} from 'puppeteer';
import {isSimpleFunctionCall, SimpleFunctionCall} from '../Interface';

export class PuppeteerWrapper
{
    private readonly htmlFilePath: string;
    private page: Page | null;
    private browser: Browser | null;

    constructor(htmlFilePath: string)
    {
        this.htmlFilePath = htmlFilePath;
        this.page = null;
        this.browser = null;
    }

    private static isSimpleFunctionCallArray(obj: any): obj is SimpleFunctionCall[]
    {
        if (!Array.isArray(obj))
        {
            return false;
        }
        const array = obj;
        if (array.length === 0)
        {
            return true;
        }
        // for efficiency, only check the first and the last
        const first = array[0];
        const last = array[array.length - 1];
        return isSimpleFunctionCall(first) && isSimpleFunctionCall(last);
    }

    public async getSimpleFunctionCalls(): Promise<SimpleFunctionCall[]>
    {
        try
        {
            if (this.page === null || this.browser === null)
            {
                await this.openPage();
            }
            return await this.getConsoleSimpleFunctionCalls();
        }
        finally
        {
            await this.closeBrowser();
        }
    }

    private async openPage(): Promise<void>
    {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`file://${this.htmlFilePath}`);
        this.browser = browser;
        this.page = page;
    }

    private async getConsoleSimpleFunctionCalls(): Promise<SimpleFunctionCall[]>
    {
        if (this.page === null)
        {
            await this.openPage();
        }
        const page = this.page as Page;
        const consoleOutputPromise = new Promise<SimpleFunctionCall[]>((resolve, reject) =>
        {
            setTimeout(() =>
            {
                reject(new Error('dynamic analysis timed out'));
            }, 10 * 1000);  // wait 10s at most

            page.on('console', message =>
            {
                if (message.type() === 'log')
                {
                    const content = message.text();
                    try
                    {
                        const parsedContent = JSON.parse(content);
                        if (PuppeteerWrapper.isSimpleFunctionCallArray(parsedContent))
                        {
                            resolve(parsedContent);
                        }
                    }
                    catch (e)
                    {
                        // ignore if it's not a json
                    }
                }
            });
        });
        const result = await consoleOutputPromise;
        if (result === null)
        {
            throw new Error('dynamic analysis timed out');
        }
        return result;
    }

    private async closeBrowser(): Promise<void>
    {
        if (this.browser !== null)
        {
            await this.browser.close();
        }
    }
}