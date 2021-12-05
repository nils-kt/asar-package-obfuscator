const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const rimraf = require('rimraf');
const {createPackage, extractAll} = require('asar');
const javaScriptObfuscator = require('javascript-obfuscator');
const log = require('ololog').configure({});

//Set folders to ignore
const toIgnore = ['node_modules', 'app'];

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
const asarFullFileName = path.normalize(argv.input);
const outputFullFileName = (argv.output) ? path.normalize(argv.output) : asarFullFileName + ".new";
const outputFolder = path.dirname(outputFullFileName);


log.lightGray.noLocate('asar package javascript obfuscator');
log.dim.noLocate("-----------------------------------");
log.blue.info.noLocate('Unpacking archive');

try {
    extractAll(asarFullFileName, `${outputFolder}\\temp_folder`);
} catch (err) {
    log.red.error.noLocate(err.message);
    return;
}

recursive(`${outputFolder}\\temp_folder`, toIgnore, function (err, files) {
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            const contents = fs.readFileSync(file, 'utf8');
            log.green.noLocate('Protecting ' + file);

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
            fs.writeFileSync(file, ret.getObfuscatedCode());
        }
    });
    log.blue.info.noLocate('Packing asar archive');
    createPackage(`${outputFolder}\\temp_folder`, outputFullFileName)
        .then(() => {
            log.blue.info.noLocate('Created secure asar archive');
            log.blue.info.noLocate('Deleting src directory');
            rimraf(`${outputFolder}\\temp_folder`, function () {
                log.green.info.noLocate('Done! Have fun.');
            });
        }).catch(err => {
        log.red.error.noLocate('Error!', err.message);
        return;
    });
});
