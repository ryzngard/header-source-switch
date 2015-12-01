// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-plus';

function findFileInDir(dir: string, filename: string, header: boolean) {
	if (header) {

	}
	else {

	}
}

let headerExtensions : String[] = ['.h', '.hpp', '.hh', '.hxx'];
let sourceExtensions : String[] = ['.cpp', '.c', '.cc', '.cxx', '.m', '.mm'];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.switch', () => {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document.fileName;
		let dir = path.dirname(document);
		let extension = path.extname(document);
		let fileWithoutExtension = path.basename(document).replace(extension, '');
		
		if (extension.length == 0)
		{
			// Do nothing if there is no extension 
			return;
		}
		
		
		
		// Determine if the file is a header or source file.
		let extensions : String[];
		
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
		
		let filesInDir: String[] = fs.listSync(dir, extensions);
		
		for (var i = 0; i < filesInDir.length; i++)
		{
			let fileName: String = filesInDir[i];
			let match = fileName.match(fileWithoutExtension + extRegex);
			if (match)
			{
				found = true;
				newFileName = match[0];
				break;
			}
		}
		
		let newFile = path.join(dir, newFileName);
		
		if (found && fs.isFileSync(newFile))
		{
			console.log("Opening " + newFile);
			
			let openEditor = vscode.window.visibleTextEditors.find(editor => {
				let editorName = editor.document.fileName;
				return editorName == newFile;
			});
			
			if (openEditor != undefined)
			{
				vscode.window.showTextDocument(openEditor.document);
			}
			else 
			{
				let uriFile = vscode.Uri.file(newFile);
				let work = vscode.workspace.openTextDocument(uriFile);
				work.then(
					document => {
						console.log("Done opening " + document.fileName);
						vscode.window.showTextDocument(document);
					}
				).then(() => {return;}, (error) => { console.error(error); }) ;
			}
		}

	});

	context.subscriptions.push(disposable);
}