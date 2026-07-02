"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { ShieldCheck, Zap, Smartphone, ArrowRight, TrendingUp, Grid } from "lucide-react";
import { getFeaturedTools, getEnabledTools } from "@/config/toolRegistry";
import { motion } from "framer-motion";

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

export default function HomeClient() {
  const tHome = useTranslations("Home");
  const tTools = useTranslations("Tools");

  const featuredTools = getFeaturedTools();
  const allTools = getEnabledTools();
  const essentialTools = allTools.filter(t => !t.featured).slice(0, 16); // Show top 16 non-featured

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-24 -left-24 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              {tHome("hero_title_1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{tHome("hero_title_2")}</span> <br className="hidden md:block" /> {tHome("hero_title_3")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {tHome("hero_subtitle")}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/tools" className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                {tHome("explore_btn")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3"
          >
            <TrendingUp className="h-8 w-8 text-blue-600" />
            {tHome("trending_title")}
          </motion.h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600">{tHome("trending_subtitle")}</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredTools.map((tool) => {
            const Icon = tool.icon as React.ElementType;
            const toolName = tTools.has(`${tool.id}.name`) ? tTools(`${tool.id}.name`) : tool.name;
            const toolDesc = tTools.has(`${tool.id}.desc`) ? tTools(`${tool.id}.desc`) : tool.desc;
            return (
              <motion.div key={tool.name} variants={itemVariants}>
                <Link href={tool.path} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-slate-100 hover:border-blue-100 relative overflow-hidden z-10 flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${getCategoryGradient(tool.category)} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5 truncate group-hover:text-blue-700 transition-colors">{toolName}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{toolDesc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3"
          >
            <Grid className="h-7 w-7 text-indigo-600" />
            {tHome("essential_title")}
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600">{tHome("essential_subtitle")}</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {essentialTools.map((tool) => {
            const Icon = tool.icon as React.ElementType;
            const toolName = tTools.has(`${tool.id}.name`) ? tTools(`${tool.id}.name`) : tool.name;
            const toolDesc = tTools.has(`${tool.id}.desc`) ? tTools(`${tool.id}.desc`) : tool.desc;
            return (
              <motion.div key={tool.name} variants={itemVariants}>
                <Link href={tool.path} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-slate-100 hover:border-indigo-100 relative overflow-hidden z-10 flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${getCategoryGradient(tool.category)} shadow-sm group-hover:scale-105 transition-transform opacity-90`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5 truncate group-hover:text-indigo-700 transition-colors">{toolName}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{toolDesc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{tHome("secure_title")}</h3>
              <p className="text-gray-600 leading-relaxed">{tHome("secure_desc")}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="mx-auto w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{tHome("fast_title")}</h3>
              <p className="text-gray-600 leading-relaxed">{tHome("fast_desc")}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="mx-auto w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{tHome("mobile_title")}</h3>
              <p className="text-gray-600 leading-relaxed">{tHome("mobile_desc")}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
