var http = require('http');
var fs = require('fs');
const url = require('url');
var os = require('os');
var helpers = require('./helperFunctions');
var cl = console.log.bind(console);

http.createServer(function(req, res) {
    const qs = url.parse(req.url);
    parsedQs = qs.pathname.split('/');

    if (parsedQs[1] == "date" && parsedQs[2] >= 1 && parsedQs[2] <= 31) {

        //init day to check
        var today = new Date();
        var dd = today.getDate();

        //start response output
        res.writeHead(200);
        res.write(req.url);

        //int is day in url
        const int = parsedQs[2];

        //set write file logic
        switch (true) {
            case (int > dd):
                cl('int>dd');
                helpers.write(int, 'future');
                break;
            case (int < dd):
                cl('int<dd');
                helpers.write(int, 'past');
                break;
            case (int == dd):
                cl('int==dd');
                var date = new Date();
                var hour = date.getHours();
                if (hour <= 12) {
                    helpers.write(int, 'past');
                }
                if (hour > 12) {
                    helpers.write(int, 'future');
                }
                break;
        }
        res.end();
    } else {
        //deal with stupid '/favicon.ico' request
        if (req.url != '/favicon.ico') {
            cl('404');
            res.writeHead(404);
            res.end();
        }
    }
}).listen(3000, 'localhost');