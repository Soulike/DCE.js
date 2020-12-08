import {HTMLParser} from '../HTMLParser';
import jsdom from 'jsdom';
import {createTempDirectory} from '../../Function/File';
import fse from 'fs-extra';
import path from 'path';

describe(HTMLParser, () =>
{
    const {JSDOM} = jsdom;
    let newDom: jsdom.JSDOM;
    let tempDirectoryPath = '';
    let htmlFilePath = '';

    const innerScriptContent = `console.log(1)`;
    const outerScriptSrc = `./external.js`;
    const divText = 'Hi there!';
    const html = `
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div>${divText}</div>
        <script>${innerScriptContent}</script>
        <script src="${outerScriptSrc}"></script>
    </body>
</html>`;

    beforeEach(async () =>
    {
        const dom = generateDom(html);
        tempDirectoryPath = await createTempDirectory();
        htmlFilePath = path.join(tempDirectoryPath, 'index.html');
        await fse.outputFile(htmlFilePath, dom.serialize());
        newDom = await getProcessedDom();
    });

    afterEach(async () =>
    {
        await fse.remove(tempDirectoryPath);
    });

    it('should throw error when the file is nonexistent', async function ()
    {
        const htmlProcessor = new HTMLParser(htmlFilePath + 'afafraef');
        await expect(htmlProcessor.processHtml()).rejects.toThrow(Error);
    });

    it('should throw error when path is not absolute', async function ()
    {
        expect(() => new HTMLParser('./index.html')).toThrow(Error);
    });

    it('should clear all content in <script>', async function ()
    {
        const scriptTags = getScriptTags(newDom);
        const innerHTMLs = scriptTags.map(({innerHTML}) => innerHTML);
        expect(innerHTMLs.join('').length).toBe(0);
    });

    it('should not do modification to <script src="xxx">', async function ()
    {
        const scriptTags = getScriptTags(newDom);
        const srcs = scriptTags.map(({src}) => src);
        expect(srcs.includes(outerScriptSrc)).toBe(true);
    });

    it('should replace inline <script> to external js and <script src="xxx">', async function ()
    {
        const scriptTags = getScriptTags(newDom);
        const srcs = scriptTags.map(({src}) => src);

        let extractedSrc = '';
        for (const src of srcs)
        {
            if (src !== outerScriptSrc)
            {
                extractedSrc = src;
                break;
            }
        }
        expect(extractedSrc).not.toBe('');

        const extractedScriptPath = path.join(tempDirectoryPath, extractedSrc);
        const extractedScriptContent = await fse.readFile(extractedScriptPath, 'utf-8');
        expect(extractedScriptContent).toBe(innerScriptContent);
    });

    it('should not modify other content outside <script>', async function ()
    {
        const newDom = await getProcessedDom();
        const divs = Array.from(newDom.window.document.body.getElementsByTagName('div'));
        expect(divs.length).toBe(1);
        expect(divs[0].innerHTML).toBe(divText);
    });

    it('should not modify file when no <script> inside', async function ()
    {
        const htmlWithoutScript = `
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div>${divText}</div>
    </body>
</html>`;

        const dom = generateDom(htmlWithoutScript);
        tempDirectoryPath = await createTempDirectory();
        htmlFilePath = path.join(tempDirectoryPath, 'index.html');
        await fse.outputFile(htmlFilePath, dom.serialize());
        newDom = await getProcessedDom();
        expect(dom.serialize()).toBe(newDom.serialize());

        await fse.remove(tempDirectoryPath);
    });

    function generateDom(html: string): jsdom.JSDOM
    {
        return new JSDOM(html);
    }

    async function getProcessedDom()
    {
        const htmlProcessor = new HTMLParser(htmlFilePath);
        await htmlProcessor.processHtml();
        const newHtmlFileContent = await fse.promises.readFile(htmlFilePath);
        return new JSDOM(newHtmlFileContent);
    }

    function getScriptTags(dom: jsdom.JSDOM)
    {
        return Array.from(dom.window.document.getElementsByTagName('script'));
    }
});