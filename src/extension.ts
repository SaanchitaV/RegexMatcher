import * as vscode from 'vscode';
import { RegexPanelProvider } from './panel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Regex Copilot is active');

    const provider = new RegexPanelProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('regex-copilot-view', provider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('regex-copilot.open', () => {
            vscode.commands.executeCommand('workbench.view.extension.regex-copilot-container');
        })
    );
}