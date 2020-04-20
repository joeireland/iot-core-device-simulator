const express = require('express');
const http    = require('http');
const WS      = require('ws');

const PORT   = 8080;
const app    = express();
const server = http.createServer(app);
const wss    = new WS.Server({ server });

let ws = null;

function main() {
  app.use('/', express.static('./web'));

  wss.on('connection', onWebSocketConnect);

  server.listen(PORT, () => {
    console.log('Listening: port=' + server.address().port);
  });
}

function onWebSocketConnect(connected, req) {
  console.log('WebSocket Connected');
  
  ws = connected; 
  ws.on('message', onWebSocketMessage);

  flash();
  beep();
}

function onWebSocketMessage(message) {
  let msg = JSON.parse(message);

  if (msg.sensor === 'button') {
    console.log('Button: ' + msg.value);
  }
  else if (msg.sensor === 'angle') {
    console.log('Angle: ' + msg.value);
  }
}

function flash() {
  console.log('Flash');

  red(1);
  setTimeout(() => { red(0); }, 1000);
}

function beep() {
  console.log('Beep');

  buzzer(1);
  setTimeout(() => { buzzer(0); }, 1000);
}

function red(value) {
  ws.send('{ "command": "red", "value": ' + value + ' }');
}

function blue(value) {
  ws.send('{ "command": "blue", "value": ' + value + ' }');
}

function buzzer(value) {
  ws.send('{ "command": "buzzer", "value": ' + value + ' }');
}

main();

