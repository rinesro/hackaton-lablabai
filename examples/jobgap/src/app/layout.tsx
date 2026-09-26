import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/LanguageContext";
import NavLinks from "@/components/NavLinks";
import LanguageToggle from "@/components/LanguageToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobGap",
  description: "Skill-gap analyzer & application tracker for fresh graduates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen bg-white text-gray-900">
        <LanguageProvider>
          <nav className="bg-gray-900 border-b border-gray-700">
            <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-3 flex items-center gap-6 text-sm font-medium">
              <NavLinks />
              <div className="ml-auto">
                <LanguageToggle />
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-8">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
