/**
 * Maneh Blog - Main JavaScript
 * Optimized for performance and maintainability
 */
'use strict';

// Performance monitoring
const perfStartTime = performance.now();
let metricsCollected = false;

// Restore scroll position
history.scrollRestoration = 'manual';

// Secure locale detection with fallback
let LOCALE = (() => {
  try {
    const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return lang.startsWith('id') ? 'id' : 'en';
  } catch (e) {
    console.warn('Locale detection failed, using fallback');
    return 'en';
  }
})();

// DOM Element Cache
const DOMCache = {
  home: null,
  reader: null,
  post: null,
  searchBar: null,
  drawer: null,
  btnMenu: null,
  btnClose: null,
  
  /**
   * Initialize DOM cache
   */
  init() {
    this.home = document.getElementById('home');
    this.reader = document.getElementById('reader');
    this.post = document.getElementById('post');
    this.searchBar = document.getElementById('searchBar');
    this.drawer = document.getElementById('drawer');
    this.btnMenu = document.getElementById('btnMenu');
    this.btnClose = document.getElementById('btnClose');
  },
  
  /**
   * Get cached element or query DOM
   * @param {string} id - Element ID
   * @returns {Element|null}
   */
  get(id) {
    return this[id] || document.getElementById(id);
  }
};

// Utility Functions
/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* Enhanced locale detection with error handling */
function detectAndApplyLocale() {
  try {
  // Apply default locale immediately for fast initial render
  applyI18N(); 

    // Skip IP detection to avoid CORS issues and improve performance
    console.log('Using browser locale detection for better performance');
  } catch (error) {
    console.error('Locale detection error:', error);
    // Fallback to default
    LOCALE = 'en';
        applyI18N();
      }
}

// Secure translation function with error handling and fallback
function t(key) { 
  try {
    // Try current locale first
    let result = (I18N[LOCALE] || {})[key];
    
    // Fallback to Indonesian if not found
    if (!result && LOCALE !== 'id') {
      result = (I18N.id || {})[key];
    }
    
    // Fallback to English if still not found
    if (!result && LOCALE !== 'en') {
      result = (I18N.en || {})[key];
    }
    
    // Final fallback to key itself
    if (!result) {
      result = key;
      console.warn('Translation not found for key:', key, 'locale:', LOCALE);
    }
    
    return result;
  } catch (e) {
    console.warn('Translation error for key:', key, 'error:', e);
    return key;
  }
}

// Optimized I18N application with batch DOM updates
function applyI18N() {
  try {
    console.log('Applying I18N with locale:', LOCALE);
    console.log('I18N object available:', typeof I18N !== 'undefined');
    console.log('I18N[LOCALE] available:', I18N && I18N[LOCALE] ? 'yes' : 'no');
    
  document.documentElement.lang = LOCALE;
    
    // Batch DOM updates for better performance with safe innerHTML
    const updates = [
      { id: 'q', prop: 'placeholder', value: t('searchPH') },
      { id: 'pillCat', prop: 'textContent', value: t('pill') },
      { id: 'heroTitle', prop: 'textContent', value: t('heroTitle') },
      { id: 'heroSub', prop: 'textContent', value: t('heroSub') },
      { id: 'secFeatured', prop: 'textContent', value: t('featured') },
      { id: 'secPopular', prop: 'textContent', value: t('popular') },
      { id: 'menuNews', prop: 'textContent', value: t('menuNews') },
      { id: 'menuTutorial', prop: 'textContent', value: t('menuTutorial') },
      { id: 'menuAbout', prop: 'textContent', value: t('menuAbout') },
      { id: 'menuPolicy', prop: 'textContent', value: t('menuPolicy') },
      { id: 'menuContact', prop: 'textContent', value: t('menuContact') }
    ];
    
    // Apply updates efficiently
    updates.forEach(({ id, prop, value }) => {
      const element = document.getElementById(id);
      if (element && value) {
        element[prop] = value;
      }
    });
    
    // Handle special cases
    const aboutPostH1 = document.querySelector('#about h1');
    if (aboutPostH1) aboutPostH1.textContent = t('aboutTitle');
    
    const aboutContent = document.getElementById('aboutContent');
    if (aboutContent) aboutContent.innerHTML = t('aboutHTML');
    
    const policyPostH1 = document.querySelector('#policyPost h1');
    if (policyPostH1) policyPostH1.textContent = t('policyTitle');
    
    const contactPostH1 = document.querySelector('#contactPost h1');
    if (contactPostH1) contactPostH1.textContent = t('contactTitle');
    
    const policyContent = document.getElementById('policyContent');
    if (policyContent) policyContent.innerHTML = t('policyHTML');
    
    const contactContent = document.getElementById('contactContent');
    if (contactContent) contactContent.innerHTML = t('contactHTML');
    
  } catch (error) {
    console.error('I18N application error:', error);
  }
}

/* ======= Optimized Utils ======= */
function scrollToId(id) {
  try {
  const el = document.getElementById(id);
    if (!el) return;
    
  const header = document.querySelector('header');
  const offset = (header?.offsetHeight || 60) + 8;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  } catch (error) {
    console.warn('Scroll error:', error);
  }
}

