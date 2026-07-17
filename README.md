# eda-frontend

Site da **Embalagens Dos Anjos** — catálogo de produtos com carrinho e
finalização de pedido pelo WhatsApp. Construído em cima do template
[Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce),
com a integração de e-commerce da Shopify removida e substituída pela
conexão com o `eda-backend`.

## O que esse site faz

- Mostra o catálogo de produtos (com variações: cor, número, sabor, e
  opção de compra por unidade ou fardo)
- Carrinho de compras (sem pagamento online): o cliente monta o pedido e
  envia tudo de uma vez pelo WhatsApp
- Página "Quem Somos"

## Stack

- **Next.js** (App Router)
- **Tailwind CSS v4**
- Fontes: **Poppins** (texto) e **Caveat** (destaques manuscritos)

## Identidade visual

Paleta e tipografia extraídas da logo real da marca: fundo pêssego, tons
terracota, texto em marrom escuro. Ver `app/globals.css` para os tokens de
cor (`--color-cream`, `--color-peach`, `--color-terracotta`, etc.).

## Rodando localmente

```bash
npm install --legacy-peer-deps
```

Crie um arquivo `.env` na raiz com:

```
COMPANY_NAME="Embalagens Dos Anjos"
SITE_NAME="Embalagens Dos Anjos"
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WHATSAPP_NUMBER=5513981405154
```

```bash
npm run dev
```

Abre em `http://localhost:3000`. Requer o `eda-backend` rodando (porta 3001)
para carregar produtos de verdade.

## Como o pedido chega no WhatsApp

1. Cliente adiciona produtos ao carrinho (escolhendo unidade ou fardo)
2. Ao clicar em "Enviar pedido pelo WhatsApp", o carrinho é salvo no
   backend como um pedido `pending` (`POST /orders`)
3. Em seguida, abre o WhatsApp com uma mensagem já pronta, listando todos
   os itens
4. A confirmação da venda (que desconta o estoque) acontece depois, pelo
   admin — este site nunca mexe em estoque diretamente

## Estrutura principal

```
app/
  page.tsx              → home (hero + grade de produtos)
  quem-somos/page.tsx    → página institucional
  product/[handle]/      → página de produto
  search/                → catálogo com filtro por categoria
components/
  cart/                  → carrinho (contexto, modal, botão adicionar)
  layout/navbar/         → topo do site
  layout/footer.tsx       → rodapé
lib/
  api/                   → conexão com o eda-backend (substitui lib/shopify)
  cart-context.tsx       → estado do carrinho (localStorage)
```
