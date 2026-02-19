/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: 'https://amvrakikosfishing.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 1.0,
  sitemapSize: 7000,
  autoLastmod: true,
  outFolderPath: 'public',
  exclude: ['/server-sitemap.xml'],
};
