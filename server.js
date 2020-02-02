var http = require('http');
var fs = require('fs');
var path = require('path');
var opn = require('opn');

http.createServer(function (request, response) {

    var filePath = './' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.json':
            contentType = 'application/json';
            break;
            case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(200);
                response.end('file not exist: ' + error.code + ' ..\n');
                response.end();
            }
            else {
                response.writeHead(500);
                response.end('Error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType,'Access-Control-Allow-Origin': '*' });
            response.end(content, 'utf-8');
        }
    });
    
}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');
opn('http://localhost:8125/index.html');