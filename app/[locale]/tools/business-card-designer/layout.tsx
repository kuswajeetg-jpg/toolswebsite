import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Business Card Designer - Free Online Tool",
  description: "Use our free online Business Card Designer tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="business-card-designer" />
    </>
  );
}
