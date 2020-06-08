var fs = require('fs');
var path = require('path');
var recursive = require('recursive-readdir');
var rimraf = require('rimraf');
var asar = require('asar');
var javaScriptObfuscator = require('javascript-obfuscator');

// Parse/Get CLI arguments using yargs -> http://yargs.js.org/
const argv = require('yargs')
    .command('$0 <input> [output]', 'Obfuscate <input> ASAR file', (yargs) => {
        yargs
            .positional('input', {
                describe: 'input ASAR file to be obfuscated',
                demandOption: true,
            })
            .option('output', {
                alias: 'o',
                description: 'output ASAR file',
                default: null
            })
}).argv;

// Set parameters from arguments
var asarFullFileName = path.normalize(argv.input);
var outputFullFileName = (argv.output) ? path.normalize(argv.output) : asarFullFileName + ".new";
var outputFolder = path.dirname(outputFullFileName);

console.log(outputFullFileName);
console.log(argv);

// Set your resources folder
var resourcesFolder = path.dirname(asarFullFileName);
console.log(resourcesFolder);

console.log('\n\nasar package javascript obfuscator\n\n');

console.log('Unpacking archive');
asar.extractAll(asarFullFileName, outputFolder + '\\this_is_a_temporal_folder');

console.log('Deleting app.asar');
//fs.unlinkSync(resourcesFolder + '\\app.asar');

//process.exit(0);

// Enter the directories to be ignored
recursive(outputFolder + '\\this_is_a_temporal_folder', ['node_modules', 'app'], function (err, files) {
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            let contents = fs.readFileSync(file, 'utf8');
            if((contents.indexOf("?.") < 0) && (contents.indexOf(".#") < 0)) {
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
        }
    });
    console.log('Packing asar archive');
    asar.createPackage(outputFolder + '\\this_is_a_temporal_folder', outputFullFileName)
    .then(() => {
        console.log('Created secure asar archive');
        console.log('Deleting src directory');
        rimraf(outputFolder + '\\this_is_a_temporal_folder', function () {
            console.log('Done! Have fun.');
        });
    });
});
