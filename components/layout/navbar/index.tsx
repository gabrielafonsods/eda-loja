import CartModal from "components/cart/cart-modal";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

// Menu fixo — simples o bastante pra não precisar de um sistema de CMS
const links = [{ title: "Quem Somos", path: "/quem-somos" }];

export function Navbar() {
  return (
    <nav className="relative flex items-center justify-between border-b border-peach-dark bg-cream p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={links} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full items-center md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex items-center gap-2 lg:mr-6"
          >
            <Image
              src="/logo.png"
              alt={SITE_NAME || "Embalagens Dos Anjos"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-display hidden text-2xl text-terracotta-dark md:block">
              {SITE_NAME}
            </span>
          </Link>
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {links.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-ink/70 underline-offset-4 hover:text-terracotta hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
