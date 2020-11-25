import {Range} from './Range';

export interface CallNode
{
    label: string;
    file: string;
    start: Position;
    end: Position;
    range: Range;
}