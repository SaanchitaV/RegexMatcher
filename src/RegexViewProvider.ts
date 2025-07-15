import * as vscode from 'vscode';
import { runRegexOnActiveEditor } from './regexService';
import { regexPresets } from './utils';

export class RegexViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private pattern: string = '';
  private flags: string = 'g';
  private results: string[] = [];
  private error: string | null = null;
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {
    if (this.error) {
      return [new vscode.TreeItem(`❌ ${this.error}`)];
    }
    if (!this.pattern) {
      return [new vscode.TreeItem("Enter a pattern to begin (Cmd/Ctrl+Shift+P)")];
    }

    const nodes: vscode.TreeItem[] = [
      new vscode.TreeItem(`Pattern: /${this.pattern}/${this.flags}`),
      ...this.results.map((text, i) => new vscode.TreeItem(`Match ${i + 1}: ${text}`)),
    ];
    return nodes;
  }

  async promptPattern() {
    const input = await vscode.window.showInputBox({ prompt: 'Enter Regex Pattern' });
    if (input !== undefined) {
      this.pattern = input;
      this.run();
    }
  }

  async promptFlags() {
    const selected = await vscode.window.showQuickPick(['g', 'i', 'm', 's', 'u', 'y'], {
      canPickMany: true,
      title: 'Select Flags (press space to toggle)',
    });
    if (selected) {
      this.flags = selected.join('');
      this.run();
    }
  }

  async selectPreset() {
    const selected = await vscode.window.showQuickPick(regexPresets.map((p:any) => p.label), {
      placeHolder: 'Select a regex preset',
    });
    const preset = regexPresets.find((p:any) => p.label === selected);
    if (preset) {
      this.pattern = preset.pattern;
      this.flags = preset.flags;
      this.run();
    }
  }

  private run() {
    try {
      const { matches, error } = runRegexOnActiveEditor(this.pattern, this.flags);
      this.results = matches;
      this.error = error;
    } catch (err: any) {
      this.error = err.message;
      this.results = [];
    }
    this._onDidChangeTreeData.fire();
  }
}
