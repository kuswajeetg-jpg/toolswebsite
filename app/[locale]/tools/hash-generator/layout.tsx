import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Hash Generator - Free Online Tool",
  description: "Use our free online Hash Generator tool securely in your browser. Fast, private, and no uploads required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="hash-generator" />
    </>
  );
}
