const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9000 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
  ws.send(JSON.stringify({ type: 'greeting', content: 'Hello from server' }));
});

console.log('WebSocket server is running on ws://localhost:9000');
