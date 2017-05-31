'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { findMatchedFileAsync } from './fileOperations';
import { openFile, openFileInRightPane } from './codeOperations';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.switch', async () => {
        let activeTextEditor = vscode.window.activeTextEditor;
        let document = activeTextEditor.document;
        findMatchedFileAsync(document.fileName).then(
            (fileToOpen: string) => {
                if (fileToOpen) {
                    openFile(fileToOpen);
                }
            }
        )
    });

    context.subscriptions.push(disposable);

    let switchNewPaneDisposable = vscode.commands.registerCommand('extension.switchRightPane', async () => {
        let activeTextEditor = vscode.window.activeTextEditor;
        let document = activeTextEditor.document;
        findMatchedFileAsync(document.fileName).then(
            (fileToOpen: string) => {
                if (fileToOpen)
                {
                    openFileInRightPane(fileToOpen);
                }
            }
        )
    });

    context.subscriptions.push(switchNewPaneDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}