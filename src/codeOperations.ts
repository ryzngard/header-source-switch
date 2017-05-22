import * as vscode from 'vscode';

export function openFile(fileName:string) {

    console.log("Opening " + fileName);

    let openEditor = vscode.window.visibleTextEditors.find(editor => {
        let editorName = editor.document.fileName;
        return editorName == fileName;
    });

    if (openEditor != undefined)
    {
        vscode.window.showTextDocument(openEditor.document);
    }
    else
    {
        let uriFile = vscode.Uri.file(fileName);
        let work = vscode.workspace.openTextDocument(uriFile);
        work.then(
            document => {
                console.log("Done opening " + document.fileName);
                vscode.window.showTextDocument(document);
            }
        ).then(() => {return;}, (error) => { console.error(error); }) ;
    }
}

export function openFileInRightPane(fileName:string) {
    console.log("Opening " + fileName + " in right pane");

    let uriFile = vscode.Uri.file(fileName);
    let work = vscode.workspace.openTextDocument(uriFile);
    work.then(
        document => {
            console.log("Done opening " + document.fileName);
            vscode.window.showTextDocument(document, vscode.ViewColumn.Two);
        }
    ).then(() => {return;}, (error) => { console.error(error); }) ;
}