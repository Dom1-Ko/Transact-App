//primary layout - diff fonts style and metadata
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, IBM_Plex_Serif } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
} );

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable:  '--font-inter'
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif',
})

export const metadata: Metadata = {
  title: "Transact",
  description: "Your modern banking platform",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //the line belows allows us to use the specified fonts across the whole app 

    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>{children}</body>
    </html>
  );
}