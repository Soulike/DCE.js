import minimist from 'minimist';
import {Arguments} from './Interface/Arguments';

export class ArgumentParser
{
    private readonly parsedArguments: Readonly<Arguments>;

    constructor(args: typeof process.argv)
    {
        this.parsedArguments = minimist<Arguments>(args.slice(2), {
            string: ['d'],
            boolean: ['info-only', 'help'],
            default: <Arguments>{
                'info-only': false,
                d: null,
                help: false,
            },
        });
    }

    public static printHelp(): void
    {
        const help = `usage: node dist/index.js [options...] <directory>
--info-only\tprint information of dead functions instead of actually modifying files
-d <directory>\toutput processed files into <directory>. If not set, the files will be modified in place
--help\tprint usage information`;
        console.log(help);
    }

    public getParsedArguments(): Arguments
    {
        return this.parsedArguments;
    }
}