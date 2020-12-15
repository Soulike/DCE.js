import {ReplaceInfo} from '../../Replacer';

export interface JavaScriptProcessor
{
    getReplaceInfo(): ReplaceInfo | null;
}