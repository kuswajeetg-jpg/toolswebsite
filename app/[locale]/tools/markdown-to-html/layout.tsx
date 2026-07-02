import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Markdown To Html - Free Online Tool",
  description: "Use our free online Markdown To Html tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="markdown-to-html" />
    </>
  );
}
