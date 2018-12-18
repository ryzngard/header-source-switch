'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { findMatchedFileAsync } from './fileOperations';
import { openFileInPane, FilePane } from './codeOperations';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    async function openInPane(pane:FilePane)
    {
        let activeTextEditor = vscode.window.activeTextEditor;
        let document = activeTextEditor.document;
        findMatchedFileAsync(document.fileName).then(
            (fileToOpen: string) => {
                if (fileToOpen)
                {
                    openFileInPane(fileToOpen, pane);
                }
            }
        )
    } 

    let disposable = vscode.commands.registerCommand('extension.switch', async () => {
        openInPane(FilePane.Current);
    });

    context.subscriptions.push(disposable);

    let switchRightPaneDisposable = vscode.commands.registerCommand('extension.switchRightPane', async () => {
        openInPane(FilePane.Right);
    });

    context.subscriptions.push(switchRightPaneDisposable);

    let switchLeftPaneDisposable = vscode.commands.registerCommand('extension.switchLeftPane', async () => {
        openInPane(FilePane.Left);
    });

    context.subscriptions.push(switchLeftPaneDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}