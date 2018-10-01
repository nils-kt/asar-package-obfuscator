var fs = require('fs');
var path = require('path');
var recursive = require('recursive-readdir');
var rimraf = require('rimraf');
var asar = require('asar');
var javaScriptObfuscator = require('javascript-obfuscator');

// Set your resources folder
var resourcesFolder = 'C:\\example-electron\\dist\\win-unpacked\\resources';

console.log('\n\nasar package javascript obfuscator\n\n');

console.log('Unpacking archive');
asar.extractAll(resourcesFolder + '\\app.asar', resourcesFolder + '\\src');

console.log('Deleting app.asar');
fs.unlinkSync(resourcesFolder + '\\app.asar');

// Enter the directories to be ignored
recursive(resourcesFolder + '\\src', ['node_modules', 'app'], function (err, files) {
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            let contents = fs.readFileSync(file, 'utf8');
            console.log('Protecting ' + file);

            // Change the settings here  -  https://github.com/javascript-obfuscator/javascript-obfuscator
            let ret = javaScriptObfuscator.obfuscate(contents, {
                compact: true
                , controlFlowFlattening: false
                , controlFlowFlatteningThreshold: 0.75
                , deadCodeInjection: false
                , deadCodeInjectionThreshold: 0.4
                , debugProtection: false
                , debugProtectionInterval: false
                , disableConsoleOutput: false
                , domainLock: []
                , identifierNamesGenerator: 'hexadecimal'
                , identifiersPrefix: ''
                , inputFileName: ''
                , log: false
                , renameGlobals: false
                , reservedNames: []
                , reservedStrings: []
                , rotateStringArray: true
                , seed: 0
                , selfDefending: false
                , sourceMap: false
                , sourceMapBaseUrl: ''
                , sourceMapFileName: ''
                , sourceMapMode: 'separate'
                , stringArray: true
                , stringArrayEncoding: false
                , stringArrayThreshold: 0.75
                , target: 'node'
                , transformObjectKeys: false
                , unicodeEscapeSequence: false
            });
            fs.writeFileSync(file, ret);
        }
    });
    console.log('Packing asar archive');
    asar.createPackage(resourcesFolder + '\\src', resourcesFolder + '\\app.asar', (callback) => {
        console.log('Created secure asar archive');
        console.log('Deleting src directory');
        rimraf(resourcesFolder + '\\src', function () {
            console.log('Done! Have fun.');
        });
    });
});
