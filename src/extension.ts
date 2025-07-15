// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "regextester-extension" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('regextester-extension.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from regextester-extension!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}


import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('regex-tester.openPanel', () => {
    const panel = vscode.window.createWebviewPanel(
      'regexTester',
      'Regex Tester',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Regex Tester</title>
      <style>
        body { font-family: sans-serif; padding: 1rem; }
        input, textarea { width: 100%; margin-top: 10px; font-size: 14px; }
        .highlight { background-color: yellow; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>Regex Tester</h2>
      <input id="regexInput" placeholder="/pattern/flags" />
      <textarea id="sampleText" rows="10" placeholder="Paste your sample text here..."></textarea>
      <p><strong>Matches:</strong></p>
      <div id="result"></div>

      <script>
        const regexInput = document.getElementById('regexInput');
        const sampleText = document.getElementById('sampleText');
        const result = document.getElementById('result');

        function runRegex() {
          try {
            const raw = regexInput.value;
            const match = raw.match(/^\\/(.+)\\/([gimsuy]*)$/);
            if (!match) {
              result.innerHTML = '<span style="color:red">Invalid format. Use /pattern/flags</span>';
              return;
            }
            const regex = new RegExp(match[1], match[2]);
            const text = sampleText.value;
            const highlighted = text.replace(regex, match => \`<span class="highlight">\${match}</span>\`);
            result.innerHTML = highlighted;
          } catch (e) {
            result.innerHTML = '<span style="color:red">Error: ' + e.message + '</span>';
          }
        }

        regexInput.addEventListener('input', runRegex);
        sampleText.addEventListener('input', runRegex);
      </script>
    </body>
    </html>
  `;
}