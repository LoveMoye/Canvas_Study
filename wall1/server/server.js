var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer((request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        response.writeHead(200, {"Content-Type" : "text/html"});
        fs.createReadStream("../index.html").pipe(response);
    }
}).listen(3000);