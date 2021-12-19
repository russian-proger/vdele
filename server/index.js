// --------------= Import =----------------//

// Standart libraries
const fs        = require('fs');
const http      = require('http');

// External libraries
const express   = require('express');

const iniParser = require('./ini-parser');

// Variables
const ENV = iniParser.parseINIFile(__dirname + '/env.ini');

const app = express();
const server = http.createServer(app);




// --------------= Functions =----------------//
function sendView(response, view_name) {
  response.send(fs.readFileSync(`${__dirname}/../views/${view_name}`).toString());
}


// --------------= Routes =----------------//

// Main route
app.get('/', (req, res) => {
  sendView(res, 'welcome.html');
});






// --------------= Start server =----------------//

// Start server
server.listen(ENV.SERVER.SERVER_PORT);