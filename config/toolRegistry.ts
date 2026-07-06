import { 
  FileUp, FileImage, Calculator, PenTool, 
  Scissors, Merge, Zap, Calendar, Type, Image,
  FileText, Shield, Settings, Eye, EyeOff, Trash2, Plus,
  GripVertical, Copy, Download, UploadCloud, Loader2,
  Globe, Clock, Ruler, DollarSign, CreditCard, Key,
  Lock, Crop, Filter, RefreshCw, TrendingUp, ArrowDownToLine, Combine, MapPin
} from "lucide-react";

export type ToolCategory = "PDF Tools" | "Image Tools" | "Calculators" | "Document Generators" | "AI Tools" | "Developer Tools" | "other";

export interface ToolConfig {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType;
  desc: string;
  category: ToolCategory;
  enabled: boolean;
  featured?: boolean;
  componentPath?: string;
}

export type ToolCategoryConfig = {
  category: string;
  icon: React.ComponentType;
};

export const toolCategories: ToolCategoryConfig[] = [
  { category: "PDF Tools", icon: FileUp },
  { category: "Image Tools", icon: FileImage },
  { category: "Calculators", icon: Calculator },
  { category: "Document Generators", icon: PenTool },
  { category: "AI Tools", icon: Settings },
  { category: "Developer Tools", icon: Settings },
];

