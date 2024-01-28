import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export const metadata: Metadata = {
  title: "GetMyTix",
  description: "Sell tickets easily and securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background antialiased ${GeistSans.className}`}
      >
        <Image
          src="/logo.jpeg"
          className={`ml-4 mt-4`}
          width={160}
          height={160}
          alt="GetMyTix Logo"
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
