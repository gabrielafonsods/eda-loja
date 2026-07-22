import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import Footer from "components/layout/footer";
import { getProducts } from "lib/api";
import Image from "next/image";
import { Suspense } from "react";

export const metadata = {
  description:
    "Embalagens e descartáveis no atacado para sua loja, comércio ou festa.",
  openGraph: { type: "website" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <section
        id="produtos"
        className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-20 pt-12"
      >
        <h2 className="mb-6 text-3xl font-semibold text-ink">
          Nossos produtos
        </h2>
        <Suspense
          fallback={
            <div className="py-12 text-center text-ink/60">
              Carregando produtos...
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </section>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-peach-dark bg-peach">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col items-center gap-6 px-4 py-16 text-center">
        <Image
          src="/logo.png"
          alt="Embalagens Dos Anjos"
          width={140}
          height={140}
          className="rounded-full shadow-sm"
          priority
        />
        <p className="label-eyebrow">Atacado de embalagens e descartáveis</p>
        <h1 className="font-display text-5xl text-terracotta-dark sm:text-6xl">
          Tudo para embalar com carinho
        </h1>
        {/* Texto de exemplo — ajuste/confirme os detalhes reais antes de publicar */}
        <p className="max-w-xl text-ink/80">
          Copos, potes, sacolas e artigos de festa prontos pra sua loja ou
          evento. Monte seu pedido abaixo e envie direto pelo WhatsApp.
        </p>
        <a
          href="#produtos"
          className="rounded-full bg-terracotta px-8 py-3 font-medium text-white hover:bg-terracotta-dark"
        >
          Ver produtos
        </a>
      </div>
    </section>
  );
}

async function ProductGrid() {
  const products = await getProducts({});

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-ink/60">
        Nenhum produto cadastrado ainda.
      </p>
    );
  }

  return (
    <Grid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      <ProductGridItems products={products} />
    </Grid>
  );
}
