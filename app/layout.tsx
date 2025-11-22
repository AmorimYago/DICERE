
export const dynamic = "force-dynamic"

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "DICERE - Comunicação para Crianças Autistas",
  description: "Aplicativo de comunicação alternativa e aumentativa (AAC) especialmente desenvolvido para crianças autistas, baseado no sistema PECS e nas melhores práticas de design inclusivo.",
  keywords: ["AAC", "DICERE", "autismo", "comunicação alternativa", "PECS", "crianças especiais", "inclusão"],
  authors: [{ name: "DICERE" }],
  openGraph: {
    title: "DICERE - Comunicação para Crianças Autistas",
    description: "Aplicativo de comunicação alternativa e aumentativa (AAC) especialmente desenvolvido para crianças autistas",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    siteName: "DICERE",
    images: [
      {
        url: "/dicere-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "DICERE - Interface de comunicação com ícones coloridos para crianças autistas",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DICERE - Comunicação para Crianças Autistas",
    description: "Aplicativo de comunicação alternativa e aumentativa (AAC) especialmente desenvolvido para crianças autistas",
    images: ["/dicere-logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
