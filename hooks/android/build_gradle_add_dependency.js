#!/usr/bin/env node

module.exports = function(ctx) {
    var fs = require('fs'),
    os = require("os"),
    readline = require("readline"),
    deferral = require('q').defer();

var googleServicesStr = "if (project.extensions.findByName('googleServices') == null) { apply plugin: 'com.google.gms.google-services' }"
var googleServicesStrExists = false
var classpathsStrToVerify = "com.google.gms:google-services:4.3.10"
var classpathsStr = '\t\tclasspath "com.google.gms:google-services:4.3.10"'
var classpathsExists = false

var lineReader = readline.createInterface({
    terminal: false,
    input : fs.createReadStream('platforms/android/build.gradle')
});
lineReader.on("line", function(line) {
    if (line.includes(classpathsStrToVerify)) {
        classpathsExists = true
    }

    fs.appendFileSync('./build.gradle', line.toString() + os.EOL);
    if (/.*\ dependencies \{.*/.test(line)) {
        if (!classpathsExists) {
            fs.appendFileSync('./build.gradle', classpathsStr + os.EOL);
        }
    }
}).on("close", function () {
    fs.rename('./build.gradle', 'platforms/android/build.gradle', deferral.resolve);
});

var lineReaderApp = readline.createInterface({
    terminal: false,
    input : fs.createReadStream('platforms/android/app/build.gradle')
});
lineReaderApp.on("line", function (line) {
    if (line.includes(googleServicesStr)) {
        googleServicesStrExists = true
    }
});    
lineReaderApp.on("close", function () {
    if (!googleServicesStrExists) {
        fs.appendFileSync('./platforms/android/app/build.gradle', googleServicesStr + os.EOL);
        fs.rename('./platforms/android/app/build.gradle', 'platforms/android/app/build.gradle', deferral.resolve);    
    }
});

return deferral.promise;
};