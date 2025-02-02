const vscode = require('vscode');
const WebSocket = require('ws');

let ws;

function activate(context) {
  console.log('Live Collaboration extension is now active!');

  // Register command
  let disposable = vscode.commands.registerCommand('live-collaboration-tool.startCollaboration', () => {
    vscode.window.showInformationMessage('Live Collaboration Started!');
    connectWebSocket();
  });

  context.subscriptions.push(disposable);
}

function connectWebSocket() {
  try {
    ws = new WebSocket('ws://localhost:3000');

    ws.on('open', () => {
      console.log('Connected to collaboration server');
    });

    ws.on('error', (error) => {
      console.error('WebSocket Error:', error.message);
      vscode.window.showErrorMessage('Failed to connect to collaboration server.');
    });

    ws.on('message', (data) => {
      const message = data.toString();
      console.log('Received:', message);
    });

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event.contentChanges));
      }
    });

    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (ws.readyState === WebSocket.OPEN) {
        const position = event.selections[0].active;
        ws.send(JSON.stringify({ type: 'cursor', position }));
      }
    });
  } catch (error) {
    console.error('WebSocket connection failed:', error);
  }
}

function deactivate() {
  console.log('Live Collaboration extension is now deactivated.');
  if (ws) {
    ws.close();
  }
}

module.exports = {
  activate,
  deactivate,
};
