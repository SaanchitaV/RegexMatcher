import * as vscode from 'vscode';
import { RegexViewProvider } from './RegexViewProvider';

/**
 * Called when the extension is activated.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  const provider = new RegexViewProvider(context);
  context.subscriptions.push(
    // Register the tree data provider for the regex tester view.
    vscode.window.registerTreeDataProvider('regexTester', provider),

    // Register the command to prompt the user for a pattern.
    vscode.commands.registerCommand('regexTester.enterPattern', () => provider.promptPattern()),

    // Register the command to prompt the user for regex flags.
    vscode.commands.registerCommand('regexTester.selectFlags', () => provider.promptFlags()),

    // Register the command to prompt the user for a regex preset.
    vscode.commands.registerCommand('regexTester.selectPreset', () => provider.selectPreset())
  );
}
