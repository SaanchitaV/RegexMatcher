import * as vscode from 'vscode';
import { RegexPanelProvider } from './panel';

// class SimpleViewProvider implements vscode.WebviewViewProvider {
//     constructor(private readonly extensionUri: vscode.Uri) {}

//     resolveWebviewView(webviewView: vscode.WebviewView) {
//         webviewView.webview.options = { enableScripts: true };
//         webviewView.webview.html = `
//             <!DOCTYPE html>
//             <html>
//             <body>
//                 <h2>Hello from Regex Copilot</h2>
//                 <p>This proves the Activity Bar → Webview works.</p>
//             </body>
//             </html>
//         `;
//         console.log("Webview loaded successfully ✅");
//     }
// }

export function activate(context: vscode.ExtensionContext) {
    console.log('Regex Copilot is active');

    // const provider = new SimpleViewProvider(context.extensionUri);
    const provider = new RegexPanelProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('regex-copilot-view', provider)
    );
}

export function deactivate() {}