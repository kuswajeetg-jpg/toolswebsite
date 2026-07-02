import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/toast/ToastContext";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import FeedbackModal from "@/components/feedback/FeedbackModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://smartdocumenttools.com"),
  title: {
    default: "Smart Document Tools - Free Online PDF, Image & Calculator Tools",
    template: "%s | Smart Document Tools",
  },
  description: "Free, fast, and privacy-friendly online tools for PDF editing, image compression, calculators, and document generation. All files processed locally in your browser.",
  keywords: [
    "PDF tools",
    "image compressor",
    "online calculators",
    "document generator",
    "free tools",
    "privacy friendly",
    "browser based",
    "PDF merge",
    "PDF split",
    "image resize",
    "age calculator",
    "percentage calculator",
  ],
  authors: [{ name: "Smart Document Tools" }],
  creator: "Smart Document Tools",
  publisher: "Smart Document Tools",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smartdocumenttools.com",
    title: "Smart Document Tools - Free Online PDF, Image & Calculator Tools",
    description: "100% free online tools. All files processed locally in your browser - no uploads, no privacy concerns.",
    siteName: "Smart Document Tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Document Tools - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Document Tools - Free Online PDF, Image & Calculator Tools",
    description: "100% free online tools. Privacy-friendly, browser-based processing.",
    images: ["/og-image.png"],
    creator: "@smartdocumenttools",
  },
  alternates: {
    canonical: "https://smartdocumenttools.com",
  },
  manifest: "/manifest.json",
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang={locale}>
      <head>
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        {adsenseClientId && adsenseClientId !== "ca-pub-XXXXXXXXXXXXXXXX" && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Smart Document Tools",
              url: "https://smartdocumenttools.com",
              description: "Free online PDF, Image & Calculator Tools",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://smartdocumenttools.com/tools?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <FeedbackModal />
            </ToastProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}