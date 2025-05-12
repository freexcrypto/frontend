import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/config/Web3Provider";
import { Toaster } from "@/components/ui/sonner";
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freex: Web3 Crypto Payment Gateway",
  description:
    "Freex is a web3 solution cryptocurrency payment gateway that enables businesses to accept cryptocurrency payments seamlessly.",
  openGraph: {
    title: "FREEX",
    description:
      "Freex is a web3 solution cryptocurrency payment gateway that enables businesses to accept cryptocurrency payments seamlessly.",
    url: "https://www.freexcrypto.xyz",
    type: "website",
    images: [
      {
        url: "https://hpeomxpauqyqnmdejfgb.supabase.co/storage/v1/object/public/images//freex_opengraph.png", // URL gambar untuk Open Graph
        alt: "Freex: Web3 Crypto Payment Gateway",
        width: 1200,
        height: 630,
      },
    ],
  },
  authors: [
    {
      name: "Freex Dev Team",
      url: "https://www.freexcrypto.xyz",
    },
  ],

  keywords:
    "crypto payment gateway, web3, blockchain, cryptocurrency, payment gateway, crypto payment, crypto payment gateway, web3 payment gateway, blockchain payment gateway, cryptocurrency payment gateway, crypto payment gateway, web3 payment gateway, blockchain payment gateway, cryptocurrency payment gateway",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <Web3Provider>{children}</Web3Provider>
        <Toaster />
      </body>
    </html>
  );
}
