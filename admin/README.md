# eda-admin

Painel de gerenciamento da **Embalagens Dos Anjos**, para cadastrar
produtos, controlar estoque e acompanhar pedidos e vendas. Construído com
[react-admin](https://marmelab.com/react-admin/).

## O que esse painel faz (ou vai fazer)

- ✅ Cadastrar, editar e remover produtos (com variações: cor, número,
  sabor, preço por unidade e por fardo, estoque)
- 🚧 Login (em construção) — acesso restrito
- 🚧 Ver e confirmar/cancelar pedidos recebidos pelo site
- 🚧 Relatórios de vendas por dia/semana/mês/ano

## Stack

- **React-admin** + **Vite** + **TypeScript**
- Conecta direto na API do `eda-backend` via um Data Provider próprio
  (não usa o formato padrão do react-admin, porque a API não segue a
  convenção REST que ele espera de fábrica)

## Rodando localmente

```bash
npm install
```

Crie um arquivo `.env` na raiz com:

```
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

Abre em `http://localhost:5173`. Requer o `eda-backend` rodando (porta 3001).

## Estrutura principal

```
src/
  App.tsx           → registra os recursos (Produtos, e futuramente Pedidos)
  dataProvider.ts    → conecta o react-admin nas rotas do eda-backend
  products/          → telas de listar/criar/editar produtos
```

## Sobre o cadastro de produtos

Cada variação de produto tem 3 campos de atributo fixos — **Cor**,
**Número** e **Sabor** — que cobrem os casos reais do catálogo da loja
(balões com cor, descartáveis numerados, itens com sabor). Deixe em
branco os que não se aplicam.

Estoque é sempre lançado **em unidades**, mesmo para itens vendidos em
fardo — o campo "Un. por fardo" só serve pra calcular quanto desconta do
estoque quando alguém compra um fardo fechado.

## Nota histórica

Esse repositório foi recriado do zero com `npm create react-admin@latest`.
A versão anterior tinha sido criada por engano a partir do código-fonte
completo do framework react-admin (não um app usando ele), por isso foi
descartada.
