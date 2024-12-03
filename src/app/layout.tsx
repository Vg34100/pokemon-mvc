import type { Metadata } from "next";

import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientAuthButton } from "@/components/ClientAuthButton";
import Image from "next/image";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pokédex - Gotta Catch 'Em All!",
  description: "Explore, and create your personalized Pokémon collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <header className="p-4 border-b">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Pokédex</h1>
                {/* Added Poké Ball Image */}
                <Image
                  src="/images/pokeball.png"
                  alt="Poké Ball"
                  width={32}
                  height={32}
                />
              </div>
              <ClientAuthButton />
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html >
  );
}