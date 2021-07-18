#!/usr/bin/env node
const fs = require('fs')
const commander = require('commander')
const path = require('path')

/**
 * Tarefas a ser implementadas
 * 
 * 1. Ler os arquivos da pasta onde é executado. OK
 * 2. Ler os argumentos da linha de comando OK
 * 3. Mover e Renomear Arquivos
 * 4. Criar pastas OK
 * 5. Ler um JSON
 * 6. Criar um Template de Organização de Arquivos (Imagens, Videos, Executáveis, etc)
 * 7. Recuperar a extensão de um arquivo
 * 8. Lógica Final
 */

/**
 * Lê os arquivos de uma pasta
 * @param {String} path Caminho da pasta
 * @returns Retorna uma lista em String dos arquivos de uma pasta
 */
const readFolder = (path) => {
    let files = fs.readdirSync(path)
    let onlyFiles = files.filter((file) => fs.statSync(path + '/' + file).isFile())
    return onlyFiles
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
 * @returns Verdadeiro se conseguiu mover, falso se não conseguiu
 */
const moveFile = (path, newPath, filename) => {
    try {
        fs.renameSync(path + "/" + filename, newPath + "/" + filename)
        return true;
    }
    catch (e) {
        return false;
    }
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


const organizeFolder = (path) => {
    console.log(readJSON("default.json").Images)
    // moveFile(path, path + "/" + "teste", "dasd")
}


const cli = () => {
    commander.version('1.0.0')
        .name('file-organizer')
        .description('A simple file organizer by extension and groups.')
        .option('-p, --path [folder]', 'Directory of the path to be organized', '.')
        .action((args) => {
            let path = args.path
            organizeFolder(path)
        })
        .parse(process.argv)
}

cli();



