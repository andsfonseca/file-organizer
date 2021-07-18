#!/usr/bin/env node
const fs = require('fs')
const commander = require('commander')
const ora = require('ora');
const chalk = require('chalk');
const figlet = require("figlet")

/**
 * Template Padrão da Aplicação
 */
let defaultTemplate = require('./../default.json');
const { exit } = require('process');

/**
 * Lê os arquivos de uma pasta
 * @param {String} path Caminho da pasta
 * @param {Function} callback Função executado ao finalizar, retorna os arquivos como argumento
 */
const readFolder = (path, callback) => {
    fs.readdir(path, (_err, files) => {
        let onlyFiles = files.filter((file) => fs.statSync(path + '/' + file).isFile())
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

        if (files.length == 1) {
            loader.text = "1 file found.";
        }
        else {
            loader.text = files.length + " files found.";
        }

        loader.succeed();

        console.log(chalk.blue("# Loading Template"));

        //Carrega o Template
        let organization = defaultTemplate;

        if (template) {
            loader.text = "Template loaded.";
            organization = readJSON(template)
        }

        else {
            loader.text = "Default template loaded.";
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
        //Para cada arquivo
        files.forEach(file => {

            const localLoader = ora(file).start();

            //Recupera a extensão
            let extension = getExtension(file)

            //Ignora o arquivo
            if (!dictExtensionFolder[extension] || dictExtensionFolder[extension] == "Ignore") {
                localLoader.text = "File '" + file + "' ignored."
                localLoader.succeed()
                return;
            };

            //Cria a pasta
            createFolder(path, dictExtensionFolder[extension])

            //Move o Arquivo
            moveFile(path, path + "/" + dictExtensionFolder[extension], file, (error) => {
                if (error) {
                    localLoader.text = "Unable to move file '" + file + "', access denied!"
                    localLoader.fail()
                }
                else {
                    localLoader.text = "File '" + file + "' moved successfully."
                    localLoader.succeed()
                }
            })

        });

    });

}

const cli = () => {
    commander.version('1.0.0')
        .name('file-organizer')
        .description('A simple file organizer by extension and groups.')
        .option('-p, --path [folder]', 'Directory of the path to be organized', '.')
        .option('-t, --template [json]', 'Directory of the path to be organized')
        .action((args) => {
            let path = args.path
            let template = args.template
            organizeFolder(path, template)
        })
        .parse(process.argv)
}

cli();