export const toolsRegistry: ToolConfig[] = [
  // Developer Tools - New
  { id: "word-counter", name: "Word & Character Counter", path: "/tools/word-counter", icon: Type, desc: "Count words, characters, and paragraphs", category: "Developer Tools", enabled: true, featured: false },
  { id: "case-converter", name: "Case Converter", path: "/tools/case-converter", icon: Type, desc: "Convert text to UPPER, lower, Title Case, etc.", category: "Developer Tools", enabled: true, featured: true },
  { id: "markdown-to-html", name: "Markdown to HTML", path: "/tools/markdown-to-html", icon: FileText, desc: "Convert Markdown syntax to HTML", category: "Developer Tools", enabled: true, featured: true },
  { id: "hash-generator", name: "Hash Generator", path: "/tools/hash-generator", icon: Lock, desc: "Generate MD5, SHA-256 hashes", category: "Developer Tools", enabled: true, featured: false },
  { id: "code-minifier", name: "Code Minifier", path: "/tools/code-minifier", icon: Scissors, desc: "Minify HTML, CSS, and JS code", category: "Developer Tools", enabled: true, featured: false },
  { id: "json-formatter", name: "JSON Formatter", path: "/tools/json-formatter", icon: Settings, desc: "Format and validate JSON data", category: "Developer Tools", enabled: true, featured: true },
  { id: "encoder-decoder", name: "Encoder & Decoder", path: "/tools/encoder-decoder", icon: RefreshCw, desc: "Base64 and URL encoding/decoding", category: "Developer Tools", enabled: true, featured: false },
  { id: "robots-txt-generator", name: "Robots.txt & Robots Meta Tag Builder", path: "/tools/robots-txt-generator", icon: Settings, desc: "Generate robots.txt rules, build meta robots tags, and simulate search snippet appearances.", category: "Developer Tools", enabled: true, featured: true },
  // PDF Tools - Existing
  { id: "image-to-pdf", name: "Image to PDF", path: "/tools/image-to-pdf", icon: FileUp, desc: "Convert images to PDF locally", category: "PDF Tools", enabled: true, featured: false },
  { id: "pdf-merge", name: "PDF Merge", path: "/tools/pdf-merge", icon: Merge, desc: "Combine multiple PDF files", category: "PDF Tools", enabled: true, featured: false },
  { id: "pdf-split", name: "PDF Split", path: "/tools/pdf-split", icon: Scissors, desc: "Extract pages from a PDF", category: "PDF Tools", enabled: true, featured: false },
  // PDF Tools - New
  { id: "pdf-to-word", name: "PDF to Word", path: "/tools/pdf-to-word", icon: FileText, desc: "Convert PDF to editable Word documents", category: "PDF Tools", enabled: true, featured: true },
  { id: "pdf-watermark", name: "PDF Watermark", path: "/tools/pdf-watermark", icon: Type, desc: "Add or remove watermarks from PDFs", category: "PDF Tools", enabled: true, featured: false },
  { id: "pdf-password", name: "PDF Password", path: "/tools/pdf-password", icon: Lock, desc: "Add or remove password protection", category: "PDF Tools", enabled: true, featured: false },
  { id: "pdf-page-numbers", name: "PDF Page Numbers", path: "/tools/pdf-page-numbers", icon: FileText, desc: "Add page numbers to PDF documents", category: "PDF Tools", enabled: true, featured: false },
  { id: "pdf-rotate", name: "PDF Rotate", path: "/tools/pdf-rotate", icon: RefreshCw, desc: "Rotate PDF pages by 90, 180, or 270 degrees", category: "PDF Tools", enabled: true, featured: false },
  { id: "pdf-compressor", name: "PDF Compressor", path: "/tools/pdf-compressor", icon: ArrowDownToLine, desc: "Compress PDF file size online", category: "PDF Tools", enabled: true, featured: true },
  
  // Image Tools - Existing
  { id: "image-compressor", name: "Image Compressor", path: "/tools/image-compressor", icon: Zap, desc: "Reduce image file size", category: "Image Tools", enabled: true, featured: true },
  { id: "resize-photo-by-kb", name: "Resize Photo by KB", path: "/tools/resize-photo-by-kb", icon: FileImage, desc: "Target specific KB size", category: "Image Tools", enabled: true, featured: false },
  { id: "resize-photo-wh", name: "Resize Photo (W/H)", path: "/tools/resize-photo", icon: Image, desc: "Resize by width & height", category: "Image Tools", enabled: true, featured: false },
  { id: "signature-resize", name: "Signature Resize", path: "/tools/signature-resize", icon: PenTool, desc: "Resize and format signatures", category: "Image Tools", enabled: true, featured: true },
  // Image Tools - New
  { id: "image-converter", name: "Image Converter", path: "/tools/image-converter", icon: RefreshCw, desc: "Convert between JPG, PNG, WebP, BMP, GIF", category: "Image Tools", enabled: true, featured: false },
  { id: "image-cropper", name: "Image Cropper", path: "/tools/image-cropper", icon: Crop, desc: "Crop images to custom dimensions", category: "Image Tools", enabled: true, featured: false },
  { id: "image-filters", name: "Image Filters", path: "/tools/image-filters", icon: Filter, desc: "Apply filters to your images", category: "Image Tools", enabled: true, featured: false },
  
  // Calculators - Existing
  { id: "age-calculator", name: "Age Calculator", path: "/tools/age-calculator", icon: Calendar, desc: "Calculate exact age", category: "Calculators", enabled: true, featured: false },
  { id: "percentage-calculator", name: "Percentage Calculator", path: "/tools/percentage-calculator", icon: Calculator, desc: "Calculate percentages fast", category: "Calculators", enabled: true, featured: false },
  { id: "life-calculator", name: "Life Calculator", path: "/tools/life-calculator", icon: Calendar, desc: "Calculate life remaining", category: "Calculators", enabled: true, featured: false },
  // Calculators - New
  { id: "salary-calculator", name: "Salary Calculator", path: "/tools/salary-calculator", icon: DollarSign, desc: "Calculate take-home salary & taxes", category: "Calculators", enabled: true, featured: true },
  { id: "emi-calculator", name: "EMI Calculator", path: "/tools/emi-calculator", icon: DollarSign, desc: "Calculate monthly loan payments", category: "Calculators", enabled: true, featured: true },
  { id: "roi-calculator", name: "ROI Calculator", path: "/tools/roi-calculator", icon: TrendingUp, desc: "Calculate Return on Investment", category: "Calculators", enabled: true, featured: true },
  { id: "sip-calculator", name: "SIP Calculator", path: "/tools/sip-calculator", icon: TrendingUp, desc: "Calculate mutual fund SIP returns", category: "Calculators", enabled: true, featured: true },
  { id: "swp-calculator", name: "SWP Calculator", path: "/tools/swp-calculator", icon: ArrowDownToLine, desc: "Calculate systematic withdrawals", category: "Calculators", enabled: true, featured: false },
  { id: "combined-sip-swp-calculator", name: "Combined SIP + SWP", path: "/tools/combined-sip-swp-calculator", icon: Combine, desc: "Plan complete financial lifecycle", category: "Calculators", enabled: true, featured: true },
  { id: "currency-converter", name: "Currency Converter", path: "/tools/currency-converter", icon: Globe, desc: "Convert between world currencies", category: "Calculators", enabled: true, featured: false },
  { id: "unit-converter", name: "Unit Converter", path: "/tools/unit-converter", icon: Ruler, desc: "Convert length, weight, area units", category: "Calculators", enabled: true, featured: false },
  { id: "land-converter", name: "Indian Land Converter", path: "/tools/land-converter", icon: MapPin, desc: "Convert Bigha, Kattha based on location", category: "Calculators", enabled: true, featured: true },
  { id: "bmi-calculator", name: "BMI Calculator", path: "/tools/bmi-calculator", icon: Calculator, desc: "Calculate Body Mass Index", category: "Calculators", enabled: true, featured: false },
  { id: "loan-calculator", name: "Loan Calculator", path: "/tools/loan-calculator", icon: CreditCard, desc: "Calculate loan payments and interest", category: "Calculators", enabled: true, featured: false },
  { id: "gst-calculator", name: "GST Calculator", path: "/tools/gst-calculator", icon: Calculator, desc: "Calculate Indian GST amounts", category: "Calculators", enabled: true, featured: true },
  { id: "compound-interest", name: "Compound Interest", path: "/tools/compound-interest", icon: Calculator, desc: "Calculate compound interest on investments", category: "Calculators", enabled: true, featured: false },
  { id: "date-calculator", name: "Date Calculator", path: "/tools/date-calculator", icon: Calendar, desc: "Calculate difference between dates", category: "Calculators", enabled: true, featured: false },
  { id: "scientific-calculator", name: "Scientific Calculator", path: "/tools/scientific-calculator", icon: Calculator, desc: "Advanced calculator with scientific functions", category: "Calculators", enabled: true, featured: false },
  { id: "time-calculator", name: "Time Calculator", path: "/tools/time-calculator", icon: Clock, desc: "Add or subtract time values", category: "Calculators", enabled: true, featured: false },
  { id: "retirement-calculator", name: "Retirement Calculator", path: "/tools/retirement-calculator", icon: DollarSign, desc: "Plan your retirement savings", category: "Calculators", enabled: true, featured: false },
  
  // Document Generators - Existing
  { id: "hindi-message-formatter", name: "Hindi Message Formatter", path: "/tools/hindi-official-message-formatter", icon: Type, desc: "Generate official Hindi texts", category: "Document Generators", enabled: true, featured: true },
  // Document Generators - New
  { id: "resume-builder", name: "Resume Builder", path: "/tools/resume-builder", icon: FileText, desc: "Create professional resumes", category: "Document Generators", enabled: true, featured: true },
  { id: "invoice-generator", name: "Invoice Generator", path: "/tools/invoice-generator", icon: FileText, desc: "Create professional invoices", category: "Document Generators", enabled: true, featured: false },
  { id: "agreement-generator", name: "Agreement Generator", path: "/tools/agreement-generator", icon: FileText, desc: "Generate legal contracts and agreements", category: "Document Generators", enabled: true, featured: true },
  { id: "certificate-generator", name: "Certificate Generator", path: "/tools/certificate-generator", icon: FileText, desc: "Create professional certificates", category: "Document Generators", enabled: true, featured: false },
  { id: "id-card-maker", name: "ID Card Maker", path: "/tools/id-card-maker", icon: CreditCard, desc: "Design professional ID cards", category: "Document Generators", enabled: true, featured: true },
  { id: "business-card-designer", name: "Business Card Designer", path: "/tools/business-card-designer", icon: CreditCard, desc: "Create professional business cards", category: "Document Generators", enabled: true, featured: false },
];

