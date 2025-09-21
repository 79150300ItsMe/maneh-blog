// Performance & Security Optimizations - Enhanced
'use strict';
history.scrollRestoration = 'manual';

// Performance monitoring
const perfStartTime = performance.now();
let metricsCollected = false;

// Suppress ad-related console errors
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  // Skip ad-related errors
  if (message.includes('scornfacultative') || 
      message.includes('preferencenail') ||
      message.includes('weirdopt') ||
      message.includes('torchfriendlypay') ||
      message.includes('professionaltrafficmonitor') ||
      message.includes('skinnycrawlinglax') ||
      message.includes('Content Security Policy') ||
      message.includes('net::ERR_FAILED')) {
    return; // Suppress these errors
  }
  originalConsoleError.apply(console, args);
};

// Global error handler to suppress ad errors
window.addEventListener('error', function(event) {
  const message = event.message || event.error?.message || '';
  // Suppress ad-related errors
  if (message.includes('scornfacultative') || 
      message.includes('preferencenail') ||
      message.includes('weirdopt') ||
      message.includes('Failed to fetch') ||
      event.filename?.includes('scornfacultative') ||
      event.filename?.includes('preferencenail') ||
      event.filename?.includes('weirdopt')) {
    event.preventDefault();
    return false;
  }
});

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

// Secure translation function with error handling
function t(key) { 
  try {
    return (I18N[LOCALE] || I18N.id || {})[key] || key;
  } catch (e) {
    console.warn('Translation error for key:', key);
    return key;
  }
}

