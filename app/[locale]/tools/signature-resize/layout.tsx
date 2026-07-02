import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "Online Signature Resizer - Crop and Format for Forms",
  description: "Resize, crop, and format your digital signature to meet exact KB and pixel requirements for online applications and government forms.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="signature-resize" />
    </>
  );
}
