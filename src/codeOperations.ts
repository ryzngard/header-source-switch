import * as vscode from 'vscode';
import { findMatchedFileAsync } from './fileOperations';

class DocumentTracker extends vscode.Disposable
{
    private _disposable: vscode.Disposable = null;
    private _mainColumn: vscode.ViewColumn = null;
    private _secondaryColumn: vscode.ViewColumn = vscode.ViewColumn.Beside;
    constructor()
    {
        super(() => {
            this._onDispose();
        });
    }

    subscribeToChanges()
    {
        if (this._disposable != null)
        {
            return;
        }

        this._mainColumn = vscode.window.activeTextEditor.viewColumn;

        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeActiveTextEditor(this._onEditorChange, this, subscriptions);

        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    reset()
    {
        this._onDispose();
    }

    private _onDispose() 
    {
        if (this._disposable != null)
        {
            this._disposable.dispose();
        }

        this._disposable = null;
    }

    private async _onEditorChange()
    {
        if (vscode.window.activeTextEditor.viewColumn == this._mainColumn)
        {
            let fileToOpen = await findMatchToCurrent();
            if (fileToOpen)
            {
                openFile(fileToOpen, this._secondaryColumn);
            }
        }
    }
}

async function openFile(fileName:string, column:vscode.ViewColumn)
{
    console.log("Opening " + fileName + " in " + column + " pane");

    let uriFile = vscode.Uri.file(fileName);

    try 
    {
        let document = await vscode.workspace.openTextDocument(uriFile);
        
        vscode.window.showTextDocument(document, column);
        console.log("Done opening " + document.fileName);
    }
    catch(error)
    {
        console.error(error);
    }
}

async function findMatchToCurrent()
{
    let activeTextEditor = vscode.window.activeTextEditor;
    let document = activeTextEditor.document;
    let fileName = await findMatchedFileAsync(document.fileName);

    return fileName;
}

export async function openFileInPane(pane:FilePane)
{
    let fileName = await findMatchToCurrent();

    let viewColumn: any = null;
    let currentColumn = vscode.window.activeTextEditor.viewColumn;

    if (currentColumn == null)
    {
        currentColumn = vscode.ViewColumn.One;
    }

    switch (pane)
    {
        case FilePane.Current:
            viewColumn = currentColumn;
            break;
        case FilePane.Left:
            viewColumn = currentColumn - 1;
            break;
        case FilePane.Right:
            viewColumn = currentColumn + 1;
            break;
    }

    openFile(fileName, viewColumn);
}

export enum FilePane 
{
    Current,
    Left,
    Right
}

let trackingEnabled:boolean = false;
export var changeTracker = new DocumentTracker();

export function toggleTracking()
{
    if (trackingEnabled)
    {
        changeTracker.reset();
        trackingEnabled = false;
        return;
    }

    trackingEnabled = true;
    changeTracker.subscribeToChanges();
}