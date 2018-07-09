var http = require('http');
var fs = require('fs');
const url = require('url');
var os = require('os');

var cl = console.log.bind(console);


http.createServer(function(req, res) {
    const qs = url.parse(req.url);
    //cl('req.url: ', qs.pathname);
    parsedQs = qs.pathname.split('/');
    //cl('parsedQs: ', parsedQs[1], parsedQs[2]);

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
                write(int, 'future');
                break;
            case (int < dd):
                cl('int<dd');
                write(int, 'past');
                break;
            case (int == dd):
                cl('int==dd');
                var date = new Date();
                var hour = date.getHours();
                if (hour < 12) {
                    write(int, 'past');
                }
                if (hour > 12) {
                    write(int, 'future');
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

function write(int, pastOrFuture) {
    fs.readFile(pastOrFuture + '.txt', function read(err) {
        if (err) {
            fs.writeFile(pastOrFuture + '.txt', logentry(int, pastOrFuture), function read(err) {
                if (err) {
                    throw err;
                }
                cl('new file added');

            });
        } else {
            fs.appendFile(pastOrFuture + '.txt', logentry(int, pastOrFuture), function(err) {
                if (err) throw err;
                cl('appended!');
            });

        }
    });
}

function getFormattedDate() {
    //break date to components
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    //add missing zero string logic
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;
    //create string of formatted date
    var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
    return str;
}

function logentry(int, pastOrFuture) {
    return "entry timestamp: " + getFormattedDate() + "_day of month: " + int + " has " + pastOrFuture + " for current month" + os.EOL;
}