import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: 'https://kyabeclau.de',
      lastModified,
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: 'https://kyabeclau.de/history',
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://kyabeclau.de/unsubscribe',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
