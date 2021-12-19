// Standart libraries
const http = require('http');

// External libraries
const express = require('express');

const iniParser = require('./ini-parser');

const app = express();
const server = http.createServer(app);


const ENV = iniParser.parseINIFile(__dirname + '/env.ini');

app.get('/', (req, res) => {
  res.send("First thing");
})


// Start server
server.listen(ENV.SERVER.SERVER_PORT);