// Secure slugify with XSS protection
function slugify(s) {
  if (typeof s !== 'string') return '';
  return s.trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Optimized date formatting with error handling
function fmtDate(iso) {
  try {
  const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleDateString(
      LOCALE === 'en' ? 'en-US' : 'id-ID',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid Date';
  }
}

// Secure array operations
function idxBySlug(slug) {
  try {
    if (!Array.isArray(ARTICLES)) return 0;
    return ARTICLES.findIndex(a => a.slug === slug) + 1;
  } catch (error) {
    console.warn('Index lookup error:', error);
    return 0;
  }
}

// Optimized canonical path generation
function canonicalPath(a) {
  try {
    if (!a || !a.published) return '/';
    
  const d = new Date(a.published);
    if (isNaN(d.getTime())) return '/';
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
  const index = idxBySlug(a.slug);
  const category = a.category ? `${a.category}-` : '';
    
  return `/${yyyy}/${mm}/${dd}/${index}-${category}${a.slug}`;
  } catch (error) {
    console.warn('Canonical path error:', error);
    return '/';
  }
}

/* ======= Secure Article Helpers ======= */

// Calculate reading time for analytics
function calculateReadingTime(content) {
  if (!content) return 0;
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Hyper-optimized shuffle function with Fisher-Yates algorithm
function shuffleArray(array) {
  try {
    if (!Array.isArray(array) || array.length <= 1) return array;
    const shuffled = array.slice(); // Faster than spread for large arrays
    let i = shuffled.length;
    while (--i > 0) {
    const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
    return shuffled;
  } catch (error) {
    console.warn('Array shuffle error:', error);
    return Array.isArray(array) ? [...array] : [];
}
}

function getRandomArticles(count) {
  try {
    if (!Array.isArray(ARTICLES) || count <= 0) return [];
    return shuffleArray(ARTICLES).slice(0, Math.min(count, ARTICLES.length));
  } catch (error) {
    console.warn('Random articles error:', error);
    return [];
  }
}

/* ======= Enhanced SEO helpers ======= */

/**
 * Find or create meta tag with null safety
 * @param {string} selector - CSS selector for meta tag
 * @param {string} attribute - Attribute to set (content, property, name)
 * @param {string} value - Value to set
 * @param {string} content - Content value (for content attribute)
 */
function findOrCreateMeta(selector, attribute, value, content = null) {
  let meta = document.querySelector(selector);
  
  if (!meta) {
    meta = document.createElement('meta');
    if (attribute === 'property') {
      meta.setAttribute('property', value);
    } else if (attribute === 'name') {
      meta.setAttribute('name', value);
    }
    document.head.appendChild(meta);
  }
  
  if (content !== null) {
    meta.content = content;
  }
  
  return meta;
}

/**
 * Find or create link tag with null safety
 * @param {string} rel - rel attribute value
 * @param {string} href - href value
 */
function findOrCreateLink(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  
  link.href = href;
  return link;
}

function updateSEOForArticle(a){
  try {
    const url = canonicalPath(a);
    const fullUrl = `https://maneh.blog${url}`;
    const siteTitle = typeof SITE_TITLE !== 'undefined' ? SITE_TITLE : 'Maneh — Tutorial & Tips Teknologi';
    
    // Update page title
    document.title = `${a.title} — ${siteTitle}`;
    
    // Update canonical URL with null safety
    const canonEl = document.getElementById('canon');
    if (canonEl) {
      canonEl.href = fullUrl;
    } else {
      findOrCreateLink('canonical', fullUrl);
    }
    
    // Ensure canonical uses current origin + pathname
    const currentCanonical = location.origin + location.pathname;
    if (canonEl) {
      canonEl.href = currentCanonical;
    } else {
      findOrCreateLink('canonical', currentCanonical);
    }
    
    // Update meta description with null safety
    findOrCreateMeta('meta[name="description"]', 'name', 'description', a.summary || 'Tutorial lengkap dengan panduan step-by-step.');
    
    // Update Open Graph tags with null safety
    const ogTitleEl = document.getElementById('ogTitle');
    const ogDescEl = document.getElementById('ogDesc');
    const ogImageEl = document.getElementById('ogImage');
    const ogUrlEl = document.getElementById('ogUrl');
    
    if (ogTitleEl) ogTitleEl.content = `${a.title} | Maneh Blog`;
    else findOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', `${a.title} | Maneh Blog`);
    
    if (ogDescEl) ogDescEl.content = `${a.summary} | Tutorial lengkap dengan panduan step-by-step di Maneh.`;
    else findOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', `${a.summary} | Tutorial lengkap dengan panduan step-by-step di Maneh.`);
    
    if (ogImageEl) ogImageEl.content = a.cover;
    else findOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', a.cover);
    
    if (ogUrlEl) ogUrlEl.content = fullUrl;
    else findOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', fullUrl);
    
    // Update Twitter tags with null safety
    findOrCreateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    findOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', `${a.title} | Maneh Blog`);
    findOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', `${a.summary} | Tutorial lengkap dengan panduan step-by-step di Maneh.`);
    findOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', a.cover);
    findOrCreateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', fullUrl);
    
    // Enhanced Article Structured Data
  let ld = document.getElementById('ld-article');
    if(!ld){ 
      ld = document.createElement('script'); 
      ld.type='application/ld+json'; 
      ld.id='ld-article'; 
      document.head.appendChild(ld); 
    }
    
    // Get article reading time estimate
    const wordCount = a.html.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    // Get category articles for related content
    const categoryArticles = ARTICLES.filter(art => art.category === a.category && art.slug !== a.slug);
    const relatedArticles = categoryArticles.slice(0, 3).map(art => ({
      "@type": "Article",
      "headline": art.title,
      "url": `https://maneh.blog${canonicalPath(art)}`,
      "image": art.cover,
      "datePublished": art.published
    }));
    
  ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": a.title,
      "description": a.summary,
      "image": [a.cover],
      "datePublished": a.published,
      "dateModified": a.published,
      "author": {
        "@type": "Person",
        "name": "Penjaga",
        "url": "https://maneh.blog"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Maneh",
        "url": "https://maneh.blog",
        "logo": {
          "@type": "ImageObject",
          "url": "https://maneh.blog/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      },
    "inLanguage": LOCALE==='en'?'en-US':'id-ID',
      "wordCount": wordCount,
      "timeRequired": `PT${readingTime}M`,
      "articleSection": a.category || "Technology",
      "keywords": a.tags ? a.tags.join(', ') : "tutorial teknologi, tips teknologi",
      "about": {
        "@type": "Thing",
        "name": "Teknologi",
        "description": "Tutorial dan tips teknologi terbaru"
      },
      "mentions": relatedArticles,
      "isPartOf": {
        "@type": "Blog",
        "name": "Maneh Blog",
        "url": "https://maneh.blog"
      }
    });
    
    // Update breadcrumb structured data
    updateBreadcrumbStructuredData(a);
    
    console.log('SEO updated for article:', a.title);
  } catch (error) {
    console.error('SEO update error:', error);
  }
}

function resetSEOHome(){
  try {
    // Reset canonical URL
    document.getElementById('canon').href = 'https://maneh.blog/';
    
    // Reset page title using SITE_TITLE
    document.title = typeof SITE_TITLE !== 'undefined' ? SITE_TITLE : 'Maneh — Tutorial & Tips Teknologi Terlengkap 2025';
    
    // Reset meta description using SITE_DESC
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = typeof SITE_DESC !== 'undefined' ? SITE_DESC : 'Maneh: platform tutorial & tips teknologi terlengkap dengan bahasa sederhana, panduan step-by-step, dan bisa langsung dipraktikkan. Update terbaru 2025!';
    }
    
    // Reset Open Graph tags with null checks
    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDesc');
    const ogImage = document.getElementById('ogImage');
    const ogUrl = document.getElementById('ogUrl');
    
    if (ogTitle) ogTitle.content = 'Maneh — Tutorial & Tips Teknologi Terlengkap 2025';
    if (ogDesc) ogDesc.content = 'Maneh: platform tutorial & tips teknologi terlengkap dengan bahasa sederhana, panduan step-by-step, dan bisa langsung dipraktikkan. Update terbaru 2025!';
    if (ogImage) ogImage.content = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&h=630&auto=format&fit=crop&crop=center';
    if (ogUrl) ogUrl.content = 'https://maneh.blog/';
    
    // Reset Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (twitterTitle) twitterTitle.content = 'Maneh — Tutorial & Tips Teknologi Terlengkap 2025';
    if (twitterDesc) twitterDesc.content = 'Maneh: platform tutorial & tips teknologi terlengkap dengan bahasa sederhana, panduan step-by-step, dan bisa langsung dipraktikkan. Update terbaru 2025!';
    if (twitterImage) twitterImage.content = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&h=630&auto=format&fit=crop&crop=center';
    if (twitterUrl) twitterUrl.content = 'https://maneh.blog/';
    
    // Remove article structured data
    const ld = document.getElementById('ld-article'); 
    if(ld) ld.remove();
    
    // Update breadcrumb for home
    updateBreadcrumbStructuredData(null);
    
    console.log('SEO reset to home page');
  } catch (error) {
    console.error('SEO reset error:', error);
  }
}

/**
 * Update SEO for category pages
 * @param {string} categoryName - Category name
 * @param {number} articleCount - Number of articles
 */
function updateSEOForCategory(categoryName, articleCount) {
  try {
    const cleanCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    const categoryUrl = `https://maneh.blog/#category/${categoryName}`;
    
    // Update page title
    const siteTitle = typeof SITE_TITLE !== 'undefined' ? SITE_TITLE : 'Maneh Blog';
    document.title = `Category: ${cleanCategoryName} — ${siteTitle}`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = `Koleksi ${articleCount} tutorial dan tips ${cleanCategoryName.toLowerCase()} terbaru. Panduan lengkap dengan bahasa sederhana dan bisa langsung dipraktikkan.`;
    }
    
    // Update canonical URL
    const canon = document.getElementById('canon');
    if (canon) canon.href = categoryUrl;
    
    // Update Open Graph tags
    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDesc');
    const ogUrl = document.getElementById('ogUrl');
    
    if (ogTitle) ogTitle.content = `${cleanCategoryName} - Tutorial & Tips | Maneh Blog`;
    if (ogDesc) ogDesc.content = `Koleksi ${articleCount} tutorial dan tips ${cleanCategoryName.toLowerCase()} terbaru di Maneh.`;
    if (ogUrl) ogUrl.content = categoryUrl;
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (twitterTitle) twitterTitle.content = `${cleanCategoryName} - Tutorial & Tips | Maneh Blog`;
    if (twitterDesc) twitterDesc.content = `Koleksi ${articleCount} tutorial dan tips ${cleanCategoryName.toLowerCase()} terbaru di Maneh.`;
    if (twitterUrl) twitterUrl.content = categoryUrl;
    
  } catch (error) {
    console.error('Error updating SEO for category:', error);
  }
}

/**
 * Update SEO for tag pages
 * @param {string} tagName - Tag name
 * @param {number} articleCount - Number of articles
 */
function updateSEOForTag(tagName, articleCount) {
  try {
    const cleanTagName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
    const tagUrl = `https://maneh.blog/#tag/${tagName}`;
    
    // Update page title
    const siteTitle = typeof SITE_TITLE !== 'undefined' ? SITE_TITLE : 'Maneh Blog';
    document.title = `Tag: ${cleanTagName} - ${articleCount} Artikel | ${siteTitle}`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = `Temukan ${articleCount} artikel dengan tag "${cleanTagName}". Tutorial dan tips teknologi terbaru dengan panduan lengkap.`;
    }
    
    // Update canonical URL
    const canon = document.getElementById('canon');
    if (canon) canon.href = tagUrl;
    
    // Update Open Graph tags
    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDesc');
    const ogUrl = document.getElementById('ogUrl');
    
    if (ogTitle) ogTitle.content = `Tag: ${cleanTagName} - ${articleCount} Artikel | Maneh Blog`;
    if (ogDesc) ogDesc.content = `Temukan ${articleCount} artikel dengan tag "${cleanTagName}" di Maneh.`;
    if (ogUrl) ogUrl.content = tagUrl;
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (twitterTitle) twitterTitle.content = `Tag: ${cleanTagName} - ${articleCount} Artikel | Maneh Blog`;
    if (twitterDesc) twitterDesc.content = `Temukan ${articleCount} artikel dengan tag "${cleanTagName}" di Maneh.`;
    if (twitterUrl) twitterUrl.content = tagUrl;
    
  } catch (error) {
    console.error('Error updating SEO for tag:', error);
  }
}

/**
 * Image optimization with fallback and lazy loading
 * @param {string} imageUrl - Original image URL
 * @param {string} alt - Alt text
 * @param {string} className - CSS class
 * @returns {string} Optimized image HTML
 */
function createOptimizedImage(imageUrl, alt = '', className = '') {
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjAwSDQ1MFYyNTBIMzUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
  
  return `
    <img 
      src="${imageUrl}" 
      alt="${alt}" 
      class="${className}"
      loading="lazy" 
      decoding="async"
      onerror="this.src='${fallbackImage}'; this.onerror=null;"
      style="width: 100%; height: auto;"
    />
  `;
}

// Global fallback for all images
document.addEventListener('DOMContentLoaded', function() {
  // Add fallback to all images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.onerror) {
      img.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjAwSDQ1MFYyNTBIMzUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
        this.onerror = null;
      };
    }
  });
});

