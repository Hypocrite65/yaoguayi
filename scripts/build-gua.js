/**
 * build-gua.js — 生成 64 个静态卦详情页（site/gua/<卦id>.html）
 *
 * 设计说明：
 * - 数据来自 site/data/hexagrams.json（卦辞/彖传/大象传原文+白话、六爻）
 * - 页面骨架复用 learn.html 的设计系统，与 site/yao/ 爻页风格一致
 * - SEO 策略：静态页是搜索引擎的 canonical 落地页；
 *   hexagram.html?id=N（交互页）的 canonical 通过 JS 指向这里；
 *   sitemap 用 /gua/N.html 替代 hexagram.html?id=N
 * - 被 scripts/build-sitemap.js 引用，随 Cloudflare Pages 构建自动重新生成；
 *   生成结果也提交到仓库
 * - 用法：node scripts/build-gua.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const DATA_FILE = path.join(ROOT, 'data', 'hexagrams.json');
const LEARN_FILE = path.join(ROOT, 'learn.html');
const OUT_DIR = path.join(ROOT, 'gua');
const SITE = 'https://yaoguayi.com';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 从「初九：潛龍勿用。」提取「潛龍勿用」
function shortText(text) {
  const t = String(text || '');
  const i = t.indexOf('：');
  return (i >= 0 ? t.slice(i + 1) : t).replace(/[。；]$/, '');
}

function chunk(re, name) {
  const m = learn.match(re);
  if (!m) throw new Error('chunk not found: ' + name);
  return m[0];
}

const learn = fs.readFileSync(LEARN_FILE, 'utf-8');
const style = chunk(/<style>.*?<\/style>/s, 'style');
const nav = chunk(/<nav class="top-nav".*?<\/nav>/s, 'nav');
const footer = chunk(/<footer class="site-footer">.*?<\/footer>/s, 'footer');

const hexagrams = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

const guaCss = `
/* ===== 卦详情页 ===== */
.gua-no{font-size:12px;letter-spacing:0.3em;color:var(--faint);
  font-family:'Noto Sans SC',system-ui,sans-serif;margin-bottom:8px;}
.gua-title{font-size:28px;letter-spacing:0.24em;font-weight:400;margin-bottom:6px;}
.gua-meta{font-size:13px;color:var(--muted);letter-spacing:0.1em;margin-bottom:28px;}
.gua-sec{margin-bottom:30px;}
.gua-sec h2{font-size:14px;letter-spacing:0.3em;font-weight:400;color:var(--ink);
  margin-bottom:10px;padding-bottom:8px;border-bottom:0.5px solid var(--border-strong);}
.gua-orig{font-size:19px;line-height:2;letter-spacing:0.08em;color:var(--ink);margin-bottom:10px;}
.gua-trans{font-size:14px;line-height:2;color:var(--muted);letter-spacing:0.04em;}
.gua-yao-list{list-style:none;}
.gua-yao-list li{margin-bottom:14px;padding-bottom:14px;border-bottom:0.5px solid var(--border);}
.gua-yao-list li:last-child{border-bottom:none;}
.gua-yao-list a{text-decoration:none;color:inherit;display:block;}
.gua-yao-name{font-size:14px;letter-spacing:0.16em;color:var(--vermilion);margin-bottom:4px;}
.gua-yao-text{font-size:15px;letter-spacing:0.06em;color:var(--ink-light);line-height:1.9;}
.gua-yao-more{font-size:11px;color:var(--faint);letter-spacing:0.1em;}
.gua-nav{display:flex;justify-content:space-between;gap:12px;margin:36px 0 8px;flex-wrap:wrap;}
.gua-nav a{flex:1;min-width:120px;text-align:center;border:0.5px solid var(--border);
  border-radius:8px;padding:10px 8px;text-decoration:none;color:var(--ink-light);
  font-size:13px;letter-spacing:0.1em;transition:all 0.2s;background:var(--card-bg);}
.gua-nav a:hover{border-color:var(--vermilion-faint);color:var(--vermilion);}
.gua-cta{margin-top:28px;text-align:center;}
.gua-cta a{display:inline-block;background:var(--vermilion);color:#fff;text-decoration:none;
  border-radius:20px;padding:10px 28px;font-size:14px;letter-spacing:0.2em;}
