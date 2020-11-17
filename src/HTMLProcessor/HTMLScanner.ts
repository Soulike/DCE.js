import {FileScanner} from '../FileScanner';

export class HTMLScanner extends FileScanner
{
    constructor(directoryPath: string)
    {
        super(directoryPath, 'html');
    }
}