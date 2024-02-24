import "./globals.css";
import type {Metadata} from "next";
import {GeistSans} from "geist/font/sans";
import {Toaster} from "@/components/ui/toaster";
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
            className={`min-h-screen bg-background antialiased mx-4 ${GeistSans.className}`}
        >
        <Image
            src="/event_logo.png"
            className="ml-4 mt-6"
            sizes="100vw"
            width={500}
            height={300}
            style={{
                width: '80%',
                height: 'auto',
                maxWidth: '350px'
            }}
            alt="Figyelő konferenciák"
        />
        {children}
        <Toaster/>
        </body>
        </html>
    );
}
