import * as vscode from 'vscode';
import { RegexPanelProvider } from './panel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Regex Copilot is active');

    // const provider = new SimpleViewProvider(context.extensionUri);
    const provider = new RegexPanelProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('regex-copilot-view', provider)
    );
}

export function deactivate() {}