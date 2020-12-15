import {ArgumentParser} from './ArgumentParser';
import DCE, {Options} from './index';

const argumentParser = new ArgumentParser(process.argv);
const {'info-only': infoOnly, help, d, _} = argumentParser.getParsedArguments();

if (help)
{
    ArgumentParser.printHelp();
}
else
{
    const options: Required<Options> = {
        infoOnly: false,
        destination: null,
    };

    if (_.length === 0)
    {
        console.error(`no input directory is specified`);
        process.exit(1);
    }
    if (_.length > 1)
    {
        console.warn(`more than one input directories specified. Only the first one will be processed.`);
    }
    if (typeof d === 'string')
    {
        options.destination = d;
    }
    options.infoOnly = infoOnly;
    (async () =>
    {
        try
        {
            await DCE(_[0], options);
        }
        catch (e)
        {
            console.error(e);
        }
    })();
}