/**
 * Validate and optimize all images in article content
 * @param {string} htmlContent - HTML content with images
 * @returns {string} Optimized HTML content
 */
function optimizeImagesInContent(htmlContent) {
  if (!htmlContent) return htmlContent;
  
  // Add lazy loading and error handling to existing images
  return htmlContent.replace(
    /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
    (match, before, src, after) => {
      // Check if already has loading attribute
      if (match.includes('loading=')) return match;
      
      // Add lazy loading and error handling
      return `<img${before}src="${src}"${after} loading="lazy" decoding="async" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjAwSDQ1MFYyNTBIMzUwVjIwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K'; this.onerror=null;">`;
    }
  );
}

// Enhanced breadcrumb structured data
function updateBreadcrumbStructuredData(article) {
  try {
    let breadcrumb = document.getElementById('ld-breadcrumb');
    if (!breadcrumb) {
      breadcrumb = document.createElement('script');
      breadcrumb.type = 'application/ld+json';
      breadcrumb.id = 'ld-breadcrumb';
      document.head.appendChild(breadcrumb);
    }
    
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://maneh.blog/"
        }
      ]
    };
    
    if (article) {
      // Add category breadcrumb
      if (article.category) {
        breadcrumbList.itemListElement.push({
          "@type": "ListItem",
          "position": 2,
          "name": article.category.charAt(0).toUpperCase() + article.category.slice(1),
          "item": `https://maneh.blog/#category/${article.category}`
        });
      }
      
      // Add article breadcrumb
      breadcrumbList.itemListElement.push({
        "@type": "ListItem",
        "position": breadcrumbList.itemListElement.length + 1,
        "name": article.title,
        "item": `https://maneh.blog${canonicalPath(article)}`
      });
    }
    
    breadcrumb.textContent = JSON.stringify(breadcrumbList);
  } catch (error) {
    console.error('Breadcrumb structured data error:', error);
  }
}

