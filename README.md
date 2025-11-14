# ASAR Package Obfuscator

A powerful tool for protecting JavaScript code in ASAR archives through advanced code obfuscation.

## Overview

ASAR Package Obfuscator automatically extracts JavaScript files from ASAR archives, obfuscates them using JavaScript Obfuscator, and repackages them into a new, protected archive. Ideal for Electron applications where source code needs protection against reverse engineering.

## Prerequisites

- **Node.js** (version 12 or higher recommended)
- **NPM Modules:**
  - `fs` (built-in)
  - `path` (built-in)
  - `recursive-readdir`
  - `rimraf`
  - `asar`
  - `javascript-obfuscator`
  - `ololog`
  - `yargs`

## Installation

```bash
git clone https://github.com/nils-kt/asar-package-obfuscator.git
cd asar-package-obfuscator
npm install
```

## Usage

### Basic Syntax

```bash
node index.js <input-asar-file> [output-asar-file]
```

### Parameters

- **`input-asar-file`** (required): Path to the ASAR file to be protected
- **`output-asar-file`** (optional): Name of the protected output file
  - Default: `[originalname].new.asar`

### Examples

```bash
# Simple usage with automatic output name
node index.js app.asar

# With custom output name
node index.js app.asar app-protected.asar
```

## How It Works

1. **Extraction**: The ASAR archive is unpacked into a temporary directory
1. **Obfuscation**: All JavaScript files are protected using JavaScript Obfuscator
1. **Repackaging**: The obfuscated files are packed into a new ASAR archive
1. **Cleanup**: Temporary files are automatically deleted

## Features

- ✅ Automatic detection of all JavaScript files in the archive
- ✅ Recursive processing of subdirectories
- ✅ Output in the same directory as the input file
- ✅ Automatic cleanup of temporary files
- ✅ Detailed error output for troubleshooting
- ✅ Command-line interface with argument parsing

## Important Notes

- **Development Tool**: This script is designed as a development tool
- **Backup**: Always create a backup of the original ASAR file
- **Performance**: Obfuscation can take some time for large projects
- **Testing**: Thoroughly test the protected application, as obfuscation can rarely lead to issues

## Troubleshooting

All error messages are displayed in the console. Common issues:

- **File not found**: Check the path to the ASAR file
- **Permission errors**: Ensure the script has read and write permissions
- **Missing modules**: Run `npm install` again

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[ISC License](https://github.com/nils-kt/asar-package-obfuscator/blob/master/LICENSE)

## Author

**Nils Kleinert**

## Disclaimer

This tool is intended for legitimate protection of your own applications. Always respect software licenses and intellectual property rights.​​​​​​​​​​​​​​​​