#!/usr/bin/env node
const fs = require('fs')
const commander = require('commander')

/**
 * Tarefas a ser implementadas
 * 
 * 1. Ler os arquivos da pasta onde é executado.
 * 2. Ler os argumentos da linha de comando
 * 3. Mover e Renomear Arquivos
 * 4. Criar pastas
 * 5. Ler um JSON
 * 6. Criar um Template de Organização de Arquivos (Imagens, Videos, Executáveis, etc)
 * 7. Lógica Final
 */
const readFolder = (path) => {
    let files = fs.readdirSync(path)
    let onlyFiles = files.filter((file) => fs.statSync(path + '/' + file).isFile())
    return onlyFiles
}

const createFolder = (path, folderName) => {
    let temp = path + "/" + folderName
    if (!fs.existsSync(temp)){
        fs.mkdirSync(temp)
    }
}

const main = (path) => {
    console.log(createFolder(path, "foi"))
    
}

commander
.version('1.0.0')
.name('file-organizer')
.description('A simple file organizer by extension and groups.')
.option('-p, --path [folder]', 'Directory of the path to be organized', '.')
.action((args) => {
    main(args.path)
})
.parse(process.argv)

