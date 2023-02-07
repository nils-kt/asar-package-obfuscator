# JavaScript Obfuscator for ASAR Archives

A script that protects JavaScript files within an ASAR archive using JavaScript Obfuscator.

## Prerequisites
- Node.js
- npm modules: fs, path, recursive-readdir, rimraf, asar, javascript-obfuscator, ololog, yargs

## Usage
1. Clone or download the repository.
2. Install required npm modules with `npm install`.
3. Run the script with `node index.js [input-asar-file] [output-asar-file]`.
   - `input-asar-file`: ASAR archive to be protected.
   - `output-asar-file`: name of the protected ASAR archive (optional, default: input-asar-file with '.new' suffix).
4. Protected ASAR archive will be created.

## Details
- All JavaScript files within the ASAR archive will be protected.
- The output file will be in the same directory as the input file.
- A temporary directory will be created and deleted after completion.
- Error messages will be displayed in the terminal/command line.

This script is meant to be used as a development tool.
