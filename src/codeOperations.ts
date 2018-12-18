import * as vscode from 'vscode';

export function openFileInPane(fileName:string, pane:FilePane)
{
    console.log("Opening " + fileName + " in " + pane + " pane");

    let uriFile = vscode.Uri.file(fileName);
    let work = vscode.workspace.openTextDocument(uriFile);
    work.then(
        document => {
            console.log("Done opening " + document.fileName);
            let viewColumn: any = null;
            let currentColumn = vscode.window.activeTextEditor.viewColumn;

            if (currentColumn == null)
            {
                currentColumn = vscode.ViewColumn.One;
            }

            switch (pane)
            {
                case FilePane.Current:
                    vscode.window.showTextDocument(document);
                    break;
                case FilePane.Left:
                    viewColumn = currentColumn - 1;
                    break;
                case FilePane.Right:
                    viewColumn = currentColumn + 1;
                    break;
            }

            vscode.window.showTextDocument(document, viewColumn);
        }
    ).then(() => {return;}, (error) => { console.error(error); }) ;
}

export enum FilePane 
{
    Current,
    Left,
    Right
}