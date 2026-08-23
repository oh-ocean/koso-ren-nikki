// Static blog generator for the SURFOCUS landing page (surfocus.app).
//
// Reads markdown+frontmatter source files from blog-src/posts/*.md and
// generates fully static HTML into landing/blog/ plus landing/sitemap.xml.
// No client-side rendering: every page is plain HTML so titles, meta tags,
// OGP, and JSON-LD are all present in the raw response for crawlers.
//
// Usage: node blog-src/generate.mjs
//
// To add a new post: drop a new .md file into blog-src/posts/ following the
// same frontmatter schema as the existing one, then re-run this script.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(__dirname, 'posts');
const LANDING_DIR = path.join(REPO_ROOT, 'landing');
const BLOG_OUT_DIR = path.join(LANDING_DIR, 'blog');
const SITE_URL = 'https://surfocus.app';
const GA_MEASUREMENT_ID = 'G-13NN0GFJT8';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Frontmatter block not found');
  const [, fmBlock, body] = match;
  const meta = {};
  for (const line of fmBlock.split('\n')) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  }
  return { meta, body };
}

function parseBody(body) {
  const lines = body.trim().split('\n');
  let heading = '';
  let rest = lines;
  if (lines[0]?.startsWith('# ')) {
    heading = lines[0].slice(2).trim();
    rest = lines.slice(1);
  }
  const blocks = rest.join('\n').trim().split(/\n\s*\n/).filter(Boolean);
  const htmlBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (trimmed.startsWith('## ')) {
      return `<h2>${inlineFormat(trimmed.slice(3).trim())}</h2>`;
    }
    return `<p>${inlineFormat(trimmed)}</p>`;
  });
  return { heading, bodyHtml: htmlBlocks.join('\n') };
}

function loadPosts() {
  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw = readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    const { heading, bodyHtml } = parseBody(body);
    return { ...meta, heading, bodyHtml };
  });
  posts.sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
  return posts;
}

