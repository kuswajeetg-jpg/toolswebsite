import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Robots.txt & Robots Meta Tag Generator - Free SEO Tool",
  description: "Generate robots.txt rules, build meta robots tags (noindex, nosnippet), test paths, and simulate Google Search appearance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="robots-txt-generator" />
    </>
  );
}
