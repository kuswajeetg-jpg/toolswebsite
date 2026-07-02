"use client";

import { usePathname } from "next/navigation";
import { toolsRegistry } from "@/config/toolRegistry";
import BookmarkButton from "@/components/tools/BookmarkButton";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const toolSlug = pathname.split("/").pop();
  const tool = toolsRegistry.find((t) => t.path.split("/").pop() === toolSlug);

  return (
    <>
      {tool && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: tool.name,
              applicationCategory: "BrowserApplication",
              operatingSystem: "Any",
              description: tool.desc,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      )}
      {tool && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end pt-6">
            <BookmarkButton toolSlug={tool.path.split("/").pop() || ""} />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
