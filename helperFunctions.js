var fs = require('fs');
const url = require('url');
var os = require('os');
var cl = console.log.bind(console);

module.exports = {
    write: (int, pastOrFuture) => {
        fs.readFile(pastOrFuture + '.txt', {
            encoding: "utf-8"
        }, (err, content) => {
            cl('content', content);
            //if no content in file(new empty file)set to 1 else split for line int
            const fileLineCount = content != null ? content.split('.').length : 1;
            // cl(content.split('.').length);
            if (err) {
                fs.writeFile(pastOrFuture + '.txt', logentry(int, pastOrFuture, fileLineCount), function read(err) {
                    if (err) {
                        throw err;
                    }
                    cl('new file added');
                });
            } else {
                fs.appendFile(pastOrFuture + '.txt', logentry(int, pastOrFuture, fileLineCount), function(err) {
                    if (err) throw err;
                    cl('appended!');
                });

            }
        });
    },
    //countlnes is not used cant get it to work...for now....muhahahah
    countLines: (filePath) => {
        var count = 0;
        fs.createReadStream(filePath)
            .on('data', function(chunk) {
                for (var i = 0; i < chunk.length; i++)
                    if (chunk[i] == 10) count++;
            })
            .on('end', function() {
                // return count;
                returnCount(count);
                cl('fuckingpos', count);
            });
    }
};

function logentry(int, pastOrFuture, fileLineCount) {
    if (int < 10) int = "0" + int;
    return "entry line#" + fileLineCount + "_timestamp: " + getFormattedDate() + "_day of month: " + int + " has " + pastOrFuture + " for current month." + os.EOL;
};

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