export const getEnabledTools = (): ToolConfig[] => {
  return toolsRegistry.filter(tool => tool.enabled);
};

export const getFeaturedTools = (): ToolConfig[] => {
  return toolsRegistry.filter(tool => tool.enabled && tool.featured);
};

export const getToolsByCategory = (category: string): ToolConfig[] => {
  return toolsRegistry.filter(tool => tool.enabled && tool.category === category);
};

export const addTool = (tool: Omit<ToolConfig, "id"> & { id?: string }): ToolConfig => {
  const newTool: ToolConfig = {
    ...tool,
    id: tool.id || tool.name.toLowerCase().replace(/\s+/g, "-"),
  };
  const exists = toolsRegistry.some(t => t.id === newTool.id);
  if (!exists) {
    (toolsRegistry as ToolConfig[]).push(newTool);
  }
  return newTool;
};

export const removeTool = (toolId: string): boolean => {
  const index = toolsRegistry.findIndex(t => t.id === toolId);
  if (index > -1) {
    toolsRegistry.splice(index, 1);
    return true;
  }
  return false;
};

export const toggleToolVisibility = (toolId: string): boolean => {
  const tool = toolsRegistry.find(t => t.id === toolId);
  if (tool) {
    tool.enabled = !tool.enabled;
    return tool.enabled;
  }
  return false;
};

export const updateTool = (toolId: string, updates: Partial<ToolConfig>): boolean => {
  const tool = toolsRegistry.find(t => t.id === toolId);
  if (tool) {
    Object.assign(tool, updates);
    return true;
  }
  return false;
};