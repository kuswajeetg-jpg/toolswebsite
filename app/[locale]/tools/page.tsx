import Link from "next/link";
import { ToolConfig, toolsRegistry } from "@/config/toolRegistry";

export const metadata = {
  title: "All Tools - Smart Document Tools",
  description: "Browse our collection of free online PDF, image, and calculator tools.",
};

const toolsList: { category: string; items: ToolConfig[] }[] = [
  { category: "PDF Tools", items: toolsRegistry.filter(t => t.category === "PDF Tools" && t.enabled) },
  { category: "Image Tools", items: toolsRegistry.filter(t => t.category === "Image Tools" && t.enabled) },
  { category: "Calculators", items: toolsRegistry.filter(t => t.category === "Calculators" && t.enabled) },
  { category: "Document Generators", items: toolsRegistry.filter(t => t.category === "Document Generators" && t.enabled) },
];

const getCategoryGradient = (category: string) => {
  switch (category) {
    case "PDF Tools": return "from-rose-500 to-red-600";
    case "Image Tools": return "from-indigo-500 to-purple-600";
    case "Calculators": return "from-emerald-400 to-teal-500";
    case "Document Generators": return "from-blue-500 to-cyan-500";
    case "AI Tools": return "from-fuchsia-500 to-pink-600";
    case "Developer Tools": return "from-orange-400 to-amber-500";
    default: return "from-slate-500 to-slate-600";
  }
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">All Online Tools</h1>
        <p className="text-xl text-gray-600">Select a tool below to get started. All tools are free and process files in your browser.</p>
      </div>

      <div className="space-y-4">
        {toolsList.map((section) => (
          <div key={section.category} id={section.category.toLowerCase().replace(/\s+/g, '-')}>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6 pt-12 scroll-mt-20">{section.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.items.map((tool) => {
                const Icon = tool.icon as React.ElementType;
                return (
                  <Link key={tool.name} href={tool.path} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-slate-100 flex items-center gap-4">
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${getCategoryGradient(section.category)} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate mb-0.5">{tool.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{tool.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
