# File Organizer ![complete](https://camo.githubusercontent.com/facfcb6afd684d2c9701c7d6add65f391fdf86fc/68747470733a2f2f696d672e736869656c64732e696f2f636f6465636f762f632f6769746875622f6477796c2f686170692d617574682d6a7774322e7376673f6d61784167653d32353932303030) <img src="https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=red" alt="Star Badge"/> <a href="https://github.com/andsfonseca/file-organizer/graphs/contributors"> <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/andsfonseca/file-organizer?color=yellow"></a> [![npm](https://img.shields.io/npm/v/@andsfonseca/file-organizer)](https://www.npmjs.com/package/@andsfonseca/file-organizer) <a href="https://github.com/andsfonseca/file-organizer" target="_blank"> <img alt="Code" src="https://img.shields.io/badge/-code-494a4b?logo=Plex&logoColor=3aa9ec"></a>






```
  _____   _   _                                                         _
 |  ___| (_) | |   ___            ___    _ __    __ _    __ _   _ __   (_)  ____   ___   _ __ 
 | |_    | | | |  / _ \  _____   / _ \  | '__|  / _` |  / _` | | '_ \  | | |_  /  / _ \ | '__|
 |  _|   | | | | |  __/ |_____| | (_) | | |    | (_| | | (_| | | | | | | |  / /  |  __/ | |
 |_|     |_| |_|  \___|          \___/  |_|     \__, |  \__,_| |_| |_| |_| /___|  \___| |_|
                                                |___/
```

Código criado com o intuito de ajudar pessoas a organizar suas pastas do computador.
## O que é?

Um simples organizador de arquivos por extensão e grupo.


## Instalação

Instale o pacote globalmente através do repositório npmjs.com.

```shell
npm i @andsfonseca/file-organizer -g
```

## Uso
Abra o terminal como administrador e execute:

Para organizar a pasta atual use o comando:

```shell
file-organizer
```
Para organizar uma pasta a partir de um caminho:

```shell
file-organizer -p <path>
```
Para personalizar como as pastas serão criadas, o usuário pode escolher entre as seguintes opções:

```shell
file-organizer -t <default | extension | path>
```

* `default`: usa o padrão da aplicação;
* `extension`: agrupa os arquivos por extensão;
* `path`: caminho para um json personalizado;

Modelo do json para criação de pastas customizadas:

```json
{
  "nomeDaPasta": [
    ".extensaoDoArquivo",
    ".ext",
    ".example"
  ],
  "outraPasta": [
    ".extensao",
    ".doc",
    ".mp3"
  ]
}
```

> Caso nada seja informado o valor padrão será `default` que carregará o JSON [default.json](default.json)