/* ======= Render list grid ======= */
function renderList(items=ARTICLES){
  console.log('Rendering list with', items.length, 'items');
  const box = document.getElementById('list');
  if (!box) {
    console.error('List container not found!');
    return;
  }
  
  const html = items.map(a => {
    // Generate new URL format
    const date = new Date(a.published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get order number based on category and published date
    const categoryArticles = ARTICLES.filter(art => art.category === a.category)
      .sort((x, y) => new Date(y.published) - new Date(x.published));
    const order = categoryArticles.findIndex(art => art.slug === a.slug) + 1;
    
    const newUrl = `/${year}/${month}/${day}/${order}-${a.slug}`;
    
    return `
      <a href="${newUrl}" data-slug="${a.slug}" class="card">
      <img class="thumb" loading="lazy" decoding="async" src="${a.cover}" alt="${a.title}">
      <div class="h2">${a.title}</div>
      <div class="meta"><time datetime="${a.published}">${fmtDate(a.published)}</time></div>
      <p class="desc">${a.summary}</p>
    </a>
    `;
  }).join('');
  
  // Safe HTML rendering
  if (typeof DOMPurify !== 'undefined') {
    box.innerHTML = DOMPurify.sanitize(html);
  } else {
    box.innerHTML = html; // Fallback
  }
  console.log('List rendered, cards created:', box.querySelectorAll('.card').length);
}

/* Intercept semua <a data-slug> untuk URL baru */
function setupClickHandlers() {
document.addEventListener('click', (e)=>{
    console.log('Click detected on:', e.target);
    
    // Skip category and other navigation links
    const categoryLink = e.target.closest('a[href^="#category/"]');
    const otherNavLink = e.target.closest('a[href="#about"], a[href="#policy"], a[href="#contact"]');
    if (categoryLink || otherNavLink) {
      console.log('Category or navigation link clicked, allowing default behavior');
      console.log('Link href:', categoryLink ? categoryLink.href : otherNavLink.href);
      console.log('Target element:', e.target);
      console.log('Closest link element:', categoryLink || otherNavLink);
      
      // For About and Policy links, ensure they work properly
      if (otherNavLink) {
        console.log('About/Policy link clicked, ensuring navigation works');
        // Let the default behavior handle the navigation
        return;
      }
      return;
    }
    
  // Check for internal links (including index.html)
  const internalLink = e.target.closest('a[href^="/"], a[href^="./"], a[href^="../"]');
  if (internalLink) {
    const href = internalLink.getAttribute('href');
    
    // Check if it's an index.html link or root link
    if (href === '/' || href === '/index.html' || href.endsWith('/index.html')) {
      console.log('Internal home link found:', href);
      e.preventDefault();
      e.stopPropagation();
      
      // Normalize to root path
      const normalizedHref = href.replace(/\/index\.html$/, '/');
      
      // Use History API to navigate
      history.pushState({ type: 'home' }, '', normalizedHref);
      
      // Trigger debounced route function
      debouncedRoute();
      return;
    }
  }
  
  // Check for article links with pathname format
  const articleLink = e.target.closest('a[href^="/"][data-slug]');
  if (articleLink) {
    console.log('Article link found (pathname format):', articleLink);
    e.preventDefault();
    e.stopPropagation();
    
    const href = articleLink.getAttribute('href');
    const slug = articleLink.dataset.slug;
    
    if (href && slug) {
      console.log('Navigating to article URL:', href, 'slug:', slug);
      
      // Use History API to navigate
      history.pushState({ type: 'post', slug: slug }, '', href);
      
      // Trigger debounced route function to handle the new pathname
      debouncedRoute();
    } else {
      console.warn('Invalid article link - missing href or slug');
    }
    return;
  }
  
  // Check for hash-based article links (backward compatibility)
  const hashLink = e.target.closest('a[href^="#p/"], a[href^="#post/"]');
  if (hashLink) {
    console.log('Article link found (hash format):', hashLink);
    e.preventDefault();
    e.stopPropagation();
    
    const href = hashLink.getAttribute('href');
    const slug = hashLink.dataset.slug;
    
    if (href && slug) {
      console.log('Converting hash link to pathname format');
      
      // Generate new URL format
      const article = ARTICLES.find(art => art.slug === slug);
      if (article) {
        const date = new Date(article.published);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const categoryArticles = ARTICLES.filter(art => art.category === article.category)
          .sort((a, b) => new Date(b.published) - new Date(a.published));
        const order = categoryArticles.findIndex(art => art.slug === slug) + 1;
        
        const newUrl = `/${year}/${month}/${day}/${order}-${slug}`;
        console.log('Converting to new URL:', newUrl);
        history.pushState(null, '', newUrl);
        debouncedRoute();
      }
    }
    return;
  }
  });
}

/* ======= Router + Reader ======= */
function show(sectionId){
  console.log('Showing section:', sectionId);
  document.querySelectorAll('.page').forEach(s=>{
    console.log('Hiding page:', s.id, 'current display:', s.style.display);
    s.style.display='none';
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display='block';
    targetSection.style.visibility='visible';
    targetSection.style.opacity='1';
    console.log('Section displayed:', sectionId, 'new display:', targetSection.style.display);
    console.log('Section visibility:', window.getComputedStyle(targetSection).display);
    
    // Force reflow to ensure display change takes effect
    targetSection.offsetHeight;
    
    // Double check after a short delay
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(targetSection);
      console.log('Final section state:', {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity
      });
    }, 100);
  } else {
    console.error('Section not found:', sectionId);
  }
}
function renderReader(slug, queryStr) {
  try {
    console.log('Rendering reader for slug:', slug);
    console.log('Available articles:', ARTICLES?.length || 0);
    
    // Input validation
    if (!slug || typeof slug !== 'string') {
      console.warn('Invalid slug provided');
      location.hash = '#';
      return;
    }
    
    const a = ARTICLES?.find(x => x.slug === slug);
    if (!a) { 
      console.warn('Article not found for slug:', slug);
      console.log('Available slugs:', ARTICLES?.map(x => x.slug) || []);
      location.hash = '#';
      return; 
    }
    console.log('Found article:', a.title);
    
    // Analytics tracking for article view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: a.title,
        page_location: window.location.href,
        content_group1: a.category,
        custom_parameter_1: a.category,
        custom_parameter_2: calculateReadingTime(a.content)
      });
      
      // Track article engagement
      trackArticleView(a.title, a.category);
    }
    
    const post = document.getElementById('post');
    if (!post) {
      console.error('Post element not found!');
      return;
    }
    
    // ENHANCED SECURITY: Multi-layer HTML sanitization
    let cleanHTML = '';
    let cleanTitle = '';
    
    try {
      // Sanitize title
      cleanTitle = DOMPurify ? DOMPurify.sanitize(a.title) : a.title.replace(/[<>]/g, '');
      
      // Sanitize HTML content with multiple layers
      if (typeof DOMPurify !== 'undefined') {
        cleanHTML = DOMPurify.sanitize(a.html, {
          ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'b', 'i', 'br', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'div', 'span', 'code', 'pre'],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'datetime', 'loading', 'decoding'],
          ALLOW_DATA_ATTR: false,
          ALLOW_UNKNOWN_PROTOCOLS: false,
          SANITIZE_DOM: true,
          KEEP_CONTENT: true
        });
        console.log('HTML sanitized with DOMPurify');
      } else {
        console.warn('DOMPurify not available, using enhanced basic sanitization');
        // Enhanced basic sanitization fallback
        cleanHTML = a.html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
          .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .replace(/javascript:/gi, '');
      }
    } catch (error) {
      console.error('HTML sanitization error:', error);
      cleanTitle = 'Error loading article';
      cleanHTML = '<p>Sorry, there was an error loading this article.</p>';
    }
    
    // Optimize images in content
    const optimizedHTML = optimizeImagesInContent(cleanHTML);
    
    // Secure DOM update
    post.innerHTML = `<h1 id="post-top">${cleanTitle}</h1>${optimizedHTML}`;
    console.log('Article content rendered securely with optimized images');
    
    // Ensure the post element is visible
    post.style.display = 'block';
    post.style.visibility = 'visible';
    post.style.opacity = '1';

  /* Hero figure = cover */
  const firstImg = post.querySelector('img.thumb');
  if(!firstImg){
    const fig = document.createElement('figure'); fig.className='heroFigure';
    fig.innerHTML = `<img class="thumb" src="${a.cover}" alt="${a.title}" loading="eager" decoding="async" fetchpriority="high"><figcaption class="caption">${a.title}</figcaption>`;
    post.prepend(fig);
  }

  /* Meta dengan avatar, nama Penjaga, dan badge verified */
  const meta = post.querySelector('.meta') || document.createElement('div');
  meta.className='meta author';
  meta.innerHTML = `
    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=88&h=88&fit=crop&crop=face" 
         alt="Avatar Penjaga" 
         class="author-avatar"
         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjIiIGN5PSIyMiIgcj0iMjIiIGZpbGw9IiMyNTYzZWIiLz4KPHRleHQgeD0iMjIiIHk9IjI4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QPC90ZXh0Pgo8L3N2Zz4K'; this.onerror=null;">
    <div>
      <div class="author-name">
        Penjaga 
        <svg class="badge-verified" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1da1f2"/>
        </svg>
      </div>
      <time datetime="${a.published}">${fmtDate(a.published)}</time>
    </div>
  `;
  const h1 = post.querySelector('h1'); if(h1 && meta.parentNode!==post){ h1.after(meta); }

  /* Tampilkan Tags */
  post.querySelectorAll('.tags-container').forEach(n => n.remove()); // Hapus yg lama jika ada
  if (a.tags && a.tags.length > 0) {
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags-container';
    tagsContainer.innerHTML = a.tags.map(tag => 
      `<a href="#tag/${slugify(tag)}" class="tag-item">${tag}</a>`
    ).join('');
    meta.after(tagsContainer);
  }

  // ToC
  if (window._mountTOC) { window._mountTOC(slug); }

  // Scroll target (?s=)
  const params = new URLSearchParams(queryStr||'');
  const sec = params.get('s');
  setTimeout(()=>scrollToId(sec || 'post'), 30);

  // Side lists
  const others=ARTICLES.filter(x=>x.slug!==slug);
  document.getElementById('pilihan').innerHTML = others.slice(0,3).map(x=>{
    // Generate new URL format
    const date = new Date(x.published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const categoryArticles = ARTICLES.filter(art => art.category === x.category)
      .sort((a, b) => new Date(b.published) - new Date(a.published));
    const order = categoryArticles.findIndex(art => art.slug === x.slug) + 1;
    
    const newUrl = `/${year}/${month}/${day}/${order}-${x.slug}`;
    
    return `
      <a href="${newUrl}" data-slug="${x.slug}" class="sideItem">
      <img loading="lazy" decoding="async" src="${x.cover}" alt="${x.title}">
      <div><div style="font-weight:700">${x.title}</div><div class="meta"><time datetime="${x.published}">${fmtDate(x.published)}</time></div></div>
      </a>
    `;
  }).join('');
  document.getElementById('populer').innerHTML = others.slice(0,4).map((x,i)=>{
    // Generate new URL format
    const date = new Date(x.published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const categoryArticles = ARTICLES.filter(art => art.category === x.category)
      .sort((a, b) => new Date(b.published) - new Date(a.published));
    const order = categoryArticles.findIndex(art => art.slug === x.slug) + 1;
    
    const newUrl = `/${year}/${month}/${day}/${order}-${x.slug}`;
    
    return `
      <a href="${newUrl}" data-slug="${x.slug}" class="rank">
      <div class="dot">#${i+1}</div><div style="font-weight:700">${x.title}</div>
      </a>
    `;
  }).join('');


  // Generate new URL format: /2025/09/25/1-era-baru-sinema-ai-sora
  const article = ARTICLES.find(a => a.slug === slug);
  if (article) {
    const date = new Date(article.published);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get order number based on category and published date
    const categoryArticles = ARTICLES.filter(a => a.category === article.category)
      .sort((a, b) => new Date(b.published) - new Date(a.published));
    const order = categoryArticles.findIndex(a => a.slug === slug) + 1;
    
    const newUrl = `/${year}/${month}/${day}/${order}-${slug}`;
    history.replaceState(null, '', newUrl);
    console.log('New URL generated:', newUrl);
  } else {
    // Fallback to old format
  history.replaceState(null, '', window.location.pathname + window.location.search + `#p/${slug}`);
  }
  // SEO already updated in renderPost, don't update again
  show('reader');
  console.log('✅ Reader page should now be visible');
  
  } catch (error) {
    console.error('Render reader error:', error);
    // Show error page instead of redirecting to home
    const post = document.getElementById('post');
    if (post) {
      post.innerHTML = `
        <h1>Error Loading Article</h1>
        <p>Maaf, terjadi kesalahan saat memuat artikel.</p>
        <p><a href="/">← Kembali ke Beranda</a></p>
      `;
    }
    show('reader');
  }
}

