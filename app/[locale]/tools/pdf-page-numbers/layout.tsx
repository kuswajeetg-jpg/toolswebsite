import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Pdf Page Numbers - Free Online Tool",
  description: "Use our free online Pdf Page Numbers tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="pdf-page-numbers" />
    </>
  );
}
