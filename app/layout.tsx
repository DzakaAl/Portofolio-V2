import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/lib/i18n";
import ContactModal from "@/components/ui/ContactModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "DzakaAl - Portofolio",
  description:
    "Portofolio DzakaAl — Full-stack developer. Turning ideas into code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-black text-slate-100 antialiased selection:bg-white selection:text-black overflow-x-hidden">
        <LanguageProvider>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          />
          {children}
          <ContactModal />
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