/**
 * Render article post with proper SEO and navigation
 * @param {Object} article - Article object from ARTICLES array
 */
function renderPost(article) {
  try {
    console.log('Rendering post:', article.title);
    
    // Update SEO for article first
    updateSEOForArticle(article);
    
    // Render the article content
    renderReader(article.slug);
    
    // Show reader section
    show('reader');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    console.log('✅ Post rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering post:', error);
    render404();
  }
}

/**
 * Render 404 page
 */
function render404() {
  console.log('Rendering 404 page');
  show('reader');
  const post = document.getElementById('post');
  if (post) {
    post.innerHTML = `
      <h1>Artikel Tidak Ditemukan</h1>
      <p>Maaf, artikel yang Anda cari tidak ditemukan.</p>
      <p><a href="/">← Kembali ke Beranda</a></p>
    `;
  }
}

function route(){
  const path = location.pathname;
  const hash = location.hash.slice(1).trim();
  console.log('Routing to path:', path);
  console.log('Routing to hash:', hash);

  // Normalize path - treat /index.html same as /
  const normalizedPath = path.replace(/\/index\.html$/, '/');
  
  // Handle root/home page FIRST
  if (normalizedPath === '/' || normalizedPath === '' || path.endsWith('/index.html')) {
    console.log('Handling home page (normalized path:', normalizedPath, ')');
    show('home');
    
    const q = document.getElementById('q');
    if (q) q.value = '';
    
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.textContent = t('heroTitle');
    
    const heroSub = document.getElementById('heroSub');
    if (heroSub) heroSub.textContent = t('heroSub');
    
    renderList(getRandomArticles(8));
    
    // Ensure URL is normalized to /
    if (path !== '/') {
      history.replaceState(null, '', '/');
    }
    
    resetSEOHome();
    console.log('Home page rendered successfully');
    return;
  }

  // Handle static pages SECOND (high priority)
  if (hash === 'about' || hash === 'policy' || hash === 'contact') {
    console.log('Handling static page:', hash);
    hideSearch();
    show(hash);
    closeDrawer();
    
    // Force apply I18N for static pages
    console.log('Force applying I18N for static page:', hash);
    applyI18N();
    
    console.log('Static page rendered successfully:', hash);
    return;
  }

  // Handle category page SECOND
  if (hash.startsWith('category/')) {
    console.log('Handling category page');
    const categoryName = decodeURIComponent(hash.slice(9));
    console.log('Category name:', categoryName);
    const cleanCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    const filteredArticles = ARTICLES.filter(a => a.category === categoryName);
    console.log('Filtered articles:', filteredArticles.length);
    
    show('home'); // Gunakan layout halaman utama
    
    const desc = CATEGORY_DESCRIPTIONS[categoryName] || `${filteredArticles.length} artikel ditemukan.`;
    document.getElementById('heroTitle').textContent = `${t('categoryLabel')}: ${cleanCategoryName}`;
    document.getElementById('heroSub').textContent = desc;
    renderList(filteredArticles); // Tampilkan artikel yang sudah difilter
    
    history.replaceState(null, '', window.location.pathname + window.location.search + `#category/${categoryName}`);
    updateSEOForCategory(categoryName, filteredArticles.length);
    closeDrawer();
    console.log('Category page rendered successfully');
    return;
  }

  // Handle article page - new URL format: /2025/09/25/1-era-baru-sinema-ai-sora
  console.log('Checking path for article format:', path);
  const articleMatch = path.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^\/#?]+)\/?$/);
  if(articleMatch){
    const year = articleMatch[1];
    const month = articleMatch[2];
    const day = articleMatch[3];
    const slugPart = articleMatch[4];
    
    // Extract slug from order-slug format
    const slugMatch = slugPart.match(/^\d+-(.+)$/);
    const slug = slugMatch ? slugMatch[1] : slugPart;
    
    console.log('✅ MATCH FOUND - Handling article page with new format');
    console.log('Article slug:', slug);
    console.log('Date:', year, month, day);
    console.log('Slug part:', slugPart);
    
    // Check if article exists
    const article = ARTICLES?.find(a => a.slug === slug);
    if (!article) {
      console.warn('Article not found for slug:', slug);
      console.log('Available slugs:', ARTICLES?.map(a => a.slug) || []);
      // Render 404 page instead of redirecting to home
      render404();
      return;
    }
    
    console.log('Found article:', article.title);
    hideSearch();
    
    // Render the article
    renderPost(article);
    
    console.log('Reader page should now be visible');
    return;
  }
  // Handle article page formats: #p/slug, #post/slug
  if (hash.startsWith('p/') || hash.startsWith('post/')) {
    console.log('Handling article page (hash format)');
    hideSearch();
    const rest = hash.startsWith('p/') ? hash.slice(2) : hash.slice(5);
    const [slug, queryStr] = rest.split('?');
    const cleanSlug = decodeURIComponent(slug).trim();
    console.log('Article slug:', cleanSlug);
    
    if (cleanSlug && cleanSlug.length > 0) {
      renderReader(cleanSlug, queryStr);
      return;
    } else {
      console.warn('Invalid slug, redirecting to home');
      location.hash = '#';
      return;
    }
  }


  // Handle tag page
  if (hash.startsWith('tag/')) {
    const tagName = decodeURIComponent(hash.slice(4));
    const cleanTagName = tagName.replace(/-/g, ' '); // for display
    const filteredArticles = ARTICLES.filter(a => a.tags && a.tags.map(t => slugify(t)).includes(tagName));
    
    show('home');
    
    const desc = `${filteredArticles.length} artikel ditemukan dengan tag ini.`;
    document.getElementById('heroTitle').textContent = `${t('tagLabel')}: "${cleanTagName}"`;
    document.getElementById('heroSub').textContent = desc;
    renderList(filteredArticles);
    
    history.replaceState(null, '', window.location.pathname + window.location.search + `#tag/${tagName}`);
    updateSEOForTag(tagName, filteredArticles.length);
    return;
  }


  // Handle unknown routes - only fallback if truly unrecognized
  // Don't log UNKNOWN ROUTE for /index.html as it should be treated as home
  if (!path.endsWith('/index.html')) {
    console.log('❌ UNKNOWN ROUTE - Hash not recognized:', hash);
    console.log('Path was:', path);
    console.log('Hash was:', hash);
  }
  
  // Check if it might be a malformed article slug (no prefix)
  const possibleSlug = hash.toLowerCase().trim();
  if (possibleSlug && possibleSlug.length > 3 && !possibleSlug.includes('/')) {
    console.log('Attempting to treat as article slug:', possibleSlug);
    const article = ARTICLES?.find(a => a.slug === possibleSlug);
    if (article) {
      console.log('Found article by slug, redirecting to proper format');
      location.hash = `#p/${possibleSlug}`;
      return;
    }
  }
  
  // Only fallback to home if truly unrecognized
  console.log('Redirecting to home page');
  location.hash = '#';
}
// Unit tests for routing (lightweight)
function testRouting() {
  const testCases = [
    { hash: '#', expected: 'home' },
    { hash: '#home', expected: 'home' },
    { hash: '#p/test-slug', expected: 'article' },
    { hash: '#post/test-slug', expected: 'article' },
    { hash: '#category/news', expected: 'category' },
    { hash: '#tag/ai', expected: 'tag' },
    { hash: '#about', expected: 'static' },
    { hash: '#policy', expected: 'static' },
    { hash: '#contact', expected: 'static' }
  ];
  
  console.log('🧪 Running routing tests...');
  testCases.forEach(test => {
    const originalHash = location.hash;
    location.hash = test.hash;
    const hash = location.hash.slice(1).trim();
    
    let result = 'unknown';
    if (!hash || hash === '' || hash === 'home') result = 'home';
    else if (hash === 'about' || hash === 'policy' || hash === 'contact') result = 'static';
    else if (hash.startsWith('category/')) result = 'category';
    else if (hash.startsWith('tag/')) result = 'tag';
    else if (hash.startsWith('p/') || hash.startsWith('post/')) result = 'article';
    
    const passed = result === test.expected;
    console.log(`${passed ? '✅' : '❌'} ${test.hash} → ${result} (expected: ${test.expected})`);
    
    location.hash = originalHash;
  });
  console.log('🧪 Routing tests completed');
}

