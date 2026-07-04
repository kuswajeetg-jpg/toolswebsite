import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "PDF Compressor - Free Online Tool",
  description: "Compress your PDF files to reduce file size while maintaining document quality. Safe, private, and processes entirely inside your browser where possible.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="pdf-compressor" />
    </>
  );
}
