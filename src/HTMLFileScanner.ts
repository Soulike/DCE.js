import {FileScanner} from './FileScanner';

export class HTMLFileScanner extends FileScanner
{
    constructor(directoryPath: string)
    {
        super(directoryPath, 'html');
    }
}