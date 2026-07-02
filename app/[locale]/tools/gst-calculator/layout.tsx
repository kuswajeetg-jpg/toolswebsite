import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Indian GST Calculator Online - Add or Remove GST",
  description: "Easily calculate GST (Goods and Services Tax) for Indian businesses. Quickly add or remove 5%, 12%, 18%, or 28% GST.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="gst-calculator" />
    </>
  );
}
