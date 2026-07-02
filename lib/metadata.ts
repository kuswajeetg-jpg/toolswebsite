export const metadata = {
  title: "Smart Document Tools - Free Online PDF & Image Tools",
  description: "Free, fast, and privacy-friendly online tools for PDF editing, image compression, calculators, and document generation.",
  keywords: "PDF tools, image compressor, online calculators, document generator, free tools, privacy friendly, browser based",
  openGraph: {
    title: "Smart Document Tools - Free Online PDF, Image & Calculator Tools",
    description: "100% free online tools. All files processed locally in your browser - no uploads, no privacy concerns.",
    url: "https://smartdocumenttools.com",
    siteName: "Smart Document Tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Document Tools - Free Online Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Document Tools - Free Online PDF, Image & Calculator Tools",
    description: "100% free online tools. Privacy-friendly, browser-based processing.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://smartdocumenttools.com",
  },
};

export const toolMetadata = (toolName: string, toolDesc: string, path: string) => ({
  title: `${toolName} - Free Online Tool | Smart Document Tools`,
  description: `${toolDesc}. 100% free, privacy-friendly, works in your browser.`,
  keywords: `${toolName.toLowerCase()}, free online tool, ${toolDesc.toLowerCase()}, smart document tools`,
  openGraph: {
    title: `${toolName} - Free Online Tool`,
    description: toolDesc,
    url: `https://smartdocumenttools.com${path}`,
    siteName: "Smart Document Tools",
    images: [{ url: "/og-tool.png", width: 1200, height: 630, alt: toolName }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${toolName} - Free Online Tool`,
    description: toolDesc,
    images: ["/og-tool.png"],
  },
  alternates: {
    canonical: `https://smartdocumenttools.com${path}`,
  },
});

export const calculatorMetadata = (calcName: string) => ({
  title: `${calcName} - Free Online Calculator | Smart Document Tools`,
  description: `Free online ${calcName.toLowerCase()} calculator. Quick, accurate calculations with instant results. No registration required.`,
  keywords: `${calcName.toLowerCase()}, calculator, online calculator, free calculator, smart document tools`,
  openGraph: {
    title: `${calcName} - Free Online Calculator`,
    description: `Calculate ${calcName.toLowerCase()} instantly with our free online calculator.`,
    url: `https://smartdocumenttools.com/tools/${calcName.toLowerCase().replace(/\s+/g, "-")}`,
    siteName: "Smart Document Tools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${calcName} - Free Online Calculator`,
    description: `Free ${calcName.toLowerCase()} calculator with instant results.`,
  },
});