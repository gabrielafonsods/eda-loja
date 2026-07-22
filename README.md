# Embalagens Dos Anjos — Sistema de E-commerce e Gerenciamento

Sistema full-stack de e-commerce e gerenciamento desenvolvido para a **Embalagens Dos Anjos**, com loja virtual, gerenciamento de produtos e categorias, processamento de pedidos, controle de estoque e painel administrativo.

## Sobre

O **Embalagens Dos Anjos** foi desenvolvido como uma solução digital para integrar a experiência de compra dos clientes com o gerenciamento interno da loja.

O sistema é dividido em três aplicações principais:

* **Frontend:** loja virtual onde os clientes podem consultar produtos, selecionar variações, adicionar itens ao carrinho e realizar pedidos.
* **Backend:** API REST responsável pelas regras de negócio, autenticação, produtos, categorias, pedidos e controle de estoque.
* **Admin:** painel administrativo utilizado para gerenciar produtos, categorias, pedidos e estoque.

O cliente pode navegar pelo catálogo de produtos, realizar uma busca, filtrar itens por categoria, selecionar suas variações e adicionar produtos ao carrinho. Após finalizar o pedido, o sistema permite encaminhar as informações para o WhatsApp da loja.

O painel administrativo permite o gerenciamento interno da operação, incluindo produtos, categorias, pedidos e estoque.

## Funcionalidades

### Loja Virtual

* Catálogo de produtos
* Busca de produtos
* Filtro por categorias
* Visualização detalhada de produtos
* Produtos com múltiplas variações
* Atributos personalizados de produtos
* Controle de disponibilidade conforme estoque
* Preço por unidade
* Preço por fardo
* Carrinho de compras
* Persistência do carrinho utilizando `localStorage`
* Atualização e remoção de produtos do carrinho
* Integração com WhatsApp para realização de pedidos
* Interface responsiva
* Página institucional "Quem Somos"

### Gerenciamento de Produtos

* Cadastro de produtos
* Edição de produtos
* Exclusão de produtos
* Ativação e desativação de produtos
* Gerenciamento de categorias
* Cadastro de variações
* Gerenciamento de SKU
* Configuração de preço unitário
* Configuração de preço por fardo
* Definição de estoque mínimo
* Controle de estoque por variação
* Gerenciamento de imagens dos produtos

### Gerenciamento de Pedidos

* Criação de pedidos
* Registro de pedidos pendentes
* Confirmação de pedidos
* Cancelamento de pedidos
* Atualização do estoque após confirmação
* Gerenciamento dos itens dos pedidos
* Separação entre pedidos pendentes e vendas confirmadas

### Controle de Estoque

* Controle de estoque por variação de produto
* Reposição manual de estoque
* Registro de movimentações de estoque
* Identificação de produtos com estoque baixo
* Baixa automática de estoque após confirmação da venda
* Controle de estoque em unidades

### Painel Administrativo

* Dashboard administrativo
* Gerenciamento de produtos
* Gerenciamento de categorias
* Gerenciamento de pedidos
* Gerenciamento de estoque
* Reposição de estoque
* Histórico de movimentações
* Relatórios de vendas
* Proteção de rotas administrativas

### Autenticação

* Login administrativo
* Autenticação utilizando JWT
* Proteção de rotas administrativas
* Hash de senhas utilizando `bcryptjs`
* Utilização de variáveis de ambiente para informações sensíveis

## Tecnologias

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* App Router
* Headless UI
* Heroicons
* Sonner

### Backend

* Node.js
* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* JWT
* bcryptjs
* Class Validator
* Class Transformer

### Painel Administrativo

* React
* React Admin
* TypeScript
* Vite
* Material UI
* React Router

### Banco de Dados

* PostgreSQL
* TypeORM

### Ferramentas de Desenvolvimento

* Git
* GitHub
* ESLint
* Prettier
* Jest
* Supertest

## Arquitetura

O projeto utiliza uma arquitetura full-stack dividida em três aplicações independentes que se comunicam através de uma API REST.