function formatDateJa(iso) {
  const [y, m, d] = iso.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

// Shared CSS, mirrors landing/index.html's design tokens so blog pages read
// as a natural extension of the top page rather than a new design language.
const SHARED_STYLE = `
  :root{
    --navy: #12172a;
    --navy-soft: #1c2338;
    --orange: #d9730d;
    --orange-soft: #f0964a;
    --cream: #faf9f6;
    --ink: #1f2430;
    --muted: #6b7280;
    --line: #e8e6df;
    --radius: 20px;
  }
  *{ box-sizing: border-box; }
  html{ scroll-behavior: smooth; }
  body{
    margin:0;
    font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif;
    color: var(--ink);
    background: var(--cream);
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
  }
  a{ color: inherit; }
  img{ max-width:100%; display:block; }
  .wrap{ max-width: 960px; margin: 0 auto; padding: 0 24px; }

  nav.topbar{
    background: var(--navy);
    color: #f4f3ee;
    padding: 22px 0;
  }
  nav.topbar .wrap{ display:flex; align-items:center; justify-content:space-between; }
  .brand{
    display:flex; align-items:center; gap:10px;
    font-weight:800;
    font-size: 20px;
    text-decoration:none;
    color:#f4f3ee;
    letter-spacing: -0.01em;
  }
  .brand-dot{
    width:11px; height:11px; border-radius:50%;
    background: var(--orange);
    box-shadow: 0 0 0 4px rgba(217,115,13,0.25);
    flex-shrink: 0;
  }
  .nav-cta{
    display:inline-flex; align-items:center; gap:6px;
    background: var(--orange);
    color:#fff; text-decoration:none; font-weight:700;
    padding: 9px 18px; border-radius: 999px; font-size: 14px;
  }

  section{ padding: 56px 0; }
  .eyebrow{
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--orange);
    text-transform: uppercase;
    margin: 0 0 10px;
  }
  h1{
    font-size: clamp(28px, 4.4vw, 40px);
    line-height: 1.4;
    margin: 8px 0 16px;
    font-weight: 800;
    color: var(--navy);
  }
  .section-lead{
    color: var(--muted);
    max-width: 42em;
    margin: 0 0 8px;
    font-size: 16px;
  }

  /* Post cards (index) */
  .post-grid{
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  .post-card{
    display:block;
    background:#fff;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow:hidden;
    text-decoration:none;
    color: inherit;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .post-card:hover{ transform: translateY(-2px); box-shadow: 0 16px 34px rgba(0,0,0,0.08); }
  .post-card img{ width:100%; height: 200px; object-fit: cover; }
  .post-card-body{ padding: 22px 24px 26px; }
  .post-date{ font-size: 12.5px; color: var(--muted); margin-bottom: 8px; }
  .post-card h2{ font-size: 18px; margin: 0 0 10px; font-weight: 700; color: var(--navy); }
  .post-card p{ font-size: 14px; color: var(--muted); margin:0; }

  /* Article page */
  .article-meta{ font-size: 13.5px; color: var(--muted); margin-bottom: 28px; }
  .eyecatch{
    border-radius: var(--radius);
    margin-bottom: 40px;
  }
  article h2{
    font-size: 22px;
    color: var(--navy);
    margin: 40px 0 16px;
    font-weight: 800;
  }
  article p{ font-size: 16px; color: var(--ink); margin: 0 0 20px; }

  .band{
    background: var(--navy);
    color: #f4f3ee;
    border-radius: 24px;
    padding: 44px 40px;
    text-align:center;
    margin-top: 48px;
  }
  .band h2{ color:#fff; margin: 0 0 12px; font-size: 22px; }
  .band p{ color: #c9c7bd; margin: 0 0 24px; }
  .cta{
    display:inline-flex;
    align-items:center;
    gap: 8px;
    background: var(--orange);
    color: #fff;
    text-decoration:none;
    font-weight: 700;
    padding: 14px 26px;
    border-radius: 14px;
    font-size: 15px;
  }
  .cta:hover{ background: var(--orange-soft); }

  .back-link{
    display:inline-block;
    font-size: 14px;
    font-weight: 700;
    color: var(--muted);
    text-decoration:none;
    margin-bottom: 24px;
  }
  .back-link:hover{ color: var(--ink); }

  footer{
    padding: 40px 0 60px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 13.5px;
  }
  footer .foot-row{
    display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;
  }
  footer a.foot-cta{ color: var(--ink); font-weight:700; text-decoration:none; }
  footer a.foot-cta:hover{ text-decoration:underline; }
  footer .copyright{
    margin-top: 16px;
    font-size: 12px;
    color: #9a978c;
  }

  @media (max-width: 760px){
    .post-grid{ grid-template-columns: 1fr; }
    section{ padding: 40px 0; }
    .band{ padding: 32px 24px; }
  }
`;

const GA_SNIPPET = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
</script>`;

function topbar() {
  return `<nav class="topbar">
  <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;">
    <a class="brand" href="${SITE_URL}/"><span class="brand-dot"></span>SURFOCUS</a>
    <a class="nav-cta" href="https://app.surfocus.app/">アプリを開く →</a>
  </div>
</nav>`;
}

function footer() {
  return `<footer>
  <div class="wrap">
    <div class="foot-row">
      <div>SURFOCUS — 2026年8月 公開　·　<a class="foot-cta" href="${SITE_URL}/blog/">ブログ</a></div>
      <a class="foot-cta" href="https://app.surfocus.app/">アプリを開く →</a>
    </div>
    <div class="copyright">© 2026 OH! OCEAN. All rights reserved.</div>
  </div>
</footer>`;
}

function renderIndexPage(posts) {
  const cards = posts.map(p => `      <a class="post-card" href="${SITE_URL}/blog/${p.slug}/">
        <img src="${p.eyecatchImage}" alt="${escapeHtml(p.eyecatchAlt)}" loading="lazy">
        <div class="post-card-body">
          <div class="post-date">${formatDateJa(p.datePublished)}</div>
          <h2>${escapeHtml(p.heading)}</h2>
          <p>${escapeHtml(p.description)}</p>
        </div>
      </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ブログ | SURFOCUS</title>
<meta name="description" content="SURFOCUSブログ。サーフィンの一人練習(コソ練)にまつわる考え方や、上達のための目標設定・記録のコツを綴っています。">
<link rel="canonical" href="${SITE_URL}/blog/">
<link rel="icon" type="image/png" href="/favicon.png">

<meta property="og:type" content="website">
<meta property="og:site_name" content="SURFOCUS">
<meta property="og:title" content="ブログ | SURFOCUS">
<meta property="og:description" content="サーフィンの一人練習(コソ練)にまつわる考え方や、上達のための目標設定・記録のコツを綴っています。">
<meta property="og:url" content="${SITE_URL}/blog/">

${GA_SNIPPET}

<style>${SHARED_STYLE}</style>
</head>
<body>
${topbar()}
<div class="wrap">
  <section>
    <p class="eyebrow">Blog</p>
    <h1>SURFOCUS ブログ</h1>
    <p class="section-lead">サーフィンの一人練習(コソ練)にまつわる考え方や、上達のための目標設定・記録のコツを綴っています。</p>
    <div class="post-grid">
${cards}
    </div>
  </section>
</div>
${footer()}
</body>
</html>
`;
}

function renderPostPage(post) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const imageUrl = `${SITE_URL}${post.eyecatchImage}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.heading,
    description: post.description,
    image: imageUrl,
    datePublished: post.datePublished,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'SURFOCUS' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(post.title)}</title>
