import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class RegexPanelProvider implements vscode.WebviewViewProvider {
    constructor(private readonly extensionUri: vscode.Uri) {}

    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')]
        };

        const htmlPath = path.join(this.extensionUri.fsPath, 'media', 'panel.html');
        let html = fs.readFileSync(htmlPath, 'utf-8');

        // Update paths for webview URIs
        const styleUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'media', 'style.css')
        );
        const scriptUri = webviewView.webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'media', 'script.js')
        );

        html = html.replace('style.css', styleUri.toString());
        html = html.replace('script.js', scriptUri.toString());

        webviewView.webview.html = html;

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(message => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            switch (message.command) {
                case 'selectMatches':
                    this.selectMatches(editor, message.pattern, message.flags);
                    break;
                case 'deleteMatches':
                    this.deleteMatches(editor, message.pattern, message.flags);
                    break;
            }
        });
    }

    private selectMatches(editor: vscode.TextEditor, pattern: string, flags: string) {
        const regex = new RegExp(pattern, flags);
        const text = editor.document.getText();
        const matches = [...text.matchAll(regex)];
        const selections = matches.map(m =>
            new vscode.Selection(
                editor.document.positionAt(m.index!),
                editor.document.positionAt(m.index! + m[0].length)
            )
        );
        editor.selections = selections;
    }

    private deleteMatches(editor: vscode.TextEditor, pattern: string, flags: string) {
        const regex = new RegExp(pattern, flags);
        const text = editor.document.getText();
        const matches = [...text.matchAll(regex)];

        editor.edit(editBuilder => {
            matches.reverse().forEach(m => {
                const startPos = editor.document.positionAt(m.index!);
                const endPos = editor.document.positionAt(m.index! + m[0].length);
                editBuilder.delete(new vscode.Range(startPos, endPos));
            });
        });
    }
}