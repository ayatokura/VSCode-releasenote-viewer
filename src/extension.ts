'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as request from 'request-promise';

var baseRequest;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "releasenote-viewer" is now active!');

    // console.log(context);

    configureHttpRequest();
    vscode.workspace.onDidChangeConfiguration(e => configureHttpRequest());

    // define QuickPick Options
    let options: vscode.QuickPickOptions = {
        ignoreFocusOut: true,
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Please select the content to display ...'
    }

    let disposable = vscode.commands.registerCommand('extension.relnoteja', async () => {

        let enLocale :Boolean = false;
        let version :String;
        let description :String;

        let contentsQuickItem: vscode.QuickPickItem[] = await genQuickItem("contents" ,enLocale);

        vscode.window.showQuickPick(contentsQuickItem, options).then(function (selected) {
            switch(selected.label){
                case 'Japanese':
                    // console.log(selected.label);
                    enLocale = false;
                    break;
                case 'English':
                    // console.log(selected.label);
                    enLocale = true;
                    break;
                case 'How to Contribute':
                    // console.log(selected.label);
                    enLocale = true;
                    version = 'contrib';
                    break;
                case 'VS Code Tips and Tricks':
                    // console.log(selected.label);
                    enLocale = true;
                    version = 'tips';
                    break;
                case 'Awesome VS Code':
                    enLocale = true;
                    version = 'awesome';
                    // console.log(selected.label);
                    break;
                default:
                    // console.log(selected.label);
                    enLocale = false;
                    break;
            }

            if (selected.label == "VS Code Tips and Tricks" || selected.label == 'Awesome VS Code' || selected.label == 'How to Contribute'){
                bringMDFile(context, version, enLocale, null);
            } else {
                vscode.window.showQuickPick(genQuickItem("version" ,enLocale), options)
                .then(function (selected) {
                    if(selected){
                        // console.log('selected =', selected);
                    version = 'v' + selected.label.replace( /\./g , "_").trim(); // ex: v1_8
                    let description = selected.description;
                    // console.log('version = ', version);
                    // console.log("https://raw.githubusercontent.com/ayatokura/JP-VSCode-Docs/master/release-notes/" + version + ".md");
                    bringMDFile(context, version, enLocale, description);
                    }
                });
            }
        });
    });

    context.subscriptions.push(disposable);
}