// Run tests in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.testRouting = testRouting;
  console.log('💡 Call testRouting() to run routing tests');
}

// Debounced route handler to prevent double rendering
let routeInProgress = false;
const debouncedRoute = debounce(() => {
  if (routeInProgress) {
    console.log('⚠️ Route already in progress, skipping...');
    return;
  }
  
  routeInProgress = true;
  console.log('🔄 Starting route...');
  
  try {
    route();
  } finally {
    // Reset flag after a short delay to allow for async operations
    setTimeout(() => {
      routeInProgress = false;
      console.log('✅ Route completed');
    }, 100);
  }
}, 120);

// Debounced hashchange handler for better performance
const debouncedHashChange = debounce(() => {
  console.log('Hash changed to:', location.hash);
  debouncedRoute();
}, 120);

// Debounced popstate handler for better performance
const debouncedPopstate = debounce(() => {
  console.log('Popstate event, path:', location.pathname);
  debouncedRoute();
}, 120);

// Add event listeners only once
if (!window.routeListenersAdded) {
  window.addEventListener('hashchange', debouncedHashChange);
  window.addEventListener('popstate', debouncedPopstate);
  window.onpopstate = debouncedPopstate;
  window.routeListenersAdded = true;
  console.log('✅ Route listeners added');
}

// Global interceptor for all internal links to prevent full page reloads
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href]');
  if (!link) return;
  
  const href = link.getAttribute('href');
  
  // Check if it's an internal link that should be handled by SPA
  if (href && (
    href === '/' || 
    href === '/index.html' || 
    href.endsWith('/index.html') ||
    href.startsWith('/') && !href.startsWith('//') // Internal absolute paths
  )) {
    // Don't prevent if it's already handled by specific handlers above
    if (e.defaultPrevented) return;
    
    console.log('🔄 Intercepting internal link:', href);
    e.preventDefault();
    
    // Normalize path
    const normalizedHref = href.replace(/\/index\.html$/, '/');
    
    // Use History API
    history.pushState({ type: 'internal' }, '', normalizedHref);
    
    // Trigger debounced route
    debouncedRoute();
  }
});

/* ======= Search ======= */
const q=document.getElementById('q');
const qResults=document.getElementById('qResults');
let qTimer=null, qActiveIndex=-1;

// Debounce function already defined above

function renderQuickResults(term){
  const v = term.trim().toLowerCase();
  if(v.length<2){ qResults.classList.remove('show'); qResults.innerHTML=''; qActiveIndex=-1; return; }
  const filtered = ARTICLES.filter(a => (a.title+' '+a.summary).toLowerCase().includes(v));
  qResults.innerHTML = filtered.length
    ? filtered.map(a=>{
        // Generate new URL format for search results
        const date = new Date(a.published);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const categoryArticles = ARTICLES.filter(art => art.category === a.category)
          .sort((x, y) => new Date(y.published) - new Date(x.published));
        const order = categoryArticles.findIndex(art => art.slug === a.slug) + 1;
        
        const newUrl = `/${year}/${month}/${day}/${order}-${a.slug}`;
        
        return `
          <a href="${newUrl}" data-slug="${a.slug}">
            <img loading="lazy" decoding="async" src="${a.cover}" alt="">
            <div>
              <div class="hit-title">${a.title}</div>
              <div class="hit-meta"><time datetime="${a.published}">${fmtDate(a.published)}</time></div>
            </div>
          </a>`;
      }).join('') : `<div style="padding:12px;color:var(--muted)">${t('noResultsFor')} &ldquo;${term}&rdquo;.</div>`;
  qResults.classList.add('show');
  qActiveIndex=-1;
}

// Create debounced search function
const debouncedSearch = debounce((term) => {
  const filtered = ARTICLES.filter(a => (a.title + a.summary).toLowerCase().includes(term.toLowerCase()));
  if (document.getElementById('home').style.display !== 'none') { 
    renderList(filtered); 
  }
    renderQuickResults(term);
}, 160);

q?.addEventListener('input', e => {
  const term = e.target.value;
  debouncedSearch(term);
});
q?.addEventListener('keydown',e=>{
  const items = Array.from(qResults.querySelectorAll('a[data-slug]'));
  if(e.key==='ArrowDown' && items.length){
    e.preventDefault(); qActiveIndex = (qActiveIndex+1)%items.length; items.forEach(n=>n.classList.remove('active')); items[qActiveIndex].classList.add('active'); items[qActiveIndex].scrollIntoView({block:'nearest'});
  }else if(e.key==='ArrowUp' && items.length){
    e.preventDefault(); qActiveIndex = (qActiveIndex-1+items.length)%items.length; items.forEach(n=>n.classList.remove('active')); items[qActiveIndex].classList.add('active'); items[qActiveIndex].scrollIntoView({block:'nearest'});
  }else if(e.key==='Enter'){
    e.preventDefault();
    const target = (qActiveIndex>=0?items[qActiveIndex]:qResults.querySelector('a[data-slug]'));
    if(target){ target.click(); }
  }else if(e.key==='Escape'){
    qResults.classList.remove('show');
    document.getElementById('searchBar').classList.remove('show');
  }
});
function hideSearch() {
  qResults.classList.remove('show');
  document.getElementById('searchBar').classList.remove('show');
  q.value = '';
}

