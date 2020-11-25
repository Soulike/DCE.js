import {FunctionCall} from '../DataClass/FunctionCall';

export interface CallGraphBuilder
{
    getCallGraph(): FunctionCall[] | Promise<FunctionCall[]>
}