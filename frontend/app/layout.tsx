import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { Caveat, Poppins } from "next/font/google";
import { CartProvider } from "lib/cart-context";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${caveat.variable}`}>
      <body className="bg-cream text-ink selection:bg-peach-dark selection:text-ink">
        <CartProvider>
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
