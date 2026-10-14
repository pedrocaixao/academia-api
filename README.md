# API REST – Academia (recurso: aluno)

API em Node.js + Express com MySQL/MariaDB. Recurso principal: **aluno** (`id`, `nome`, `telefone`, `plano`).

Tecnologias: Node.js, Express, nodemon, morgan, body-parser, CORS, módulo `mysql`, MariaDB/MySQL.

## Estrutura

```
academia-api/
├── server.js            # sobe o servidor (porta 3000)
├── app.js               # configura o Express, middlewares e rotas
├── config/db.js         # pool de conexões + helper de query com binding
├── routes/aluno.js      # CRUD de aluno
├── database/schema.sql  # criação do banco e da tabela
├── postman/             # coleção do Postman pronta para importar
├── docker-compose.yml   # (opcional) banco via Docker
└── package.json         # lista de dependências
```

## Passo a passo para rodar (do zero)

Você precisa de duas coisas instaladas: **Node.js** e um **banco MySQL/MariaDB**. As bibliotecas do projeto (Express, mysql, etc.) são instaladas todas de uma vez com um único comando, pois estão listadas no `package.json`.

### 1. Instalar o Node.js
Baixe a versão LTS em https://nodejs.org e instale (próximo, próximo, concluir). Para conferir, abra um terminal e rode `node -v`.

### 2. Ter um banco MySQL/MariaDB rodando (escolha UMA opção)

**Opção A – XAMPP (mais fácil, sem Docker)**
1. Baixe e instale o XAMPP: https://www.apachefriends.org
2. Abra o painel do XAMPP e clique em **Start** na linha do **MySQL** (o Apache não é necessário).
3. Clique em **Admin** na linha do MySQL (abre o phpMyAdmin).
4. Na aba **Importar**, escolha o arquivo `database/schema.sql` deste projeto e clique em **Importar/Executar**.

O XAMPP vem com o usuário `root` sem senha, que é exatamente o padrão que o projeto usa.

**Opção B – Docker (se já tiver Docker instalado)**
```bash
docker compose up -d
```
Isso sobe um MariaDB já com o banco `academia` e a tabela `aluno` criados.

**Opção C – MySQL/MariaDB já instalado na máquina**
```bash
mysql -u root -p < database/schema.sql
```

### 3. Instalar as dependências e iniciar a API
Abra um terminal **dentro da pasta do projeto** e rode:
```bash
npm install
npm start
```
Se aparecer `API da academia rodando em http://localhost:3000`, está funcionando.

> Se o seu MySQL tiver senha no `root`, defina antes de iniciar (ou edite `config/db.js`):
> - Windows (PowerShell): `$env:DB_PASSWORD="suasenha"; npm start`
> - Linux/macOS: `DB_PASSWORD=suasenha npm start`

### 4. Testar no Postman
1. No Postman, clique em **Import** e selecione `postman/academia-api.postman_collection.json`.
2. A coleção **API Academia - Aluno** traz uma requisição para cada rota (e dois exemplos de erro). A URL base fica na variável `baseUrl` (`http://localhost:3000`).
3. Para as requisições POST, o corpo já vem preenchido (JSON).

## Endpoints

| Método | Rota          | Descrição              | Sucesso |
|--------|---------------|------------------------|---------|
| GET    | `/aluno`      | Lista todos os alunos  | 200     |
| GET    | `/aluno/:id`  | Busca um aluno         | 200     |
| POST   | `/aluno`      | Cria um aluno          | 201     |
| PUT    | `/aluno/:id`  | Atualiza um aluno      | 200     |
| DELETE | `/aluno/:id`  | Remove um aluno        | 200     |

Corpo (JSON) para criar/atualizar:

```json
{ "nome": "Ana Souza", "telefone": "(62) 99999-1111", "plano": "Mensal" }
```

## Códigos de erro

- `400` – id inválido, JSON inválido ou campos obrigatórios ausentes
- `404` – aluno ou rota não encontrados
- `503` – banco de dados indisponível (erro de conexão)
- `500` – erro interno

Todas as respostas são em JSON. Erros seguem o formato `{ "erro": "mensagem" }`.

## Segurança

Todas as queries usam *parameter binding* (`?`), evitando SQL injection.
