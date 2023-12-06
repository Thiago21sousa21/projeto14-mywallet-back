
# MyWallet API
Bem-vindo ao MyWallet API, uma aplicação que gerencia seus gastos de forma eficiente. Esta API oferece funcionalidades para cadastro de usuário, login, criação de novas transações e visualização do histórico de transações com saldo atual.

# Como Rodar o Projeto
Certifique-se de ter o Node.js instalado em sua máquina. Clone este repositório e, no diretório do projeto, execute o seguinte comando para instalar as dependências:

* npm install
* Em seguida, para iniciar o servidor em modo de desenvolvimento, utilize o seguinte comando:

* npm run dev
* O servidor será iniciado e estará disponível em http://localhost:5000

# Rotas
## Cadastro de Usuário
### Rota: POST /cadastro
* Descrição: Cria uma nova conta de usuário.
* Parâmetros:
email (string): Email de usuário único.
name (string): Nome de usuário.
password (string): Senha para a conta.

## Login
### Rota: POST /
* Descrição: Realiza o login do usuário.
* Parâmetros:
email (string): Nome de usuário.
password (string): Senha da conta.

## Nova Transação
###  Rota: POST /nova-transacao/:typeTransaction
Descrição: Realiza uma nova transação, seja de entrada ou saída, com uma descrição associada.
Parâmetros:
typeTransaction (string): Tipo de transação, podendo ser "entrada" ou "saida".
Corpo da Requisição:
description (string): Descrição da transação.
## Home - Histórico de Transações
Rota: GET /home
Descrição: Retorna todas as transações do usuário com descrição e saldo atual.
Parâmetros: Nenhum.
# Deploy
O MyWallet API está atualmente disponível para acesso via https://projeto14-mywallet-back-gvuz.onrender.com/.

Fique à vontade para explorar e utilizar a API para gerenciar seus gastos de forma eficaz!