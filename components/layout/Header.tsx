"use client";

import { useState, useRef, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FileText, Menu, X, Search, ChevronDown, User as UserIcon, LogOut, Globe } from "lucide-react";
import { toolsRegistry, toolCategories } from "@/config/toolRegistry";
import { useSession, signOut } from "next-auth/react";

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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const sessionResult = useSession();
  const session = sessionResult?.data;

  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("Navigation");

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggest(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTools = searchQuery
    ? toolsRegistry.filter(t => t.enabled && t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl text-gray-900 hidden sm:block">Smart Document Tools</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder={t("search_placeholder") || "Search for tools..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
            />
          </div>
          
          {/* Auto-suggest dropdown */}
          {showSuggest && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-2 max-h-96 overflow-y-auto z-50">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => {
                  const ToolIcon = tool.icon as React.ElementType;
                  return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                    onClick={() => setShowSuggest(false)}
                  >
                    <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center text-white bg-gradient-to-br ${getCategoryGradient(tool.category)}`}>
                      <ToolIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{tool.name}</div>
                      <div className="text-xs text-slate-500">{tool.category}</div>
                    </div>
                  </Link>
                )})
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No tools found for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          {/* All Tools with Mega Menu Hover */}
          <div 
            className="relative h-16 flex items-center"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            <Link href="/tools" className="text-slate-700 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              {t("all_tools")} <ChevronDown className="h-4 w-4" />
            </Link>
            
            {showMegaMenu && (
              <div className="absolute top-full right-0 w-[900px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50 grid grid-cols-3 gap-x-8 gap-y-6">
                {toolCategories.filter(c => toolsRegistry.some(t => t.category === c.category && t.enabled)).slice(0, 6).map(cat => {
                  const CatIcon = cat.icon as React.ElementType;
                  const allCatTools = toolsRegistry.filter(t => t.category === cat.category && t.enabled);
                  const catTools = allCatTools.slice(0, 5);
                  return (
                    <div key={cat.category}>
                      <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">
                        {cat.category}
                      </h4>
                      <div className="flex flex-col gap-1">
                        {catTools.map(tool => {
                          const ToolIcon = tool.icon as React.ElementType;
                          return (
                          <Link 
                            key={tool.id} 
                            href={tool.path} 
                            onClick={() => setShowMegaMenu(false)}
                            className="group flex items-center gap-3 text-sm text-slate-700 hover:text-blue-700 hover:bg-slate-50 px-2 py-2 rounded-lg transition-colors"
                          >
                            <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${getCategoryGradient(tool.category)} shadow-sm group-hover:scale-105 transition-transform`}>
                              <ToolIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium truncate">{tool.name}</span>
                          </Link>
                        )})}
                        {allCatTools.length > 5 && (
                          <Link 
                            href={`/tools#${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setShowMegaMenu(false)}
                            className="text-sm font-bold text-blue-600 hover:underline px-2 py-2 mt-1"
                          >
                            View All {allCatTools.length} Tools &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">{t("admin")}</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">{t("about")}</Link>

          {/* Language Selector */}
          <button
            onClick={() => changeLocale(currentLocale === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>{currentLocale === "en" ? "हिन्दी" : "English"}</span>
          </button>
          
          {session ? (
            <div className="relative" onMouseLeave={() => setShowProfileMenu(false)}>
              <button 
                onMouseEnter={() => setShowProfileMenu(true)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>{t("profile")}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-lg">
                  <div className="border-b border-slate-100 px-4 pb-2 pt-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{session.user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{session.user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                    >
                      <UserIcon className="h-4 w-4" /> {t("profile")}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> {t("logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              {t("login")}
            </Link>
          )}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
          <Link href="/tools" className="block text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("all_tools")}</Link>
          <Link href="/admin" className="block text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("admin")}</Link>
          <Link href="/about" className="block text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("about")}</Link>
          <Link href="/contact" className="block text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setMobileOpen(false)}>{t("contact")}</Link>
          <button
            onClick={() => {
              changeLocale(currentLocale === "en" ? "hi" : "en");
              setMobileOpen(false);
            }}
            className="w-full text-left text-gray-600 hover:text-blue-600 font-medium py-2 flex items-center gap-2 border-t pt-2 mt-2"
          >
            <Globe className="h-4 w-4 text-blue-600" />
            <span>{currentLocale === "en" ? "हिन्दी" : "English"}</span>
          </button>
        </div>
      )}
    </header>
  );
}
