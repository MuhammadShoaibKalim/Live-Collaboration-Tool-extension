const vscode = require('vscode');
const WebSocket = require('ws');

let ws;

function activate() {
  console.log('Live Collaboration extension is now active!');

  // Connect to the WebSocket server
  ws = new WebSocket('ws://localhost:3000');

  ws.on('open', () => {
    console.log('Connected to collaboration server');
  });

  ws.on('message', (data) => {
    const message = data.toString();
    console.log('Received:', message);
    // Handle incoming messages (e.g., update editor content)
  });

  // Send document changes to the server
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (ws.readyState === WebSocket.OPEN) {
      const changes = event.contentChanges;
      ws.send(JSON.stringify(changes));
    }
  });

  // Track cursor position
  vscode.window.onDidChangeTextEditorSelection((event) => {
    if (ws.readyState === WebSocket.OPEN) {
      const position = event.selections[0].active;
      ws.send(JSON.stringify({ type: 'cursor', position }));
    }
  });
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