// Optimized I18N application with batch DOM updates
function applyI18N() {
  try {
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
      { id: 'menuPolicy', prop: 'textContent', value: t('menuPolicy') }
    ];
    
    // Apply updates efficiently
    updates.forEach(({ id, prop, value }) => {
      const element = document.getElementById(id);
      if (element && value) {
        element[prop] = value;
      }
    });
    
    // Handle special cases
    const aboutPostH1 = document.querySelector('#aboutPost h1');
    if (aboutPostH1) aboutPostH1.textContent = t('aboutTitle');
    
    const aboutContent = document.getElementById('aboutContent');
    if (aboutContent) aboutContent.innerHTML = t('aboutHTML');
    
    const policyPostH1 = document.querySelector('#policyPost h1');
    if (policyPostH1) policyPostH1.textContent = t('policyTitle');
    
    const policyContent = document.getElementById('policyContent');
    if (policyContent) policyContent.innerHTML = t('policyHTML');
    
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
function updateSEOForArticle(a){
  try {
  const url = canonicalPath(a);
    const fullUrl = `https://maneh.blog${url}`;
    
    // Update canonical URL
    document.getElementById('canon').href = fullUrl;
    
    // Update page title with SEO optimization
    document.title = `${a.title} | Maneh — Tutorial & Tips Teknologi`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = `${a.summary} | Tutorial lengkap dengan panduan step-by-step di Maneh.`;
    }
    
    // Update Open Graph tags
    document.getElementById('ogTitle').content = `${a.title} | Maneh Blog`;
    document.getElementById('ogDesc').content = `${a.summary} | Tutorial lengkap dengan panduan step-by-step di Maneh.`;
  document.getElementById('ogImage').content = a.cover;
    document.getElementById('ogUrl').content = fullUrl;
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (twitterTitle) twitterTitle.content = `${a.title} | Maneh Blog`;
    if (twitterDesc) twitterDesc.content = `${a.summary} | Tutorial lengkap dengan panduan step-by-step di Maneh.`;
    if (twitterImage) twitterImage.content = a.cover;
    if (twitterUrl) twitterUrl.content = fullUrl;
    
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
    
    // Reset page title
    document.title = 'Maneh — Tutorial & Tips Teknologi Terlengkap 2025';
    
    // Reset meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = 'Maneh: platform tutorial & tips teknologi terlengkap dengan bahasa sederhana, panduan step-by-step, dan bisa langsung dipraktikkan. Update terbaru 2025!';
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
  const otherNavLink = e.target.closest('a[href="#about"], a[href="#policy"]');
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
  
  const a = e.target.closest('a[data-slug]');
    if(!a) {
      console.log('No article link found');
      return;
    }
    console.log('Article link found:', a);
  e.preventDefault();
    e.stopPropagation();
    const slug = a.dataset.slug;
    if(slug) {
      console.log('Navigating to article:', slug);
      
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
        console.log('Navigating to new URL:', newUrl);
        history.pushState(null, '', newUrl);
        route();
      }
    } else {
      console.warn('No slug found in clicked element');
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
    
    // Secure DOM update
    post.innerHTML = `<h1 id="post-top">${cleanTitle}</h1>${cleanHTML}`;
    console.log('Article content rendered securely');
    
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

  /* Meta dengan verified icon dan nama Penjaga */
  const meta = post.querySelector('.meta') || document.createElement('div');
  meta.className='meta';
  meta.innerHTML = `<span class="verified-icon"></span><strong>Penjaga</strong> <time datetime="${a.published}">${fmtDate(a.published)}</time>`;
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
  updateSEOForArticle(a);
  show('reader');
  console.log('Reader page should now be visible');
  
  } catch (error) {
    console.error('Render reader error:', error);
    // Fallback to home page
    location.hash = '#';
  }
}
function route(){
  const path = location.pathname;
  const hash = location.hash.slice(1);
  const urlParams = new URLSearchParams(window.location.search);
  console.log('Routing to path:', path);
  console.log('Routing to hash:', hash);
  
  // Check if this is a video display request
  if (urlParams.get('video') === 'true') {
    console.log('Video display mode detected');
    showVideoPlayer();
    return;
  }

  // Handle static pages FIRST (highest priority)
  if (hash === 'about' || hash === 'policy') {
    console.log('Handling static page:', hash);
    hideSearch();
    show(hash);
    closeDrawer();
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
    resetSEOHome();
    closeDrawer();
    console.log('Category page rendered successfully');
    return;
  }

  // Handle article page - new URL format: /2025/09/25/1-era-baru-sinema-ai-sora
  console.log('Checking path for article format:', path);
  const articleMatch = path.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/(\d+)-(.+)$/);
  if(articleMatch){
    const year = articleMatch[1];
    const month = articleMatch[2];
    const day = articleMatch[3];
    const order = articleMatch[4];
    const slug = articleMatch[5];
    console.log('✅ MATCH FOUND - Handling article page with new format');
    console.log('Article slug:', slug);
    console.log('Date:', year, month, day);
    console.log('Order:', order);
    
    // Check if article exists
    const article = ARTICLES?.find(a => a.slug === slug);
    if (!article) {
      console.warn('Article not found for slug:', slug);
      console.log('Available slugs:', ARTICLES?.map(a => a.slug) || []);
      // Redirect to home page
      history.replaceState(null, '', '/');
      show('home');
      renderList(getRandomArticles(8));
      resetSEOHome();
      return;
    }
    
    hideSearch();
    console.log('About to render reader for slug:', slug);
    renderReader(slug);
    console.log('About to show reader section');
    show('reader');
    console.log('Reader section should now be visible');
    return;
  }
  // Handle old hash format for backward compatibility
  else if (hash.startsWith('p/')) {
    console.log('Handling article page (legacy hash format)');
    hideSearch();
    const rest = hash.slice(2);
    const [slug, queryStr] = rest.split('?');
    console.log('Article slug:', slug);
    renderReader(slug, queryStr);
    return;
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
    resetSEOHome(); // Reset SEO for list pages
    return;
  }


  // Default to home page (covers #, #tutorial, or any other hash)
  console.log('❌ NO MATCH FOUND - Defaulting to home page');
  console.log('Path was:', path);
  console.log('Hash was:', hash);
  console.log('Showing home page');
  show('home');
  
  const q = document.getElementById('q');
  if (q) q.value = '';
  
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.textContent = t('heroTitle');
  
  const heroSub = document.getElementById('heroSub');
  if (heroSub) heroSub.textContent = t('heroSub');
  
  console.log('About to render list...');
  renderList(getRandomArticles(8)); 
  console.log('List rendered');
  
  
  history.replaceState(null, '', window.location.pathname + window.location.search);
  resetSEOHome();
}
window.addEventListener('hashchange', (e) => {
  console.log('Hash changed to:', location.hash);
  route();
});

