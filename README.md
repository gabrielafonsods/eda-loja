# eda-backend

API do sistema de gerenciamento da **Embalagens Dos Anjos**. Construída com
[NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) + PostgreSQL
(hospedado no [Neon](https://neon.tech)).

## O que esse projeto faz

Serve os dados de produtos, estoque e pedidos tanto para o site da loja
(`eda-frontend`) quanto para o painel de gerenciamento (`eda-admin`).

## Stack

- **NestJS** (Node.js/TypeScript)
- **TypeORM** com **PostgreSQL**
- Autenticação via **JWT** (rotas administrativas protegidas)

## Rodando localmente

```bash
npm install
```

Crie um arquivo `.env` na raiz com:

```
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/banco?sslmode=require
PORT=3001
JWT_SECRET=uma-string-aleatoria-bem-grande
ADMIN_USERNAME=escolha-um-usuario
ADMIN_PASSWORD_HASH=hash-gerado-com-bcrypt
```

```bash
npm run start:dev
```

A API sobe em `http://localhost:3001`.

## Modelo de dados

### Produtos e variações

Um **Produto** (ex: "Copo Descartável 200ml") pode ter várias **Variações**
(ex: diferentes cores). Cada variação guarda:

- Estoque **sempre em unidades** (mesmo que o item também seja vendido em fardo)
- Preço por unidade (`unitPrice`)
- Opcionalmente, preço e tamanho do fardo (`fardoPrice`, `fardoSize`) — vender
  1 fardo desconta `fardoSize` unidades do mesmo estoque, não um estoque à parte
- Atributos livres (`attributes`), tipo `{ "Cor": "Azul", "Sabor": "Menta" }`

### Pedidos

Quando um cliente manda o carrinho pelo WhatsApp, o site cria um **Pedido**
com status `pending` — só um registro, sem mexer no estoque ainda. No admin,
alguém confirma (`confirmed`, desconta o estoque de verdade) ou cancela
(`cancelled`) o pedido.

### Movimentação de estoque

Toda saída (venda confirmada) ou entrada (reposição manual) de estoque fica
registrada, alimentando os relatórios.

## Principais rotas

| Rota | Método | Acesso | O que faz |
|---|---|---|---|
| `/products` | GET | Público | Lista produtos |
| `/products/:id` | GET | Público | Detalhe de um produto |
| `/products` | POST | Admin | Cria produto |
| `/products/:id` | PATCH | Admin | Edita produto |
| `/products/:id` | DELETE | Admin | Remove produto |
| `/products/low-stock` | GET | Admin | Variações com estoque baixo |
| `/orders` | POST | Público | Cria pedido pendente (usado pelo site) |
| `/orders` | GET | Admin | Lista pedidos |
| `/orders/:id/confirm` | PATCH | Admin | Confirma venda (desconta estoque) |
| `/orders/:id/cancel` | PATCH | Admin | Cancela pedido |
| `/stock/:variantId/restock` | POST | Admin | Registra entrada de estoque |
| `/stock/movements` | GET | Admin | Histórico de movimentações |
| `/reports/sales` | GET | Admin | Total vendido por período (`?period=day\|week\|month\|year`) |
| `/auth/login` | POST | Público | Login do admin (retorna token JWT) |

## Segurança

- A `DATABASE_URL` nunca deve ser commitada — fica só no `.env` (já no
  `.gitignore`). Se algum dia vazar, troque a senha no painel do Neon
  imediatamente.
- Rotas administrativas exigem um token JWT (obtido via `/auth/login`),
  enviado no header `Authorization: Bearer <token>`.
