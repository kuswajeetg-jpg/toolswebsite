import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toolsRegistry } from "@/config/toolRegistry";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookmarkButton from "@/components/tools/BookmarkButton";

export const metadata = {
  title: "My Bookmarks",
};

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

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const bookmarkedToolSlugs = bookmarks.map(b => b.toolSlug);
  
  // Assuming tool.path is like '/tools/tool-name', we need to match the slug
  const bookmarkedTools = toolsRegistry.filter(tool => 
    bookmarkedToolSlugs.includes(tool.path.split("/").pop() || "")
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/profile" className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">My Bookmarked Tools</h1>
        <p className="mt-2 text-slate-600">Quick access to your favorite utilities.</p>
      </div>

      {bookmarkedTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
          <h3 className="mb-2 text-lg font-semibold text-slate-800">No bookmarks yet</h3>
          <p className="text-slate-500">Go explore the tools and click the bookmark icon to save them here.</p>
          <Link href="/tools" className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700">
            Explore Tools
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookmarkedTools.map((tool) => {
            const Icon = tool.icon as any;
            const toolSlug = tool.path.split("/").pop() || "";
            return (
              <div key={tool.id} className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="absolute right-4 top-4 z-10">
                  <BookmarkButton toolSlug={toolSlug} />
                </div>
                <Link href={tool.path} className="flex flex-1 flex-col">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${getCategoryGradient(tool.category)} text-white shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 pr-8 text-lg font-bold text-slate-900 line-clamp-1">{tool.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{tool.desc}</p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
