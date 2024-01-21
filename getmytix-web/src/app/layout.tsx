import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";

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
        <div
          className={`ml-4 mt-4 tracking-tight antialiased font-bold text-lg ${GeistSans.className}`}
        >
          GetMyTix.io
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
