// Enhanced sitemap.xml generator for Maneh blog
const fs = require('fs');
const path = require('path');

// Read articles from data.js
const dataPath = path.join(__dirname, 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract ARTICLES array using regex
const articlesMatch = dataContent.match(/const ARTICLES = (\[[\s\S]*?\]);/);
if (!articlesMatch) {
  console.error('Could not find ARTICLES array in data.js');
  process.exit(1);
}

const articles = eval(articlesMatch[1]);

// Generate enhanced sitemap
const baseUrl = 'https://maneh.blog';
const currentDate = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Category Pages -->
  <url>
    <loc>${baseUrl}/#category/news</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/#category/tutorial</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/#policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

// Add article URLs with enhanced metadata
articles.forEach((article, index) => {
  const publishedDate = new Date(article.published);
  const yyyy = publishedDate.getFullYear();
  const mm = String(publishedDate.getMonth() + 1).padStart(2, '0');
  const dd = String(publishedDate.getDate()).padStart(2, '0');
  
  // Get order number based on category and published date
  const categoryArticles = articles.filter(art => art.category === article.category)
    .sort((a, b) => new Date(b.published) - new Date(a.published));
  const order = categoryArticles.findIndex(art => art.slug === article.slug) + 1;
  
  const category = article.category ? `${article.category}-` : '';
  const url = `${baseUrl}/${yyyy}/${mm}/${dd}/${order}-${category}${article.slug}`;
  const lastmod = article.published.split('T')[0];
  
  // Calculate priority based on recency and category
  let priority = 0.7;
  if (article.category === 'news') priority = 0.8;
  if (index < 3) priority = 0.9; // Top 3 articles get higher priority
  
  sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${article.cover}</image:loc>
      <image:title>${article.title}</image:title>
      <image:caption>${article.summary}</image:caption>
    </image:image>`;
    
  // Add news-specific metadata for news articles
  if (article.category === 'news') {
    sitemap += `
    <news:news>
      <news:publication>
        <news:name>Maneh</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:publication_date>${article.published}</news:publication_date>
      <news:title>${article.title}</news:title>
      <news:keywords>${article.tags ? article.tags.join(', ') : 'teknologi, tutorial'}</news:keywords>
    </news:news>`;
  }
  
  sitemap += `
  </url>`;
});

sitemap += `
</urlset>`;

// Write sitemap
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log(`Enhanced sitemap generated with ${articles.length + 5} URLs`);
console.log('Sitemap includes:');
console.log('- Home page');
console.log('- Category pages (News, Tutorial)');
console.log('- Static pages (About, Policy)');
console.log('- All articles with images and news metadata');
console.log('- Enhanced priority and changefreq settings');