qResults.addEventListener('click',e=>{
  const a = e.target.closest('a[data-slug]');
  if(!a) return;
  e.preventDefault();
  hideSearch();
  
  const href = a.getAttribute('href');
  const slug = a.dataset.slug;
  
  if (href && slug) {
    console.log('Search result clicked, navigating to:', href);
    history.pushState({ type: 'post', slug: slug }, '', href);
    debouncedRoute();
  } else {
    console.warn('Invalid search result link');
  }
});
window.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){
    e.preventDefault();
    document.getElementById('searchBar').classList.add('show');
    q.focus();
  }
});

/* ======= Drawer & global keyboard ======= */
/**
 * Open drawer with accessibility support
 */
function openDrawer() {
  const drawer = DOMCache.get('drawer');
  if (!drawer) return;
  
  drawer.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('noscroll');
}

/**
 * Close drawer with accessibility support
 */
function closeDrawer() {
  const drawer = DOMCache.get('drawer');
  if (!drawer) return;
  
  drawer.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('noscroll');
}

// Event listeners with null checks
const btnMenu = DOMCache.get('btnMenu');
const btnClose = DOMCache.get('btnClose');
const drawer = DOMCache.get('drawer');

if (btnMenu) btnMenu.onclick = openDrawer;
if (btnClose) btnClose.onclick = closeDrawer;
if (drawer) {
  const backdrop = drawer.querySelector('.backdrop');
  if (backdrop) backdrop.onclick = closeDrawer;
}
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDrawer();
    const searchBar = DOMCache.get('searchBar');
    if (searchBar) searchBar.classList.remove('show');
  }
});

/* ======= Search toggle ======= */
const btnSearch = document.getElementById('btnSearch');
if (btnSearch) {
  btnSearch.onclick = () => {
    const searchBar = DOMCache.get('searchBar');
    if (!searchBar) return;
    
    searchBar.classList.toggle('show');
    if (searchBar.classList.contains('show')) {
      const q = document.getElementById('searchInput');
      if (q) q.focus();
    }
  };
}
document.addEventListener('click',e=>{
  const bar = document.getElementById('searchBar');
  if(!bar.contains(e.target) && e.target.id!=='btnSearch'){
    qResults.classList.remove('show');
  }
  
  if (e.target.closest('a[href="#about"], a[href="#policy"], a[href="#contact"]')) {
    console.log('About/Policy link clicked in search handler:', e.target.closest('a[href="#about"], a[href="#policy"]'));
  }
});

/* ======= Share ======= */
function share(url,title){
  const u=encodeURIComponent(url), t=encodeURIComponent(title);
  document.getElementById('shareFb').href=`https://www.facebook.com/sharer/sharer.php?u=${u}`;
  document.getElementById('shareIg').href=`https://instagram.com/`;
  document.getElementById('shareX').href=`https://twitter.com/intent/tweet?url=${u}&text=${t}`;
  document.getElementById('shareYt').href=`https://youtube.com/`;
}
share(location.href,'Maneh &mdash; Tutorial & Tips Teknologi');

/* ======= Ad Management Removed ======= */

/* ======= Reading Progress Tracking ======= */
function initReadingProgress() {
  let readingStartTime = Date.now();
  let progressTracked = [];
  
  const trackProgress = () => {
    if (window.location.hash.startsWith('#p/')) {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      // Track at 25%, 50%, 75%, 100% intervals
      [25, 50, 75, 100].forEach(milestone => {
        if (scrollPercent >= milestone && !progressTracked.includes(milestone)) {
          progressTracked.push(milestone);
          
          if (typeof trackReadingProgress !== 'undefined') {
            trackReadingProgress(milestone);
          }
          
          // Track time spent reading
          if (milestone === 100) {
            const readingTime = Math.round((Date.now() - readingStartTime) / 1000);
            if (typeof gtag !== 'undefined') {
              gtag('event', 'article_complete', {
                'reading_time_seconds': readingTime,
                'event_category': 'engagement'
              });
            }
          }
        }
      });
    }
  };
  
  // Reset on new article (debounced)
  const debouncedReadingReset = debounce(() => {
    readingStartTime = Date.now();
    progressTracked = [];
  }, 120);
  
  window.addEventListener('hashchange', debouncedReadingReset);
  
  // Track progress on scroll
  window.addEventListener('scroll', trackProgress, { passive: true });
}

// Initialize reading progress tracking
document.addEventListener('DOMContentLoaded', initReadingProgress);

/* ======= Health Check for Monitoring ======= */
function healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.4',
    uptime: Math.round(performance.now() / 1000),
    services: {
      css: document.querySelector('link[href*="style.css"]') ? 'ok' : 'error',
      js: typeof ARTICLES !== 'undefined' && ARTICLES.length > 0 ? 'ok' : 'error',
      analytics: typeof gtag !== 'undefined' ? 'ok' : 'error',
      dompurify: typeof DOMPurify !== 'undefined' ? 'ok' : 'error',
      articles_count: ARTICLES?.length || 0,
      locale: LOCALE || 'unknown'
    },
    performance: {
      page_load: Math.round(performance.now()),
      memory_used: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'unknown'
    }
  };
}

// Expose health check for monitoring
window.healthCheck = healthCheck;

// Expose health endpoint via hash route (debounced)
const debouncedHealthCheck = debounce(() => {
  if (location.hash === '#health') {
    document.body.innerHTML = `<pre>${JSON.stringify(healthCheck(), null, 2)}</pre>`;
  }
}, 120);

window.addEventListener('hashchange', debouncedHealthCheck);

/* ======= Theme Toggle ======= */
(function initTheme() {
  const btnTheme = document.getElementById('btnTheme');
  if (!btnTheme) return;

  // Check for saved theme or system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  let isDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;

  function updateThemeUI(dark) {
    // Update document theme
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    
    // Update button icons
    const sunPath = btnTheme.querySelector('.sun');
    const moonPath = btnTheme.querySelector('.moon');
    if (sunPath) sunPath.style.display = dark ? 'none' : 'block';
    if (moonPath) moonPath.style.display = dark ? 'block' : 'none';
  }

  function setTheme(dark) {
    isDark = dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    updateThemeUI(dark);
  }

  // Initialize theme
  setTheme(isDark);

  // Handle button click
  btnTheme.addEventListener('click', () => setTheme(!isDark));

  // Handle system theme changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });
})();

/* ======= Init ======= */
// Initialize year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

function clearCache() {
  if ('serviceWorker' in navigator && 'caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('All caches cleared');
      location.reload();
    });
  }
}

/**
 * Initialize blog with proper error handling and performance optimization
 */
