import {FileScanner} from '../FileScanner';

export class JSScanner extends FileScanner
{
    constructor(directoryPath: string)
    {
        super(directoryPath, 'js');
    }
}