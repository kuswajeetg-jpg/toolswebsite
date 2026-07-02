import { MetadataRoute } from 'next';
import { toolsRegistry } from '@/config/toolRegistry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://smartdocumenttools.com';
  
  const toolUrls = toolsRegistry
    .filter(tool => tool.enabled)
    .map((tool) => ({
      url: `${baseUrl}${tool.path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const programmaticUrls = [
    ...[20, 50, 100, 200, 500].map(kb => ({
      url: `${baseUrl}/tools/resize-photo-by-kb/${kb}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...['personal-loan', 'home-loan', 'auto-loan'].map(type => ({
      url: `${baseUrl}/tools/loan-calculator/${type}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...toolUrls,
    ...programmaticUrls,
  ];
}