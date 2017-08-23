'use strict';

import * as vscode from 'vscode';
import * as request from 'request';

var baseRequest;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "releasenote-viewer" is now active!');

    configureHttpRequest();
	vscode.workspace.onDidChangeConfiguration(e => configureHttpRequest());

    let disposable = vscode.commands.registerCommand('extension.relnoteja', async () => {
        vscode.window.showQuickPick(["1.15", "1.14", "1.13", "1.12", "1.11", "1.10","1.9", "1.8", "1.7", "1.6", "1.5", "1.4", "1.3" /*, "1.2", "1.1", "1.0" */])
        .then(function (selected) {
            if(selected){
                let version = 'v' + selected.replace( /\./g , "_") + '_ja'; // ex: v1.8_ja
                getMDFile(version);
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;


function getMDFile(version) {
    let queryUrl = "https://raw.githubusercontent.com/ayatokura/JP-VSCode-Docs/master/release-notes/" + version +".md";
    return new Promise(function (resolve,reject) {
        baseRequest.get(queryUrl, function (error, response, body) {
            if (response.statusCode == 200) {
                vscode.workspace.openTextDocument({ language: 'markdown', content: body}).then(document => {
                    vscode.window.showTextDocument(document, vscode.ViewColumn.One, false).then(editor => {
                    console.log(editor);
                        vscode.commands.executeCommand(vscode.workspace.getConfiguration('releasenote-viewer').get<boolean>('showPreviewToSide') ? 'markdown.showPreviewToSide' : 'markdown.showPreview');
                    });
                });
            } else {
                vscode.window.showInformationMessage(response.body);
            }
        });
    });
}

function configureHttpRequest() {
	let httpSettings = vscode.workspace.getConfiguration('http');
    baseRequest = request.defaults({'proxy': `${httpSettings.get('proxy')}`});
}