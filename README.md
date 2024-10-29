# JSON Hierarchy Manager

Esse é um projeto de 2 partes: CLI e Frontend. O Cli é um analizador de arquivos JSON. O Front end é um criador de arquivos JSON em árvore.

## CLI

### Como Usar

```bash
Usage: JSON Hierarchy Manager [options] [command]

CLI to analyse JSON trees

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  analyze [options] <phrase>  Analisa a frase e exibe os itens por nível de profundidade.
  help [command]              display help for command
```

### Exemplos

```bash
bun run cli.ts analyze -d 2 "Eu amo papagaios" -v
bun run cli.ts analyze -d 3 "Eu vi gorilas e papagaios"
bun run cli.ts analyze -d 5 "Eu tenho preferência por animais carnívoros"
```

### Testes

```bash
bun test
```

## Frontend

### Como usar

```bash
# Instalar o bun 
# # Linux ou MacOS:
curl -fsSL https://bun.sh/install | bash
# # Windows:
powershell -c "irm bun.sh/install.ps1 | iex"
# Instalar dependencias
bun install
# Rodar Projeto
bun dev
```

## Como usar os arquivos JSON gerados pelo Frontend no CLI

Substitua manualmente o arquivo /dict/hierarchy.json pelo arquivo gerado no frontend.

Aviso: Isso vai quebrar os testes.
