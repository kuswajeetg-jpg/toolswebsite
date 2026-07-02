import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Date Calculator - Free Online Tool",
  description: "Use our free online Date Calculator tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="date-calculator" />
    </>
  );
}
