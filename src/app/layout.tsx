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
  title: "FREEX",
  description: "FREEX is web3 crypto payment gateway for your business",
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
