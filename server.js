const express = require('express');
const WebSocket = require('ws');
const app = express();
const server = app.listen(3000, () => console.log('Server running on port 3000'));

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Broadcast messages to all clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});