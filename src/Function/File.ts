import fse from 'fs-extra';
import path from 'path';
import os from 'os';

export async function createTempDirectory()
{
    return await fse.mkdtemp(path.join(os.tmpdir(), 'dce.js'));
}