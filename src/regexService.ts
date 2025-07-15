import * as vscode from 'vscode';

export function runRegexOnActiveEditor(pattern: string, flags: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
      return { matches: [], error: 'No active editor' };
  }
  const text = editor.document.getText();
  let matches: string[] = [];
  let error: string | null = null;

  try {
    const regex = new RegExp(pattern, flags);
    let match;
    const decorations: vscode.DecorationOptions[] = [];

    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
      const start = editor.document.positionAt(match.index);
      const end = editor.document.positionAt(match.index + match[0].length);
      decorations.push({ range: new vscode.Range(start, end) });
      if (!regex.global){
        break;
      } 
    }

    const decoType = vscode.window.createTextEditorDecorationType({
      backgroundColor: 'rgba(255,255,0,0.5)',
    });
    editor.setDecorations(decoType, decorations);

  } catch (e: any) {
    error = e.message;
  }

  return { matches, error };
}
