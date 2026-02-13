require("dotenv").config();
const http = require('http');
const requestListener = function(req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
console.log('server listening on port: '+ process.env.PORT);
server.listen(process.env.PORT);