`;
const styleFull = style.replace('</style>', guaCss + '\n</style>');

function sec(title, orig, trans) {
  if (!orig) return '';
  return `<section class="gua-sec">
    <h2>${title}</h2>
    <div class="gua-orig">${esc(orig)}</div>
    ${trans ? `<div class="gua-trans">${esc(trans)}</div>` : ''}
  </section>`;
}

function guaPage(g, prev, next) {
  const url = `${SITE}/gua/${g.id}`;
  const title = `${g.name}卦详解：卦辞白话、彖传大象与六爻 · 爻卦易`;
  const desc = `《周易》第${g.id}卦${g.name}卦详解：卦辞「${shortText(g.guaci)}」原文与白话、彖传、大象传，以及六爻爻辞逐条解读。`;

  const yaoList = g.yaoci.map(y =>
    `<li id="yao-${y.position}"><a href="/yao/${g.id}-${y.position}">` +
    `<div class="gua-yao-name">${y.name} <span class="gua-yao-more">详解 →</span></div>` +
    `<div class="gua-yao-text">${esc(shortText(y.text))}</div></a></li>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="theme-color" content="#faf8f1"/>
<link rel="canonical" href="${url}"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="爻卦易"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:image" content="${SITE}/img/og-cover.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="${SITE}/img/og-cover.png"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": ${JSON.stringify(title)},
  "description": ${JSON.stringify(desc)},
  "inLanguage": "zh-Hans",
  "author": { "@type": "Organization", "name": "爻卦易", "url": "${SITE}" },
  "about": { "@type": "Thing", "name": "《周易》第${g.id}卦${g.name}卦" }
}
</script>
${styleFull}
</head>
<body>
${nav}
<main class="page">
  <nav class="crumb" aria-label="面包屑">
    <button type="button" class="back-btn" onclick="goBack('/')">‹ 返回</button><a href="/">首页</a><span class="sep">/</span><a href="/hexagrams.html">卦象索引</a><span class="sep">/</span><span class="here">${g.name}卦</span>
  </nav>

  <div class="gua-no">第${g.id}卦 · ${esc(g.pinyin || '')}</div>
  <h1 class="gua-title">${g.name}卦</h1>
  <div class="gua-meta">上卦 ${esc(g.upperTrigram || '')} · 下卦 ${esc(g.lowerTrigram || '')}</div>

  ${sec('卦 辞', g.guaci, g.guaci_trans)}
  ${sec('彖 传', g.tuan, g.tuan_trans)}
  ${sec('大 象 传', g.xiang, g.xiang_trans)}

  <section class="gua-sec">
    <h2>六 爻</h2>
    <ul class="gua-yao-list">${yaoList}</ul>
  </section>

  <div class="gua-cta">
    <a href="/hexagram?id=${g.id}">查看交互版 · 在线起卦</a>
  </div>

  <div class="gua-nav">
    ${prev ? `<a href="/gua/${prev.id}">← 第${prev.id}卦·${prev.name}</a>` : '<a href="/hexagrams.html">← 卦象索引</a>'}
    <a href="/divination.html">在线起卦</a>
    ${next ? `<a href="/gua/${next.id}">第${next.id}卦·${next.name} →</a>` : '<a href="/hexagrams.html">卦象索引 →</a>'}
  </div>
</main>
${footer}
<script src="/js/theme.js"></script>
<script src="/js/version.js"></script>
</body>
</html>
`;
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const urls = [];
hexagrams.forEach((g, i) => {
  const prev = i > 0 ? hexagrams[i - 1] : null;
  const next = i < hexagrams.length - 1 ? hexagrams[i + 1] : null;
  fs.writeFileSync(path.join(OUT_DIR, `${g.id}.html`), guaPage(g, prev, next));
  urls.push(`/gua/${g.id}`);
});

console.log(`Generated ${urls.length} gua pages in ${OUT_DIR}`);

module.exports = { guaUrls: urls };

if (require.main === module) {
  console.log(`guaUrls: ${urls.length}`);
}
