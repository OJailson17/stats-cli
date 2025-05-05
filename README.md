# 📊 Stats CLI

`Stats CLI` é uma aplicação de linha de comando (CLI) pra uso pessoal construída com **Node.js** e **TypeScript** para importar dados estruturados de arquivos CSV para um banco de dados **PostgreSQL**.

## 🚀 Funcionalidades

- Importa dados de arquivos CSV diretamente para o banco de dados PostgreSQL
- Tipos de dados suportados:
  - 💸 Dados financeiros (incomes, expenses, transfers)
  - 📚 Dados de estudos (logs de seções de estudos de assuntos gerais contendo duração, data, assunto, etc.)
  - 🌍 Dados de aprendizado de idiomas (logs de seções de estudos especificamente de idiomas)
- Gerenciamento de dados via CLI:
  - Criar registros iniciais
  - Listar dados existentes
  - Resetar tabelas específicas

## 📦 Tecnologias Utilizadas

- Node.js
- TypeScript
- PostgreSQL
- Leitor de CSV (`csv-parser`)
- pg (Postgres client)

## 👨🏻‍💻 Usage

Se você tiver algum interesse em usar ou adaptar pra uso próprio, basta seguir os passos seguintes

## 🛠 Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/OJailson17/stats-cli
   cd stats-cli
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` com base no `.env.example`, preenchendo os dados de conexão com seu banco PostgreSQL.
   <br>

4. **Compile o projeto**

   ```bash
   npm run build
   ```

5. **Execute a CLI**

   ```bash
   node dist/index.js
   ```

<br>

> Ou use `tsx` durante o desenvolvimento:

```bash
npx tsx src/bin/cli.ts
```

## 📂 Formato dos Arquivos CSV

Cada arquivo CSV deve conter cabeçalhos compatíveis com os campos esperados para o tipo de dado correspondente. Eles geralmente são gerados por outras aplicações de onde vem cada tipo de dado, e pra facilitar, não há modificação em seus campos. Os arquivos são simplesmente exportados do seu respectivo app e só é necessário realizar a importação através da CLI. Exemplos da estrutura desses arquivos podem ser encontrados no diretório `/examples`.

## 🧭 Comandos da CLI

Os arquivos serão buscados em um diretório especifico para que na linha de comando só seja necessário digitar o nome do arquivo **sem extensão**.
O caminho pode ser alterado no arquivo `utils/shared.ts`

```bash
# Importar dados
cli import finances incomes expenses transfers
cli import studies dados_estudos
cli import languages dados_idiomas

# Listar dados
cli list accounts
cli list account account_name

# Criar as contas no banco de dados com os balanços iniciais
cli create accounts

# Resetar  as contas limpando também todas as transações associadas à ela
cli reset accounts
```

## 📖 Licença

Este projeto está licenciado sob a Licença MIT.