```text
eda-loja-main/
│
├── Frontend
│   │
│   │  Next.js + React + TypeScript
│   │
│   └──────────────┐
│                  │
│                  │ API REST
│                  ▼
├── Backend
│   │
│   │  NestJS + TypeORM + JWT
│   │
│   ├──────────────► PostgreSQL
│   │
│   └──────────────► Regras de Negócio
│
└── Admin
    │
    │  React Admin + Vite
    │
    └──────────────► API REST
```

### Frontend

Responsável pela interface da loja virtual e pela experiência de compra dos clientes.

O frontend consome os dados disponibilizados pela API e apresenta:

* Produtos
* Categorias
* Variações
* Busca
* Carrinho
* Processo de realização de pedidos

### Backend

Responsável pela lógica central da aplicação e pela disponibilização da API REST.

Entre suas principais responsabilidades estão:

* Autenticação
* Produtos
* Categorias
* Pedidos
* Estoque
* Movimentações de estoque
* Relatórios

### Painel Administrativo

Responsável pelo gerenciamento interno da loja.

Através do painel administrativo é possível gerenciar:

* Produtos
* Categorias
* Pedidos
* Estoque
* Reposição de estoque
* Movimentações
* Relatórios

## Banco de Dados

O sistema utiliza **PostgreSQL** como banco de dados relacional, com **TypeORM** para comunicação e gerenciamento das entidades.

### Principais Entidades

#### Product

Armazena as informações principais dos produtos disponíveis na loja.

#### Product Variant

Representa as variações específicas de cada produto.

Uma variação pode possuir informações como:

* SKU
* Estoque
* Estoque mínimo
* Preço unitário
* Preço por fardo
* Quantidade de unidades por fardo
* Atributos personalizados

#### Category

Responsável pela organização dos produtos em diferentes categorias.

#### Order

Representa um pedido realizado por um cliente.

Os pedidos podem possuir diferentes status, como:

* `pending`
* `confirmed`
* `cancelled`

#### Order Item

Representa os produtos e variações incluídos em um pedido.

#### Stock Movement

Registra alterações realizadas no estoque, como reposições e saídas decorrentes de vendas confirmadas.

## Estrutura do Projeto

```text
eda-loja-main/
│
├── frontend/
│   ├── app/
│   │   ├── product/
│   │   ├── search/
│   │   ├── quem-somos/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── cart/
│   │   ├── layout/
│   │   └── product/
│   │
│   ├── lib/
│   │   ├── api/
│   │   ├── cart-context.tsx
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   └── package.json
│
├── admin/
│   ├── src/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── stock/
│   │   ├── authProvider.ts
│   │   └── dataProvider.ts
│   │
│   └── package.json
│
└── README.md
```

## Como Executar

### Pré-requisitos

Antes de executar o projeto, certifique-se de possuir instalado:

* Node.js
* npm
* PostgreSQL ou um banco PostgreSQL hospedado
* Git

### 1. Clonar o Repositório

```bash
git clone https://github.com/gabrielafonsods/eda-loja.git
cd eda-loja
```

### 2. Executar o Backend

Acesse o diretório do backend:

```bash
cd backend
npm install
```

Configure as variáveis de ambiente em um arquivo `.env`:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
PORT=3001
JWT_SECRET=sua-chave-secreta
ADMIN_USERNAME=seu-usuario
ADMIN_PASSWORD_HASH=hash-da-senha
```

Execute o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3001
```

### 3. Executar o Frontend

Em outro terminal, acesse o diretório do frontend:

```bash
cd frontend
npm install --legacy-peer-deps
```

Configure as variáveis de ambiente:

```env
COMPANY_NAME="Embalagens Dos Anjos"
SITE_NAME="Embalagens Dos Anjos"
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WHATSAPP_NUMBER=SEU_NUMERO
```

Execute a aplicação:

```bash
npm run dev
```

A loja virtual estará disponível em:

```text
http://localhost:3000
```

### 4. Executar o Painel Administrativo

Em outro terminal, acesse o diretório do painel:

```bash
cd admin
npm install
```

Configure as variáveis de ambiente:

```env
VITE_API_URL=http://localhost:3001
```

Execute o painel:

```bash
npm run dev
```

O painel administrativo estará disponível em:

```text
http://localhost:5173
```

## Autor

**Gabriel Afonso**

* GitHub: [github.com/gabrielafonsods](https://github.com/gabrielafonsods)
