import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "StellarBridge — Cross-Border Remittance Hub",
  description:
    "A Stellar testnet Level 1 remittance MVP. Connect Freighter, fund with Friendbot, and send XLM payments with simulated cross-border FX context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <WalletProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
