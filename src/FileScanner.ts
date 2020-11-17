import klaw from 'klaw';
import path from 'path';

export class FileScanner
{
    private readonly directoryPath: string;
    private readonly fileExtension: string;

    /**
     * @constructor
     * @param directoryPath 被扫描文件的的目录
     * @param fileExtension 要扫描文件的后缀名，不包含点。例如 js、html、json
     * */
    constructor(directoryPath: string, fileExtension: string)
    {
        this.directoryPath = directoryPath;
        this.fileExtension = fileExtension;
    }

    private static hasExtension(filePath: string, extension: string): boolean
    {
        return path.extname(filePath).slice(1) === extension;
    }

    /**
     * @return 所有被扫描文件的绝对路径
     * @throws Promise<Error>
     * */
    public async getFilePaths(): Promise<string[]>
    {
        const filePaths: string[] = [];
        const klawStream = klaw(this.directoryPath, {
            depthLimit: -1, // unlimited
        });
        return new Promise<string[]>((resolve, reject) =>
        {
            klawStream.on('data', ({stats, path: walkPath}) =>
            {
                if (stats.isFile() && FileScanner.hasExtension(walkPath, this.fileExtension))
                {
                    filePaths.push(walkPath);
                }
            });

            klawStream.on('end', () => resolve(filePaths));
            klawStream.on('error', err => reject(err));
        });
    }
}