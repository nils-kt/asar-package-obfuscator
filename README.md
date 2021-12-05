# Asar Package (JavaScript) Obfuscator
Obfuscate all .js files in an asar archive.

![Code Quality Store](https://api.codiga.io/project/30341/score/svg)

### How it works?
It is very simple, but effective! Depending on how you setup the obfuscator.  
The packed asar archive will be unpacked, obfuscated and packed back into the archive. And all this is completely automated.

### Usage
`Important: This is not a finished package, it should be seen as a development tool.`

The usage is very simple. For example, if we have our app.asar from Electron:
```text
node index.js "../app.asar"
```

Optionally, we can also specify the output folder.
```text
node index.js "../app.asar" -o "../dist"
```

### Thanks!
At this point many thanks to [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).
