history.scrollRestoration = 'manual';

let LOCALE = (navigator.language||'').toLowerCase().startsWith('id') ? 'id' : 'en';

/* Optional: IP-based locale */
function detectAndApplyLocale() {
  // Apply default locale immediately for fast initial render
  applyI18N(); 

  // Then, try to detect by IP and re-apply if needed
  fetch('https://ipapi.co/country/', {cache:'reload'})
    .then(r => r.text())
    .then(cc => {
      const newLocale = (cc && cc.trim() !== 'ID') ? 'en' : 'id';
      if (newLocale !== LOCALE) {
        LOCALE = newLocale;
        applyI18N();
      }
    }).catch(e => console.error("IP-based locale detection failed:", e));
}

function t(key){ return (I18N[LOCALE]||I18N.id)[key]; }
function applyI18N(){
  document.documentElement.lang = LOCALE;
  document.getElementById('q').placeholder = t('searchPH');
  document.getElementById('pillCat').innerHTML = t('pill');
  document.getElementById('heroTitle').textContent = t('heroTitle');
  document.getElementById('heroSub').textContent = t('heroSub');
  document.getElementById('secFeatured').textContent = t('featured');
  document.getElementById('secPopular').textContent = t('popular');
  document.querySelector('#aboutPost h1').textContent = t('aboutTitle');
  document.getElementById('aboutContent').innerHTML = t('aboutHTML');
  document.querySelector('#policyPost h1').textContent = t('policyTitle');
  document.getElementById('policyContent').innerHTML = t('policyHTML');
  document.getElementById('menuNews').textContent = t('menuNews');
  document.getElementById('menuTutorial').textContent = t('menuTutorial');
  document.getElementById('menuAbout').textContent = t('menuAbout');
  document.getElementById('menuPolicy').textContent = t('menuPolicy');
}

/* ======= Utils ======= */
function scrollToId(id){
  const el = document.getElementById(id);
  if(!el) return;
  const header = document.querySelector('header');
  const offset = (header?.offsetHeight || 60) + 8;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({top:y, behavior:'smooth'});
}
function slugify(s){ return s.trim().toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-'); }
function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALE==='en'?'en-US':'id-ID',{day:'numeric',month:'long',year:'numeric'});
}
function idxBySlug(slug){ return ARTICLES.findIndex(a=>a.slug===slug)+1; }
function canonicalPath(a){
  const d = new Date(a.published);
  const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
  const index = idxBySlug(a.slug);
  const category = a.category ? `${a.category}-` : '';
  return `/${yyyy}/${mm}/${dd}/${index}-${category}${a.slug}`;
}

/* ======= Article Helpers ======= */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
function getRandomArticles(count) {
  const shuffled = shuffleArray([...ARTICLES]); // Gunakan salinan agar tidak mengubah array asli
  return shuffled.slice(0, count);
}

/* ======= SEO helpers ======= */
function updateSEOForArticle(a){
  const url = canonicalPath(a);
  document.getElementById('canon').href = url;
  document.getElementById('ogTitle').content = a.title;
  document.getElementById('ogDesc').content = a.summary;
  document.getElementById('ogImage').content = a.cover;
  document.getElementById('ogUrl').content = url;
  let ld = document.getElementById('ld-article');
  if(!ld){ ld = document.createElement('script'); ld.type='application/ld+json'; ld.id='ld-article'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    "@context":"https://schema.org","@type":"Article","headline": a.title,
    "datePublished": a.published,"image": [a.cover],
    "inLanguage": LOCALE==='en'?'en-US':'id-ID',
    "mainEntityOfPage": {"@type":"WebPage","@id": url}
  });
}
function resetSEOHome(){
  document.getElementById('canon').href = '/';
  document.getElementById('ogTitle').content = 'Maneh — Tutorial & Tips Teknologi';
  document.getElementById('ogDesc').content = 'Maneh: artikel tutorial & tips teknologi dengan bahasa sederhana, lengkap, dan bisa langsung dipraktikkan.';
  document.getElementById('ogUrl').content = '/';
  const ld = document.getElementById('ld-article'); if(ld) ld.remove();
}

