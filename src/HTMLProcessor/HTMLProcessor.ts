export class HTMLProcessor
{
    private readonly htmlFilePath: string;

    /**
     * @constructor
     * */
    constructor(htmlFilePath: string)
    {
        this.htmlFilePath = htmlFilePath;
    }

    /**
     * @description replace inline <script> to external js and <script src="xxx">
     * */
    public async processHtml(): Promise<void>
    {
        console.log(this.htmlFilePath);
    }
}