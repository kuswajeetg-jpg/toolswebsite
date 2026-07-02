import seoContentData from "@/config/seo-content.json";

interface SeoArticleProps {
  toolId: string;
}

export default function SeoArticle({ toolId }: SeoArticleProps) {
  // @ts-ignore
  const content = seoContentData[toolId] || seoContentData["default"];

  if (!content) return null;

  return (
    <article className="mt-16 max-w-4xl mx-auto px-4 prose prose-slate prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-xl">
      <hr className="my-8 border-gray-200" />
      <div dangerouslySetInnerHTML={{ __html: content.articleHtml }} />
    </article>
  );
}
