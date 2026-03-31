const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
app.use(express.static('public'));

const server = app.listen(8080, '0.0.0.0', () => console.log('Express server running on http://0.0.0.0:8080'));

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});

app.use('/peerjs', peerServer);