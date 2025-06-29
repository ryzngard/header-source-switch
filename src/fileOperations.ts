import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

type Dictionary = {
    [key: string]: string;
};
const fuzzyMatches: Dictionary = {};

export interface FileMapping {
    header: string[]
    source: string[]
    name: string
}

export async function findMatchedFileAsync(currentFileName: string, mappings: FileMapping[], fuzzyMatch: boolean): Promise<string | null> {
    let dir = path.dirname(currentFileName);
    let extension = path.extname(currentFileName);

    // If there's no extension, then nothing to do
    if (!extension) {
        return;
    }

    let fileWithoutExtension = getFileWithoutExtension(currentFileName, extension);

    // Determine if the file is a header or source file.
    let extensions: string[] = null;

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

    // Search the current directory for a matching file
    let allFiles = await fs.promises.readdir(dir);
    let matches = allFiles.filter((value: string, index: number, array: string[]) => {
        return (path.extname(value).match(extRegex) != undefined);
    });

    for (var i = 0; i < matches.length; i++) {
        let fileName: string = matches[i];
        let match = fileName.match(fileWithoutExtension + extRegex);
        if (match) {
            return path.join(dir, match[0]);
        }
    }

    let foundFile = await findInWorkspaceAsync(currentFileName, fileWithoutExtension, extensions);
    if (foundFile) {
        return foundFile;
    }

    if (fuzzyMatch) {
        const fuzzyMatch = await findFuzzyMatchAsync(allFiles, fileWithoutExtension, extensions);
        if (fuzzyMatch) {
            return path.join(dir, fuzzyMatch);
        }
    }

    return null;
}

async function findInWorkspaceAsync(currentFileName: string, fileWithoutExtension: string, extensions: string[]): Promise<string> {
    let promises = new Array<Promise<vscode.Uri[]>>();
    extensions.forEach(ext => {
        promises.push(new Promise<vscode.Uri[]>(
            (resolve, reject) => {
                vscode.workspace.findFiles('**/' + fileWithoutExtension + ext).then(
                    (uris) => {
                        resolve(uris);
                    }
                );
            }));
    });

    let values = await Promise.all(promises);

    if (values.length == 0) {
        return null;
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

    if (filePaths.length > 0) {
        return filePaths[0];
    }

    return null;
}

async function findFuzzyMatchAsync(allFiles: string[], currentFileWithoutExtension: string, extensions: string[]): Promise<string | null> {
    
    const possibleMatches = allFiles.filter(f=> extensions.indexOf(path.extname(f)) !== -1);
    
    // There's only one other file in the directory and it has a mapped extension
    if (possibleMatches.length == 1) {
        return possibleMatches[0];
    }
    
    const previousMatch = fuzzyMatches[currentFileWithoutExtension];
    if (previousMatch && possibleMatches.indexOf(previousMatch) != -1) {
        return previousMatch;
    }

    // Remove old data
    fuzzyMatches[currentFileWithoutExtension] = null;
    if (previousMatch) {
        fuzzyMatches[previousMatch] = null;
    }

    const fuzzyMatched = possibleMatches.find((fileName: string) => {
        const ext = path.extname(fileName);
        const fileNameWithoutExt = getFileWithoutExtension(fileName, ext);
        return fileNameWithoutExt.toLocaleLowerCase().includes(currentFileWithoutExtension);
    });

    if (fuzzyMatched) {
        fuzzyMatches[currentFileWithoutExtension] = fuzzyMatched;
        fuzzyMatches[fuzzyMatched] = currentFileWithoutExtension;
    }

    return fuzzyMatched ?? null;
}

function getFileWithoutExtension(fileName: string, ext: string = null): string {
    ext ??= path.extname(fileName);

    if (!ext) {
        return fileName;
    }

    let fileWithoutExtension = path.basename(fileName);

    return fileWithoutExtension
        .substring(0, fileWithoutExtension.length - ext.length);
}
