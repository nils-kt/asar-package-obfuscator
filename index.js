const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");
const rimraf = require("rimraf");
const { createPackage: createAsar, extractAll: extractAsar } = require("asar");
const javaScriptObfuscator = require("javascript-obfuscator");
const log = require("ololog").configure({});

const toIgnore = ["node_modules", "app"];
const argv = require("yargs")
  .command("$0 <input> [output]", "Obfuscate <input> ASAR file", (yargs) => {
    yargs
      .positional("input", {
        describe: "input ASAR file to be obfuscated",
        demandOption: true,
      })
      .option("output", {
        alias: "o",
        description: "output ASAR file",
        default: null,
      });
  })
  .argv;

const asarFullFileName = path.normalize(argv.input);
const outputFullFileName = argv.output
  ? path.normalize(argv.output)
  : `${asarFullFileName}.new`;
const outputFolder = path.dirname(outputFullFileName);
const tempFolder = `${outputFolder}\\temp_folder`;

log.lightGray("asar package javascript obfuscator");
log.dim("-----------------------------------");

log.blue.info("Unpacking archive");

extractAsar(asarFullFileName, tempFolder)
  .then(() => recursive(tempFolder, toIgnore))
  .then((files) =>
    Promise.all(
      files.map((file) => {
        if (path.extname(file) === ".js") {
          log.green(`Protecting ${file}`);
          const code = fs.readFileSync(file, "utf8");
          const obfuscatedCode = javaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: false,
          });
          fs.writeFileSync(file, obfuscatedCode.getObfuscatedCode());
        }
      })
    )
  )
  .then(() => {
    log.blue.info("Packing asar archive");
    return createAsar(tempFolder, outputFullFileName);
  })
  .then(() => {
    log.blue.info("Created secure asar archive");
    log.blue.info("Deleting src directory");
    return rimraf(tempFolder);
  })
  .then(() => {
    log.green.info("Done! Have fun.");
  })
  .catch((error) => {
    log.red.error(`Error!: ${error.message}`);
  });
