#!/usr/bin/env node

module.exports = function(ctx) {
    var fs = require('fs'),
    os = require("os"),
    readline = require("readline"),
    deferral = require('q').defer();

var lineReader = readline.createInterface({
    terminal: false,
    input : fs.createReadStream('platforms/android/build.gradle')
});
lineReader.on("line", function(line) {
    fs.appendFileSync('./build.gradle', line.toString() + os.EOL);
    if (/.*\ dependencies \{.*/.test(line)) {
        fs.appendFileSync('./build.gradle', '\t\tclasspath "com.google.gms:google-services:4.3.10"' + os.EOL);
    }
}).on("close", function () {
    fs.rename('./build.gradle', 'platforms/android/build.gradle', deferral.resolve);
});

var lineReaderApp = readline.createInterface({
    terminal: false,
    input : fs.createReadStream('platforms/android/app/build.gradle')
});
lineReaderApp.on("close", function () {
    var lineToAdd = "if (project.extensions.findByName('googleServices') == null) { apply plugin: 'com.google.gms.google-services' }"
    fs.appendFileSync('./platforms/android/app/build.gradle', lineToAdd + os.EOL);
    fs.rename('./platforms/android/app/build.gradle', 'platforms/android/app/build.gradle', deferral.resolve);
});

return deferral.promise;
};