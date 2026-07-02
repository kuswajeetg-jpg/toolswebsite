import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsDir = path.join(__dirname, '../app/tools');
const seoContentPath = path.join(__dirname, '../config/seo-content.json');

// Read SEO content to check if a specific tool has content
const seoContentRaw = fs.readFileSync(seoContentPath, 'utf-8');
const seoContent = JSON.parse(seoContentRaw);

// Get all directories in app/tools
const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const toolFolders = getDirectories(toolsDir);

let count = 0;

toolFolders.forEach(folder => {
  // Skip if not a valid tool folder or if it's a generic next.js folder
  if (folder.startsWith('.') || folder.startsWith('[')) return;

  const layoutPath = path.join(toolsDir, folder, 'layout.tsx');
  const pagePath = path.join(toolsDir, folder, 'page.tsx');

  // Check if page.tsx exists, if not, skip
  if (!fs.existsSync(pagePath)) return;

  // We want to extract the tool name nicely for default titles if not in seo-content.json
  const formattedName = folder.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Look up if we have specific SEO content for this tool, otherwise use default logic
  const toolSeo = seoContent[folder] || null;
  const title = toolSeo ? toolSeo.title : `${formattedName} - Free Online Tool`;
  const description = toolSeo ? toolSeo.description : `Use our free online ${formattedName} tool securely in your browser. Fast, private, and no uploads required.`;

  const layoutContent = `import SeoArticle from "@/components/tools/SeoArticle";

export const metadata = {
  title: "${title}",
  description: "${description}",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SeoArticle toolId="${folder}" />
    </>
  );
}
`;

  // Write the layout.tsx
  fs.writeFileSync(layoutPath, layoutContent);
  count++;
  console.log(`Created layout.tsx for ${folder}`);
});

console.log(`Successfully scaffolded SEO layouts for ${count} tools.`);