function bringMDFile(context, version, enLocale, description) {

    let queryUrl :String;

    enum rawURL {
        jpvscodedoc = "https://raw.githubusercontent.com/ayatokura/JP-VSCode-Docs/master/release-notes/",
        microsoft = "https://raw.githubusercontent.com/Microsoft/vscode-wiki/master/How-to-Contribute.md",
        tipstricks = "https://raw.githubusercontent.com/Microsoft/vscode-tips-and-tricks/master/README.md",
        awesome = "https://raw.githubusercontent.com/viatsko/awesome-vscode/master/README.md",
        vscode = "https://code.visualstudio.com/raw/"
    }
    switch(version){
        case 'contrib':
            // console.log(version);
            queryUrl = rawURL.microsoft;
            break;
        case 'tips':
            // console.log(version);
            queryUrl = rawURL.tipstricks;
            break;
        case 'awesome':
            // console.log(version);
            queryUrl = rawURL.awesome;
            break;
        default:
            // 未翻訳の場合はオリジナルを表示するように調整
            if(description.match(/未翻訳/)){
                enLocale = true;
            }
            queryUrl = (enLocale ? rawURL.vscode : rawURL.jpvscodedoc) + (version.match(/^\D.*_2016/)
                        ? version.replace(/^v/,'') : version) + (enLocale ? "" : "_ja") + ".md";
            break;
    }

        // console.log('queryUrl = ', queryUrl);
        // console.log('version =', version);

        return baseRequest.get(queryUrl, function (error, response, body) {
            console.log('response =', response.headers);
            if (response.statusCode === 200) {
                if(version.match(/tips/)) {
                    body = body.replace(/\(\/media\//gm, '(https://raw.githubusercontent.com/Microsoft/vscode-tips-and-tricks/master/media/');
                } else {
                    if(version == 'vFebruary') {
                        body = body
                        .replace(/\(images\/(January\/)/g, '(https://code.visualstudio.com/assets/updates/January' + '/')
                        .replace(/\(images\/(February\/)/g, '(https://code.visualstudio.com/assets/updates/February' + '/');
                    } else {
                        body = body.replace(/\(images\/(\d*\w*\d*\/)/g, '(https://code.visualstudio.com/assets/updates/' + version.replace(/^v/,'') + '/');
                    }
                    body = body.replace(/images\/November/g,'/assets/updates/0_10_0');
                }

                const tail = [
                    `<!-- scroll-to-top--><style type="text/css">h1,h2,h3,h4{margin-bottom:1rem}html{font-size:10px}body{padding-bottom:100px}h1,h2,h3{font-weight:lighter;margin-top:2rem}h2,h4{margin-top:3rem}h1{font-size:4rem;margin-bottom:1.5rem}h2{font-size:3rem}h3{font-size:2.2rem}h4{font-size:1.2rem;text-transform:uppercase}#scroll-to-top{position:fixed;width:40px;height:40px;right:25px;bottom:25px;background-color:#444;border-radius:50%;cursor:pointer;box-shadow:1px 1px 1px rgba(0,0,0,.25)}#scroll-to-top:hover{background-color:#007acc;box-shadow:2px 2px 2px rgba(0,0,0,.25)}body.vscode-light #scroll-to-top{background-color:#949494}body.vscode-light #scroll-to-top:hover{background-color:#007acc}body.vscode-high-contrast #scroll-to-top{background-color:#000;border:2px solid #6fc3df;box-shadow:none}body.vscode-high-contrast #scroll-to-top:hover{background-color:#007acc}#scroll-to-top span.icon::before{content:"";background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=);width:1.6rem;height:1.6rem;position:absolute;left:calc(50% - 1.6rem / 2);top:calc(50% - 1.6rem / 2)}</style><a id="scroll-to-top" role="button" aria-label="scroll to top" onclick="scroll(0,0)"><span class="icon"></span></a>`,`<link rel="stylesheet" type="text/css" href="${getMediaPath(context.extensionPath,'inproduct_releasenotes.css')}"/>`
                ].join('\n');

            vscode.workspace.openTextDocument({ language: 'markdown', content: body.replace(/[\b]/g, '')}).then(async document => {
                // console.log('document =', document);
                const edit = new vscode.WorkspaceEdit();
                edit.insert(document.uri, new vscode.Position(document.lineCount + 1, 0), tail);
                vscode.workspace.applyEdit(edit);
                vscode.window.showTextDocument(document, vscode.ViewColumn.One, false).then(editor => {
                    vscode.commands.executeCommand(vscode.workspace.getConfiguration('releasenote-viewer').get<boolean>('showPreviewToSide') ? 'markdown.showPreviewToSide' : 'markdown.showPreview');
                });
            });
        } else {
            vscode.window.showInformationMessage(response.body);
        }
    });
}

async function genQuickItem(element: String, enLocale: Boolean) {

    let QuickItemObject = await getQuickItemObject();
    // console.log('QuickItemObject =', await QuickItemObject);

    let versionQuickPickItem: vscode.QuickPickItem[] = [];

    // console.log('genQuickItem =', QuickItemObject.version[0].label);
    // console.log('genQuickItem.length =', QuickItemObject.version.length);

    if(element == 'version') {
        QuickItemObject.version.forEach(element => {
        // console.log('element =', element);
            versionQuickPickItem.push(
                {
                    label: element.label,
                    description: enLocale ? element.description.replace(/Untranslated/gm, '') : element.description.replace(/Untranslated/gm, '未翻訳'),
                    detail: enLocale ? element.detail + ' Release notes' : element.detail + ' リリースノート'
                });
        });
    } else if (element == 'contents'){
        QuickItemObject.contents.forEach(element => {
            // console.log('element =', element);
            versionQuickPickItem.push(
                {
                    label: element.label,
                    description: element.description,
                    detail: element.detail
                });
            });
    }
    // console.log('versionQuickPickItem =', versionQuickPickItem);
    return versionQuickPickItem;
}

async function getQuickItemObject() {
    const URL ='https://raw.githubusercontent.com/ayatokura/JP-VSCode-Docs/master/release-notes/version.json';

    return await baseRequest.get(URL).then(async res => {
        // console.log('res =', await JSON.parse(res));
        return JSON.parse(res);
    });
}

function configureHttpRequest() {
    let httpSettings = vscode.workspace.getConfiguration('http');
    baseRequest = request.defaults({'gzip': true, 'proxy': `${httpSettings.get('proxy')}`});
}

function getMediaPath(extensionPath: string, mediaFile: string): string {
    return path.join(extensionPath, 'media', mediaFile);
}
