import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Age Calculator - Free Online Tool",
  description: "Use our free online Age Calculator tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="age-calculator" />
    </>
  );
}
