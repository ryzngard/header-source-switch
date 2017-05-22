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
                        vscode.workspace.findFiles('**/'+fileWithoutExtension+ext, '', 1).then(
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
                    values.forEach(p => {
                       if (p.length > 0)
                       {
                           resolved = true;
                           resolve(path.normalize(p[0].fsPath));
                       }
                    });

                    if (!resolved)
                    {
                        resolve(null);
                    }
                }
            );
        });
    }
}