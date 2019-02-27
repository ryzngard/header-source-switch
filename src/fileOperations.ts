import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import fileExists = require('file-exists');

interface FileMapping {
    header: string[]
    source: string[]
    name: string
}

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
    let extensions : string[] = null;

    let cfg = vscode.workspace.getConfiguration('headerSourceSwitch');
    let mappings = cfg.get<FileMapping[]>('mappings');

    for (let i = 0; i < mappings.length; i++) {
        let mapping = mappings[i];

        if (mapping.header.indexOf(extension) != -1) {
            extensions = mapping.source;
        } 
        else if (mapping.source.indexOf(extension) != -1) {
            extensions = mapping.header;
        }

        if (extensions) {
            console.log("Detected extension using map: " + mapping.name);
            break;
        }
    }
    
    if (!extensions) {
        console.log("No matching extension found");
        return;
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
        return findFileAsync(currentFileName, fileWithoutExtension, extensions);
    }
}

async function findFileAsync(fileWithExtension: string, fileWithoutExtension: string, extensions: string[]) : Promise<string>
{
    let files = await vscode.workspace.findFiles('**/' + fileWithoutExtension + '.*');

    if (files.length == 0)
    {
        throw "No files found";
    }

    let normalizedPaths = files.map((file: vscode.Uri) => {
        return path.normalize(file.fsPath);
    });

    // Try to order the filepaths based on closeness to original file
    let sortedPaths = normalizedPaths.sort((a: string, b: string) => {
        let aRelative = path.relative(fileWithExtension, a);
        let bRelative = path.relative(fileWithExtension, b);

        let aDistance = aRelative.split(path.sep).length;
        let bDistance = bRelative.split(path.sep).length;

        return aDistance - bDistance;
    });

    return sortedPaths[0];
}