window.addEventListener('popstate', (e) => {
  console.log('Popstate event, path:', location.pathname);
  route();
});

/* ======= Search ======= */
const q=document.getElementById('q');
const qResults=document.getElementById('qResults');
let qTimer=null, qActiveIndex=-1;

// Debounce function for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function renderQuickResults(term){
  const v = term.trim().toLowerCase();
  if(v.length<2){ qResults.classList.remove('show'); qResults.innerHTML=''; qActiveIndex=-1; return; }
  const filtered = ARTICLES.filter(a => (a.title+' '+a.summary).toLowerCase().includes(v));
  qResults.innerHTML = filtered.length
    ? filtered.map(a=>`
        <a href="#p/${a.slug}" data-slug="${a.slug}">
          <img loading="lazy" decoding="async" src="${a.cover}" alt="">
          <div>
            <div class="hit-title">${a.title}</div>
            <div class="hit-meta"><time datetime="${a.published}">${fmtDate(a.published)}</time></div>
          </div>
        </a>`).join('') : `<div style="padding:12px;color:var(--muted)">${t('noResultsFor')} &ldquo;${term}&rdquo;.</div>`;
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
  location.hash = `#p/${a.dataset.slug}`;
});
window.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){
    e.preventDefault();
    document.getElementById('searchBar').classList.add('show');
    q.focus();
  }
});

/* ======= Drawer & global keyboard ======= */
const drawer=document.getElementById('drawer');
function openDrawer(){drawer.classList.add('show');document.body.classList.add('noscroll');}
function closeDrawer(){drawer.classList.remove('show');document.body.classList.remove('noscroll');}
document.getElementById('btnMenu').onclick=openDrawer;
document.getElementById('btnClose').onclick=closeDrawer;
drawer.querySelector('.backdrop').onclick=closeDrawer;
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeDrawer(); document.getElementById('searchBar').classList.remove('show'); }
});

