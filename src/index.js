#!/usr/bin/env node
const fs = require('fs')
const commander = require('commander')
const ora = require('ora');
const chalk = require('chalk');
const figlet = require("figlet")

/**
 * Template Padrão da Aplicação
 */
const defaultTemplate = require('./../default.json');

/**
 * Informações do Projeto armazenadas no package.json
 */
const PROJECT_SETTINGS = require("./../package.json");

/**
 * Lê os arquivos de uma pasta
 * @param {String} path Caminho da pasta
 * @param {Function} callback Função executado ao finalizar, retorna os arquivos como argumento
 */
const readFolder = (path, callback) => {
    fs.readdir(path, (_err, files) => {
        //Apenas arquivos e apenas arquivos com uma extensão
        let onlyFiles = files.filter((file) => fs.statSync(path + '/' + file).isFile() && file.includes('.'))
        callback(onlyFiles)
    });
}

/**
 * Cria uma pasta com um nome especificado no caminho informado.
 * @param {String} path Caminho da pasta
 * @param {String} folderName Nome da pasta
 */
const createFolder = (path, folderName) => {
    let temp = path + "/" + folderName
    if (!fs.existsSync(temp)) {
        fs.mkdirSync(temp)
    }
}

/**
 * Mover arquivos de um caminho para outro caminho
 * @param {String} path Caminho Original
 * @param {String} newPath Caminho de destino
 * @param {String} filename Nome do Arquivo
 * @param {Function} callback Função executado ao finalizar, retorna um boolena verdadeiro para erro
 */
const moveFile = (path, newPath, filename, callback) => {
    fs.rename(path + "/" + filename, newPath + "/" + filename, callback)
}

/**
 * Lê um JSON e retorna como um dicionário
 * @param {String} filepath Caminho do Json
 * @returns Um dicionário
 */
const readJSON = (filepath) => {
    let rawdata = fs.readFileSync(filepath);
    let json = JSON.parse(rawdata);
    return json
}

/**
 * Retorna a extensão do Arquivo
 * @param {String} filename Nome do Arquivo
 * @returns Extensão do Arquivo
 */
const getExtension = (filename) => {
    return "." + filename.split('.').pop().toLowerCase();
}

/**
 * Realiza a função 'distinct', onde todos os elementos dentro dele são únicos
 * @param {Array} array Array Original
 * @returns Retorna um Array onde todos os elementos são únicos
 */
const distinct = (array) => {
    return array.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}

/**
 * Organiza uma pasta com o template informado
 * @param {String} path Caminho da Pasta
 * @param {String} template Template usado para Organização
 */
const organizeFolder = (path, template) => {

    console.log(chalk.yellow(
        figlet.textSync('File-organizer', { horizontalLayout: 'full' })
    ))

    console.log(chalk.blue("# Reading the files"));
    const loader = ora('Reading folder...').start();

    //Recupera a Lista de Arquivos
    readFolder(path, (files) => {
        let size = files.length
        if (size == 1) {
            loader.text = "1 file found.";
        }
        else {
            loader.text = size + " files found.";
        }

        loader.succeed();

        console.log(chalk.blue("# Loading Template"));

        //Carrega o Template
        let organization = defaultTemplate;

        switch (template) {
            case "default":
                loader.text = "Default template loaded.";
                break;
            case "extension":
                extensions = distinct(files.map(file => getExtension(file).toLowerCase()))

                organization = {}
                extensions.forEach(ext => {
                    organization[ext] = [ext]
                });
                loader.text = "Extension template loaded.";
                break;
            default:
                organization = readJSON(template)
                loader.text = "Template loaded.";
                break;
        }

        //Cria um dicionário "Extensão" -> Pasta
        let dictExtensionFolder = {}

        for (const [key, value] of Object.entries(organization)) {
            value.forEach(extension => {
                dictExtensionFolder[extension] = key
            });
        }

        loader.succeed();

        console.log(chalk.blue("# Moving files"));

        const localLoader = ora("Moving...").start();

        let count = 0;

        //Para cada arquivo
        files.forEach(file => {

            //Recupera a extensão
            let extension = getExtension(file)

            //Ignora o arquivo
            if (!dictExtensionFolder[extension] || dictExtensionFolder[extension] == "Ignore") {
                count += 1;
                localLoader.text = "File '" + file + "' ignored."
                localLoader.succeed()
                if (count != size) {
                    localLoader.text
                    localLoader.start()
                }
                return;
            };

            //Cria a pasta
            createFolder(path, dictExtensionFolder[extension])

            //Move o Arquivo
            moveFile(path, path + "/" + dictExtensionFolder[extension], file, (error) => {
                count += 1;
                if (error) {
                    localLoader.text = "Unable to move file '" + file + "', access denied!"
                    localLoader.fail()

                }
                else {
                    localLoader.text = "File '" + file + "' moved successfully."
                    localLoader.succeed()
                }

                if (count != size) {
                    localLoader.text = "Moving..."
                    localLoader.start()
                }
            })

        });

    });

}

const cli = () => {
    let program = commander.version(PROJECT_SETTINGS.version)
        .name('file-organizer')
        .description(PROJECT_SETTINGS.description)
        .option('-p, --path [folder]', 'Directory of the path to be organized', '.')
        .option('-t, --template [json]', 'Folder organization type: \'default\' uses application default, \'extension\' organizes files by extension and \'path\' loads a custom JSON for organization ', "default")
        .action((args) => {
            let path = args.path
            let template = args.template
            organizeFolder(path, template)
        })
    
    program.addHelpText('before', chalk.yellow(
        figlet.textSync('File-organizer', { horizontalLayout: 'full' })
    ));
    
    program.parse(process.argv)
}

cli();



