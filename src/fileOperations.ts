import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import fileExists = require('file-exists');

export function findMatchedFileAsync(currentFileName:string) : Thenable<string> {
    let dir = path.dirname(currentFileName);
    let extension = path.extname(currentFileName);

    // If there's no extension, then nothing to do
    if (!extension) 
    {
        return;
    }

    let fileWithoutExtension = path.basename(currentFileName).replace(extension, '');

    // Determine if the file is a header or source file.
    let extensions : string[];

    let headerExtensions: string[] = ['.h', '.hpp', '.hh', '.hxx'];
    let sourceExtensions: string[] = ['.cpp', '.c', '.cc', '.cxx', '.m', '.mm'];

    if (headerExtensions.indexOf(extension) != -1) {
        extensions = sourceExtensions;
    }
    else
    {
        extensions = headerExtensions;
    }

    let extRegex = "(\\" + extensions.join("|\\") + ")$";
    let newFileName = fileWithoutExtension;
    let found : boolean = false;

    // Search the current directory for a matching file
    let filesInDir: string[] = fs.readdirSync(dir).filter((value: string, index: number, array: string[]) =>
    {
        return (path.extname(value).match(extRegex) != undefined);
    });

    for (var i = 0; i < filesInDir.length; i++)
    {
        let fileName: string = filesInDir[i];
        let match = fileName.match(fileWithoutExtension + extRegex);
        if (match)
        {
            found = true;
            newFileName = match[0];
            break;
        }
    }

    if (found)
    {
        let newFile = path.join(dir, newFileName);
        return new Promise<string>((resolve, reject) => {
            resolve(newFile);
        });
    }
    else
    {
        return new Promise<string>((resolve, reject) =>
        {
            let promises = new Array<Promise<vscode.Uri[]>>();
            extensions.forEach(ext => {
                promises.push(new Promise<vscode.Uri[]>(
                    (resolve, reject) =>
                    {
                        vscode.workspace.findFiles('**/'+fileWithoutExtension+ext).then(
                            (uris) =>
                            {
                                resolve(uris);
                            }
                        );
                    }));
            });

            Promise.all(promises).then(
                (values:any[]) => {
                    let resolved = false;

                    if (values.length == 0) {
                        resolve(null);
                        return;
                    }

                    values = values.filter((value: any) => {
                        return value && value.length > 0;
                    });

                    // flatten the values to a single array
                    let filePaths = [].concat.apply([], values);
                    filePaths = filePaths.map((uri: vscode.Uri, index: number) => {
                        return path.normalize(uri.fsPath);
                    });

                    // Try to order the filepaths based on closeness to original file
                    filePaths.sort((a: string, b: string) => {
                        let aRelative = path.relative(currentFileName, a);
                        let bRelative = path.relative(currentFileName, b);

                        let aDistance = aRelative.split(path.sep).length;
                        let bDistance = bRelative.split(path.sep).length;

                        return aDistance - bDistance;
                    });

                    if (filePaths && filePaths.length > 0)
                    {
                        resolve(filePaths[0]);
                    }
                    else 
                    {
                        reject('no paths matching');
                    }
                }
            );
        });
    }
}