function initializeBlog() {
  try {
    console.log('Initializing Maneh blog...');
    
    // Initialize DOM cache
    DOMCache.init();
    
    // Validate required data
    if (typeof ARTICLES === 'undefined') {
      console.error('❌ ARTICLES not loaded! Check data.js file');
      return;
    }
    if (typeof I18N === 'undefined') {
      console.error('❌ I18N not loaded! Check data.js file');
      return;
    }
    
    console.log('✅ Data loaded successfully:', {
      articles: ARTICLES.length,
      i18n: typeof I18N !== 'undefined',
      dompurify: typeof DOMPurify !== 'undefined'
    });
    
    // Check if required elements exist
    const homeEl = document.getElementById('home');
    const readerEl = document.getElementById('reader');
    const postEl = document.getElementById('post');
    console.log('Home element:', homeEl ? 'found' : 'missing');
    console.log('Reader element:', readerEl ? 'found' : 'missing');
    console.log('Post element:', postEl ? 'found' : 'missing');
    
    // Setup click handlers first
    setupClickHandlers();
    
    // Ensure I18N is loaded before applying translations
    if (typeof I18N !== 'undefined') {
      detectAndApplyLocale(); // Run locale detection and initial render
      // Don't call route() here - it will be called from index.html after scripts load
      console.log('Initialization complete');
    } else {
      console.error('I18N not loaded, retrying...');
      setTimeout(() => {
        if (typeof I18N !== 'undefined') {
          detectAndApplyLocale();
          // Don't call route() here - it will be called from index.html after scripts load
        } else {
          console.error('I18N still not available after timeout');
        }
      }, 100);
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
  initializeBlog();
}

/* ======= ToC (bersih) ======= */
(function(){
  function cleanText(t){ return t.replace(/^\d+(\.\d+)?[.)]?\s+/, '').trim(); }
  window._buildTOC_clean = function(articleEl, slug){
    const headings = [...articleEl.querySelectorAll('h2, h3')];
    if(!headings.length) return null;
    let h2i = 0, h3i = 0;
    const items = []; const used = new Set();
    headings.forEach(h=>{
      const level = h.tagName === 'H2' ? 2 : 3;
      if(level===2){ h2i++; h3i=0; } else { h3i++; }
      const baseId = h.id || slugify(cleanText(h.textContent));
      let id = baseId || (level===2?'section':'sub');
      let k=2; while(used.has(id) || document.getElementById(id)){ id = baseId+'-'+(k++); }
      used.add(id); h.id=id;
      const label = level===2 ? `${h2i}.` : `${h2i}.${h3i}`;
      const pure = cleanText(h.textContent);
      h.textContent = `${label} ${pure}`;
      items.push({id, level, label, text: pure});
    });
    const wrap = document.createElement('div'); wrap.className='toc';
    const head = document.createElement('div'); head.className='toc-head';
    const title = document.createElement('div'); title.className='toc-title'; title.textContent = t('toc');
    const btn = document.createElement('button'); 
    btn.type='button'; btn.className='burger'; btn.setAttribute('aria-label','Tampilkan/Sembunyikan Daftar Isi'); 
    btn.setAttribute('aria-expanded','true');
    btn.innerHTML = `<svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
    head.appendChild(title); head.appendChild(btn); wrap.appendChild(head);
    const root = document.createElement('ol'); root.className='toc-ol'; wrap.appendChild(root);
    let stack=[root], curLevel=2;
    items.forEach(it=>{
      while(it.level>curLevel){ const ol=document.createElement('ol'); ol.className='toc-ol'; stack[stack.length-1].lastElementChild?.appendChild(ol); stack.push(ol); curLevel++; }
      while(it.level<curLevel){ stack.pop(); curLevel--; }
      const li=document.createElement('li');
      const a=document.createElement('a'); a.href='#'; a.textContent = `${it.label} ${it.text}`;
      a.addEventListener('click',(ev)=>{ 
        ev.preventDefault(); 
        scrollToId(it.id); 
        if(slug){ history.replaceState(null,'',`${canonicalPath(ARTICLES.find(x=>x.slug===slug))}#p/${slug}?s=${encodeURIComponent(it.id)}`);} 
      });
      li.appendChild(a); stack[stack.length-1].appendChild(li);
    });
    let collapsed = window.innerWidth < 760;
    if(collapsed){ wrap.classList.add('collapsed'); btn.setAttribute('aria-expanded','false'); }
    btn.addEventListener('click',()=>{ 
      wrap.classList.toggle('collapsed'); 
      btn.setAttribute('aria-expanded', String(!wrap.classList.contains('collapsed')));
    });
    return wrap;
  };
  window._mountTOC = function(slug){
    const post = document.getElementById('post');
    if(!post) return;
    post.querySelectorAll('.toc').forEach(n=>n.remove());
    const firstH2 = post.querySelector('h2');
    const toc = window._buildTOC_clean(post, slug);
    if(!toc) return;
    if(firstH2){ firstH2.parentNode.insertBefore(toc, firstH2); }
    else { post.appendChild(toc); }
  };
})();

/* ======= Comment Form ======= */
(function initCommentForm() {
  const commentForm = document.getElementById('commentForm');
  if (!commentForm) return;

  // Load saved user info
  function loadSavedInfo() {
    const savedName = localStorage.getItem('commentName');
    const savedEmail = localStorage.getItem('commentEmail');
    const savedWebsite = localStorage.getItem('commentWebsite');
    const savedRemember = localStorage.getItem('commentRemember') === 'true';
    
    if (savedName) document.getElementById('commentName').value = savedName;
    if (savedEmail) document.getElementById('commentEmail').value = savedEmail;
    if (savedWebsite) document.getElementById('commentWebsite').value = savedWebsite;
    if (savedRemember) document.getElementById('remember').checked = savedRemember;
  }

  // Save user info
  function saveUserInfo() {
    const saveInfo = document.getElementById('remember').checked;
    localStorage.setItem('commentRemember', saveInfo);
    
    if (saveInfo) {
      localStorage.setItem('commentName', document.getElementById('commentName').value);
      localStorage.setItem('commentEmail', document.getElementById('commentEmail').value);
      localStorage.setItem('commentWebsite', document.getElementById('commentWebsite').value);
    } else {
      localStorage.removeItem('commentName');
      localStorage.removeItem('commentEmail');
      localStorage.removeItem('commentWebsite');
    }
  }

  // Clear error messages
  function clearErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.classList.remove('show'));
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.setAttribute('aria-invalid', 'false');
      input.classList.remove('is-invalid');
    });
  }

  // Show error message
  function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);
    
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
    
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'true');
      inputEl.classList.add('is-invalid');
    }
  }

  // Validate form fields
  function validateForm() {
    clearErrors();
    let isValid = true;

    // Validate comment
    const comment = document.getElementById('commentText').value.trim();
    if (!comment) {
      showError('commentText', 'Komentar wajib diisi');
      isValid = false;
    }

    // Validate name
    const name = document.getElementById('commentName').value.trim();
    if (!name) {
      showError('commentName', 'Nama wajib diisi');
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('commentEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError('commentEmail', 'Email wajib diisi');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('commentEmail', 'Format email tidak valid');
      isValid = false;
    }

    // Validate website (optional)
    const website = document.getElementById('commentWebsite').value.trim();
    if (website) {
      try {
        new URL(website);
      } catch {
        showError('commentWebsite', 'Format URL tidak valid');
        isValid = false;
      }
    }

    return isValid;
  }

  // Handle form submission
  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = new FormData(commentForm);
    const commentData = {
      comment: formData.get('comment'),
      name: formData.get('name'),
      email: formData.get('email'),
      website: formData.get('website'),
      timestamp: new Date().toISOString()
    };

    // Save user info if checkbox is checked
    saveUserInfo();

    // Simulate comment submission (in real app, this would send to server)
    console.log('Comment submitted:', commentData);
    
    // Show success message
    alert('Komentar berhasil dikirim! Terima kasih atas feedback Anda.');
    
    // Reset form
    commentForm.reset();
    
    // Reload saved info
    loadSavedInfo();
  });

  // Real-time validation
  const inputs = commentForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.hasAttribute('required') && !this.value.trim()) {
        showError(this.id, 'Field ini wajib diisi');
      } else if (this.type === 'email' && this.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value.trim())) {
          showError(this.id, 'Format email tidak valid');
        }
      } else if (this.type === 'url' && this.value.trim()) {
        try {
          new URL(this.value.trim());
        } catch {
          showError(this.id, 'Format URL tidak valid');
        }
      }
    });

    input.addEventListener('input', function() {
      if (this.getAttribute('aria-invalid') === 'true') {
        this.setAttribute('aria-invalid', 'false');
        this.classList.remove('is-invalid');
        const errorEl = document.getElementById(this.id + 'Error');
        if (errorEl) {
          errorEl.classList.remove('show');
        }
      }
    });
  });

  // Load saved info on page load
  loadSavedInfo();
})();

/* ======= Blog Initialization - Cleaned ======= */
// Initialization handled above - duplicated code removed