import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Hindi Official Message Formatter - Free Draft Generator",
  description: "Generate perfectly formatted formal Hindi messages for office notices, leave applications, and urgent orders instantly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="hindi-official-message-formatter" />
    </>
  );
}
