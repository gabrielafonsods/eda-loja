import Footer from "components/layout/footer";

export const metadata = {
  title: "Quem Somos",
  description: "Conheça a história da Embalagens Dos Anjos.",
};

export default function QuemSomosPage() {
  return (
    <>
      <section className="mx-auto max-w-(--breakpoint-md) px-4 py-16">
        <p className="label-eyebrow mb-2">Nossa história</p>
        <h1 className="font-display mb-6 text-5xl text-terracotta-dark">
          Quem Somos
        </h1>
        {/*
          Texto de exemplo — troque pelo texto real da história da loja.
          Só ajustar o conteúdo dentro de cada <p>.
        */}
        <div className="space-y-4 text-lg leading-relaxed text-ink/90">
          <p>
            A Embalagens Dos Anjos existe para facilitar o dia a dia de quem
            trabalha com comida, festas e comércio: embalagens e
            descartáveis de qualidade, com preço de atacado e atendimento
            próximo.
          </p>
          <p>
            Aqui você encontra desde o essencial do dia a dia — copos, potes
            e sacolas — até itens para festas.
          </p>
          <p>Fale com a gente pelo WhatsApp e monte seu pedido.</p>
        </div>
      </section>
      <Footer />
    </>
  );
}
