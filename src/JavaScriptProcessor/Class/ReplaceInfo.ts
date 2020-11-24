import {Range} from './Range';

export class ReplaceInfo
{
    public readonly range: Readonly<Range>;
    public readonly code: string;

    /**
     * @param range - the range of replaced code
     * @param code - new code after replace
     * */
    constructor(range: Readonly<Range>, code: string)
    {
        this.range = range;
        this.code = code;
    }
}