/* ======= Search toggle ======= */
const searchBar=document.getElementById('searchBar');
document.getElementById('btnSearch').onclick=()=>{
  searchBar.classList.toggle('show');
  if(searchBar.classList.contains('show')) q.focus();
};
document.addEventListener('click',e=>{
  const bar = document.getElementById('searchBar');
  if(!bar.contains(e.target) && e.target.id!=='btnSearch'){
    qResults.classList.remove('show');
  }
  
  // Debug: Log all clicks to see what's happening
  if (e.target.closest('a[href="#about"], a[href="#policy"]')) {
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

/* ======= Ad Management ======= */
function initAds() {
  // Initialize Popunder ads (automatic)
  console.log('Popunder ads initialized automatically');
  
  // Initialize Native Banner (if available)
  if (typeof window.mountNative === 'function') {
    console.log('Native Banner script available');
  } else {
    console.log('Native Banner script not available');
  }
}

// Initialize ads after DOM is ready
document.addEventListener('DOMContentLoaded', initAds);

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

// Clear Service Worker cache for debugging
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

// Show video player in iframe
function showVideoPlayer() {
  try {
    console.log('Displaying video player...');
    
    // Hide other sections
    hide('home');
    hide('about'); 
    hide('policy');
    hide('reader');
    
    // Create video container if not exists
    let videoContainer = document.getElementById('video-container');
    if (!videoContainer) {
      videoContainer = document.createElement('div');
      videoContainer.id = 'video-container';
      videoContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      document.body.appendChild(videoContainer);
    }
    
    // Create iframe for video
    videoContainer.innerHTML = `
      <iframe 
        src="https://quaxy.my/v/?embed=true" 
        width="100%" 
        height="100%" 
        frameborder="0" 
        allowfullscreen
        style="border: none;">
      </iframe>
      <div style="position: absolute; top: 20px; right: 20px;">
        <button onclick="closeVideoPlayer()" style="
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        ">✕ Close</button>
      </div>
    `;
    
    videoContainer.style.display = 'flex';
    
    // Setup reload handler
    window.addEventListener('beforeunload', function() {
      sessionStorage.setItem('video_reload', 'true');
    });
    
    // Check for reload and redirect to article
    if (sessionStorage.getItem('video_reload') === 'true') {
      sessionStorage.removeItem('video_reload');
      // Remove video parameter and reload
      const newUrl = window.location.href.replace('?video=true', '').replace('&video=true', '');
      window.location.replace(newUrl);
    }
    
  } catch (error) {
    console.error('Video player error:', error);
    // Fallback to normal article
    const newUrl = window.location.href.replace('?video=true', '').replace('&video=true', '');
    window.location.replace(newUrl);
  }
}

// Close video player function
window.closeVideoPlayer = function() {
  const videoContainer = document.getElementById('video-container');
  if (videoContainer) {
    videoContainer.style.display = 'none';
  }
  // Remove video parameter and show article
  const newUrl = window.location.href.replace('?video=true', '').replace('&video=true', '');
  window.history.replaceState({}, '', newUrl);
  route(); // Re-route to show article
};

// Initialize with proper error handling
function initializeBlog() {
  try {
    console.log('Initializing Maneh blog...');
    console.log('ARTICLES available:', typeof ARTICLES !== 'undefined' ? ARTICLES.length : 'undefined');
    console.log('I18N available:', typeof I18N !== 'undefined' ? 'yes' : 'no');
    console.log('DOMPurify available:', typeof DOMPurify !== 'undefined' ? 'yes' : 'no');
    
    // Check if required elements exist
    const homeEl = document.getElementById('home');
    const readerEl = document.getElementById('reader');
    const postEl = document.getElementById('post');
    console.log('Home element:', homeEl ? 'found' : 'missing');
    console.log('Reader element:', readerEl ? 'found' : 'missing');
    console.log('Post element:', postEl ? 'found' : 'missing');
    
    // Setup click handlers first
    setupClickHandlers();
    
detectAndApplyLocale(); // Run locale detection and initial render
route(); // Run the router to handle the initial hash
    console.log('Initialization complete');
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
    
    if (savedName) document.getElementById('commentName').value = savedName;
    if (savedEmail) document.getElementById('commentEmail').value = savedEmail;
    if (savedWebsite) document.getElementById('commentWebsite').value = savedWebsite;
  }

  // Save user info
  function saveUserInfo() {
    const saveInfo = document.getElementById('saveInfo').checked;
    if (saveInfo) {
      localStorage.setItem('commentName', document.getElementById('commentName').value);
      localStorage.setItem('commentEmail', document.getElementById('commentEmail').value);
      localStorage.setItem('commentWebsite', document.getElementById('commentWebsite').value);
    }
  }

  // Handle form submission
  commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(commentForm);
    const commentData = {
      comment: formData.get('comment'),
      name: formData.get('name'),
      email: formData.get('email'),
      website: formData.get('website'),
      timestamp: new Date().toISOString()
    };

    // Validate required fields
    if (!commentData.comment.trim() || !commentData.name.trim() || !commentData.email.trim()) {
      alert('Mohon isi semua field yang wajib diisi (Nama, Email, dan Komentar).');
      return;
    }

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

  // Load saved info on page load
  loadSavedInfo();
})();

/* ======= Blog Initialization - Cleaned ======= */
// Initialization handled above - duplicated code removed