<meta name="description" content="${escapeHtml(post.description)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/favicon.png">

<meta property="og:type" content="article">
<meta property="og:site_name" content="SURFOCUS">
<meta property="og:title" content="${escapeHtml(post.ogTitle)}">
<meta property="og:description" content="${escapeHtml(post.ogDescription)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${imageUrl}">
<meta property="article:published_time" content="${post.datePublished}">

<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>

${GA_SNIPPET}

<style>${SHARED_STYLE}</style>
</head>
<body>
${topbar()}
<div class="wrap">
  <section>
    <a class="back-link" href="${SITE_URL}/blog/">← ブログ一覧に戻る</a>
    <p class="eyebrow">Blog</p>
    <h1>${escapeHtml(post.heading)}</h1>
    <p class="article-meta">${formatDateJa(post.datePublished)} · ${escapeHtml(post.author)}</p>
    <img class="eyecatch" src="${post.eyecatchImage}" alt="${escapeHtml(post.eyecatchAlt)}">
    <article>
${post.bodyHtml}
    </article>
    <div class="band">
      <h2>今日の練習を、次につなげる。</h2>
      <p>SURFOCUSは、コソ練を続けるサーファーのための記録・目標管理アプリです。</p>
      <a class="cta" href="https://app.surfocus.app/">アプリを開く →</a>
    </div>
  </section>
</div>
${footer()}
</body>
</html>
`;
}

function renderSitemap(posts) {
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/blog/`, priority: '0.8' },
    ...posts.map(p => ({ loc: `${SITE_URL}/blog/${p.slug}/`, priority: '0.7', lastmod: p.datePublished })),
  ];
  const entries = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <priority>${u.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function main() {
  const posts = loadPosts();

  mkdirSync(BLOG_OUT_DIR, { recursive: true });
  writeFileSync(path.join(BLOG_OUT_DIR, 'index.html'), renderIndexPage(posts));

  for (const post of posts) {
    const dir = path.join(BLOG_OUT_DIR, post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'index.html'), renderPostPage(post));
  }

  writeFileSync(path.join(LANDING_DIR, 'sitemap.xml'), renderSitemap(posts));

  console.log(`Generated ${posts.length} post(s):`);
  for (const p of posts) console.log(`  - /blog/${p.slug}/`);
  console.log('Generated /blog/index.html and /sitemap.xml');
}

main();
