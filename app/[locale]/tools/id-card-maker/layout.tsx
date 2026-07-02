import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Id Card Maker - Free Online Tool",
  description: "Use our free online Id Card Maker tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="id-card-maker" />
    </>
  );
}