/* ======= Render list grid ======= */
function renderList(items=ARTICLES){
  const box = document.getElementById('list');
  box.innerHTML = items.map(a => `
    <a href="#p/${a.slug}" data-slug="${a.slug}" class="card">
      <img class="thumb" loading="lazy" decoding="async" src="${a.cover}" alt="${a.title}">
      <div class="h2">${a.title}</div>
      <div class="meta"><time datetime="${a.published}">${fmtDate(a.published)}</time></div>
      <p class="desc">${a.summary}</p>
    </a>
  `).join('');
}

/* Intercept semua <a data-slug> agar tetap pakai router hash */
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-slug]');
  if(!a) return;
  e.preventDefault();
  location.hash = `#p/${a.dataset.slug}`;
});

/* ======= Router + Reader ======= */
function show(sectionId){
  document.querySelectorAll('.page').forEach(s=>s.style.display='none');
  document.getElementById(sectionId).style.display='block';
}
function renderReader(slug, queryStr){
  const a=ARTICLES.find(x=>x.slug===slug);
  if(!a){ location.hash='#'; return; }
  const post=document.getElementById('post');
  // SECURITY: Sanitize HTML content to prevent XSS attacks.
  const cleanHTML = DOMPurify.sanitize(a.html);
  post.innerHTML=`<h1 id="post-top">${a.title}</h1>${cleanHTML}`;

  /* Hero figure = cover */
  const firstImg = post.querySelector('img.thumb');
  if(!firstImg){
    const fig = document.createElement('figure'); fig.className='heroFigure';
    fig.innerHTML = `<img class="thumb" src="${a.cover}" alt="${a.title}" loading="eager" decoding="async" fetchpriority="high"><figcaption class="caption">${a.title}</figcaption>`;
    post.prepend(fig);
  }

  /* Meta sederhana */
  const meta = post.querySelector('.meta') || document.createElement('div');
  meta.className='meta';
  meta.innerHTML = `${t('published')} <time datetime="${a.published}">${fmtDate(a.published)}</time>`;
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
  document.getElementById('pilihan').innerHTML = others.slice(0,3).map(x=>`
    <a href="#p/${x.slug}" data-slug="${x.slug}" class="sideItem">
      <img loading="lazy" decoding="async" src="${x.cover}" alt="${x.title}">
      <div><div style="font-weight:700">${x.title}</div><div class="meta"><time datetime="${x.published}">${fmtDate(x.published)}</time></div></div>
    </a>`).join('');
  document.getElementById('populer').innerHTML = others.slice(0,4).map((x,i)=>`
    <a href="#p/${x.slug}" data-slug="${x.slug}" class="rank">
      <div class="dot">#${i+1}</div><div style="font-weight:700">${x.title}</div>
    </a>`).join('');

  history.replaceState(null, '', window.location.pathname + window.location.search + `#p/${slug}`);
  updateSEOForArticle(a);
  window.mountNative('ad-native-reader'); // Aktifkan iklan di halaman artikel
  show('reader');
}
function route(){
  const h = location.hash.slice(1);

  // Handle article page
  if (h.startsWith('p/')) {
    hideSearch();
    const rest = h.slice(2);
    const [slug, queryStr] = rest.split('?');
    renderReader(slug, queryStr);
    return;
  }

  // Handle category page
  if (h.startsWith('category/')) {
    const categoryName = decodeURIComponent(h.slice(9));
    const cleanCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    const filteredArticles = ARTICLES.filter(a => a.category === categoryName);
    
    show('home'); // Gunakan layout halaman utama
    
    const desc = CATEGORY_DESCRIPTIONS[categoryName] || `${filteredArticles.length} artikel ditemukan.`;
    document.getElementById('heroTitle').textContent = `${t('categoryLabel')}: ${cleanCategoryName}`;
    document.getElementById('heroSub').innerHTML = desc;
    renderList(filteredArticles); // Tampilkan artikel yang sudah difilter
    
    history.replaceState(null, '', window.location.pathname + window.location.search + `#category/${categoryName}`);
    resetSEOHome();
    closeDrawer();
    return;
  }

  // Handle tag page
  if (h.startsWith('tag/')) {
    const tagName = decodeURIComponent(h.slice(4));
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

  // Handle static pages
  if (h === 'about' || h === 'policy') {
    hideSearch();
    show(h);
    closeDrawer();
    return;
  }

  // Default to home page (covers #, #tutorial, or any other hash)
  show('home');
  document.getElementById('q').value = '';
  document.getElementById('heroTitle').textContent = t('heroTitle');
  document.getElementById('heroSub').textContent = t('heroSub');
  renderList(getRandomArticles(8)); 
  window.mountNative('ad-native-home'); // Aktifkan iklan di halaman utama
  history.replaceState(null, '', window.location.pathname + window.location.search);
  resetSEOHome();
}
window.addEventListener('hashchange',route);

/* ======= Search ======= */
const q=document.getElementById('q');
const qResults=document.getElementById('qResults');
let qTimer=null, qActiveIndex=-1;

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

q?.addEventListener('input',e=>{
  clearTimeout(qTimer);
  const term=e.target.value;
  qTimer = setTimeout(()=>{
    const filtered=ARTICLES.filter(a=> (a.title+a.summary).toLowerCase().includes(term.toLowerCase()) );
    if(document.getElementById('home').style.display!=='none'){ renderList(filtered); }
    renderQuickResults(term);
  },160);
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

/* ======= Iklan: Konfigurasi dan Logika Pemuatan ======= */
(function setupAds() {
  // --- Konfigurasi Kode Iklan Anda ---
  const POPUNDER_SRC = '//adjoinartistic.com/5c/a2/96/5ca296eae172061fdf96dbaa7bfcec95.js';
  const SOCIALBAR_SRC = '//adjoinartistic.com/5c/a2/96/5ca296eae172061fdf96dbaa7bfcec95.js'; // Sama dengan Popunder
  const NATIVE_SCRIPT_SRC = '//adjoinartistic.com/de6e9df367afc198fb29a8bb36df0d62/invoke.js';
  const NATIVE_CONTAINER_ID = 'container-de6e9df367afc198fb29a8bb36df0d62';
  const DIRECT_LINK_URL = 'https://adjoinartistic.com/mif364wah?key=0bdd43797a9b09089bdeffe1508c82f7';

  // --- Implementasi ---
  
  // 1. Set URL untuk Direct Link
  const directLinkEl = document.getElementById('ad-directlink');
  if (directLinkEl) {
    directLinkEl.href = DIRECT_LINK_URL;
  }

  // 2. Lazy-load Popunder & Social Bar (agar tidak memperlambat situs)
  let backgroundAdsLoaded = false;
  function loadBackgroundAds() {
    if (backgroundAdsLoaded) return;
    backgroundAdsLoaded = true;
    
    console.log('Memuat iklan Popunder & Social Bar...');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = POPUNDER_SRC; // Cukup satu skrip untuk keduanya
    document.body.appendChild(script);
  }
  // Muat iklan ini hanya setelah ada interaksi pertama dari pengguna
  ['click', 'touchstart', 'scroll'].forEach(ev => window.addEventListener(ev, loadBackgroundAds, { once: true, passive: true }));

  // 3. Logika untuk Native Banner (yang bisa berpindah-pindah)
  let nativeScriptLoaded = false;
  function ensureNativeScript(callback) {
    if (nativeScriptLoaded) {
      callback && callback();
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = NATIVE_SCRIPT_SRC;
    script.onload = () => {
      nativeScriptLoaded = true;
      callback && callback();
    };
    document.body.appendChild(script);
  }

  // Fungsi ini akan kita panggil untuk menempatkan iklan Native
  window.mountNative = function(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    let adContainer = document.getElementById(NATIVE_CONTAINER_ID);
    if (!adContainer) {
      adContainer = document.createElement('div');
      adContainer.id = NATIVE_CONTAINER_ID;
    }

    slot.innerHTML = ''; // Bersihkan slot dari konten placeholder
    slot.appendChild(adContainer);
    ensureNativeScript();
  };
})();

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
document.getElementById('year').textContent=new Date().getFullYear();
detectAndApplyLocale(); // Run locale detection and initial render
route(); // Run the router to handle the initial hash

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