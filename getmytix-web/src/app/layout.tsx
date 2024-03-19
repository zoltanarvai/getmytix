import "./globals.css";
import type {Metadata} from "next";
import React from "react";
import {Analytics} from "@vercel/analytics/react"
import {GeistSans} from "geist/font/sans";
import {Toaster} from "@/components/ui/toaster";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Évadnyitó Innovációs Konferencia 2024",
    description: "Jegyvásárlás egyszerűen",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`bg-background antialiased mt-4 ${GeistSans.className}`}
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
        <Analytics/>
        <div className="flex justify-end max-md:flex-col gap-2 p-4 border-t-gray-200 border-t">
            <Link href="https://figyelo.hu/wp-content/uploads/2024/02/9048812ASZFrendezveny.pdf" target="_blank"
                  className="underline">
                Általános szerződési feltételek
            </Link>
            <Link href="https://figyelo.hu/wp-content/uploads/2024/02/9048816Adatvedelmitajekoztatorendezveny.pdf"
                  target="_blank" className="underline">
                Adatvédelmi tájékoztató
            </Link>
        </div>
        </body>
        </html>
    );
}
