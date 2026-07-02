import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Indian Land Area Converter - Bigha, Kattha, Acre",
  description: "Convert local Indian land measurement units like Bigha, Kattha, Biswa to standard units like Acres, Hectares, and Square Feet based on state rules.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="land-converter" />
    </>
  );
}
