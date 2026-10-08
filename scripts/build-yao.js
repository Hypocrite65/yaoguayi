/**
 * build-yao.js — 生成 384+2 个爻辞长尾着陆页（site/yao/<卦id>-<爻位>.html）
 *
 * 设计说明：
 * - 数据来自 site/data/hexagrams.json（爻辞原文 / 白话翻译 / 小象 / 小象翻译）
 * - 页面骨架复用 learn.html 的设计系统（CSS 变量 / 顶栏 / 页脚），保证视觉一致
 * - 被 scripts/build-sitemap.js 引用，随 Cloudflare Pages 构建自动重新生成；
 *   生成结果也提交到仓库，保证本地预览与构建产物一致
 * - 用法：node scripts/build-yao.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const DATA_FILE = path.join(ROOT, 'data', 'hexagrams.json');
const LEARN_FILE = path.join(ROOT, 'learn.html');
const OUT_DIR = path.join(ROOT, 'yao');
const SITE = 'https://yaoguayi.com';

// 爻位通用说明
const POS_INFO = {
  1: ['初爻', '事物之始，根基未稳。处此位宜韬光养晦、打好基础，不宜冒进。'],
  2: ['二爻', '由下而上渐入佳境，多居得位。此位多吉，宜守正行事。'],
  3: ['三爻', '处下卦之极，进退维谷，多险。宜谨慎守持，不可妄动。'],
  4: ['四爻', '近君之位，多惧之地。宜审时度势，进退皆须慎重。'],
  5: ['五爻', '一卦之尊位，多吉。宜以德服人，行中道。'],
  6: ['上爻', '事物之终，物极必反。宜知进退存亡，功成身退。'],
  7: ['用爻', '「用九」「用六」为全卦通用之爻辞，不属六爻之位，讲整卦的总体法则。'],
};

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

const yaoCss = `
/* ===== 爻辞页 ===== */
.yao-gua{font-size:12px;letter-spacing:0.3em;color:var(--faint);
  font-family:'Noto Sans SC',system-ui,sans-serif;margin-bottom:8px;}
.yao-title{font-size:26px;letter-spacing:0.2em;font-weight:400;margin-bottom:6px;}
.yao-short{font-size:15px;color:var(--vermilion);letter-spacing:0.14em;margin-bottom:28px;}
.yao-sec{margin-bottom:30px;}
.yao-sec h2{font-size:14px;letter-spacing:0.3em;font-weight:400;color:var(--ink);
  margin-bottom:10px;padding-bottom:8px;border-bottom:0.5px solid var(--border-strong);}
.yao-orig{font-size:19px;line-height:2;letter-spacing:0.08em;color:var(--ink);margin-bottom:10px;}
.yao-trans{font-size:14px;line-height:2;color:var(--muted);letter-spacing:0.04em;}
.yao-pos{font-size:14px;line-height:2;color:var(--ink-light);letter-spacing:0.04em;}
.yao-nav{display:flex;justify-content:space-between;gap:12px;margin:36px 0 8px;flex-wrap:wrap;}
.yao-nav a{flex:1;min-width:120px;text-align:center;border:0.5px solid var(--border);
  border-radius:8px;padding:10px 8px;text-decoration:none;color:var(--ink-light);
  font-size:13px;letter-spacing:0.1em;transition:all 0.2s;background:var(--card-bg);}
.yao-nav a:hover{border-color:var(--vermilion-faint);color:var(--vermilion);}
.yao-cta{margin:34px 0 8px;text-align:center;background:var(--card-bg);
  border:0.5px solid var(--border);border-radius:12px;padding:22px 18px;}
.yao-cta-text{font-size:14px;letter-spacing:0.12em;color:var(--ink-light);margin-bottom:14px;}
.yao-cta a{display:inline-block;background:var(--vermilion);color:#fff;text-decoration:none;
  border-radius:20px;padding:10px 30px;font-size:14px;letter-spacing:0.2em;}
.yao-siblings{margin-top:20px;}
.yao-siblings .sib-label{font-size:11px;letter-spacing:0.2em;color:var(--faint);
  font-family:'Noto Sans SC',system-ui,sans-serif;margin-bottom:10px;}
.sib-list{display:flex;flex-wrap:wrap;gap:8px;}
.sib-list a{border:0.5px solid var(--border);border-radius:16px;padding:5px 14px;
  text-decoration:none;color:var(--muted);font-size:12px;letter-spacing:0.08em;transition:all 0.2s;}
.sib-list a:hover{border-color:var(--vermilion-faint);color:var(--vermilion);}
.sib-list a.cur{background:var(--vermilion-faint);color:var(--vermilion);border-color:transparent;}
`;
const styleFull = style.replace('</style>', yaoCss + '\n</style>');

function yaoPage(g, y, prev, next) {
  const short = shortText(y.text);
  const posLabel = POS_INFO[y.position] || POS_INFO[7];
  const url = `${SITE}/yao/${g.id}-${y.position}`;
  const title = `${g.name}卦${y.name}是什么意思？「${short}」爻辞解释 · 爻卦易`;
  const desc = `${g.name}卦${y.name}爻辞「${y.text}」是什么意思？白话翻译：${y.text_trans}爻卦易提供每爻的原文、白话、小象传与爻位解读。`;

  const sibLinks = g.yaoci.map(s =>
    s.position === y.position
      ? `<a class="cur" href="/yao/${g.id}-${s.position}">${s.name}</a>`
      : `<a href="/yao/${g.id}-${s.position}">${s.name}</a>`
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
  "isPartOf": { "@type": "WebPage", "name": "${g.name}卦", "url": "${SITE}/gua/${g.id}" }
}
</script>
${styleFull}
</head>
<body>
${nav}
<main class="page">
  <nav class="crumb" aria-label="面包屑">
    <button type="button" class="back-btn" onclick="goBack('/')">‹ 返回</button><a href="/">首页</a><span class="sep">/</span><a href="/hexagrams">卦象索引</a><span class="sep">/</span><a href="/gua/${g.id}">${g.name}卦</a><span class="sep">/</span><span class="here">${y.name}</span>
  </nav>

  <div class="yao-gua">${g.name}卦 · ${g.pinyin || ''}</div>
  <h1 class="yao-title">${y.name}</h1>
  <div class="yao-short">「${esc(short)}」</div>

  <section class="yao-sec">
    <h2>爻 辞</h2>
    <div class="yao-orig">${esc(y.text)}</div>
    <div class="yao-trans">${esc(y.text_trans || '')}</div>
  </section>

  ${y.xiang ? `<section class="yao-sec">
    <h2>小 象 传</h2>
    <div class="yao-orig" style="font-size:16px">${esc(y.xiang)}</div>
    <div class="yao-trans">${esc(y.xiang_trans || '')}</div>
  </section>` : ''}

  <section class="yao-sec">
    <h2>爻 位</h2>
    <div class="yao-pos"><b>${posLabel[0]}</b> —— ${posLabel[1]}</div>
  </section>

  <section class="yao-sec">
    <h2>断 卦 提 示</h2>
    <div class="yao-trans">当${y.name}为动爻时，断卦以此爻辞为主：先看爻辞讲的是什么处境，再对照你所问之事。爻辞之外，也可参考本卦「${g.name}」的卦辞与大象传，互相印证。</div>
  </section>

  <section class="yao-cta">
    <div class="yao-cta-text">心有所问？三枚铜钱，亲手起一卦</div>
    <a href="/divination">去起卦 →</a>
  </section>

  <div class="yao-nav">
    ${prev ? `<a href="/yao/${prev.g}-${prev.p}">← ${prev.n}</a>` : '<a href="/gua/' + g.id + '">← 本卦</a>'}
    <a href="/gua/${g.id}">${g.name}卦详解</a>
    ${next ? `<a href="/yao/${next.g}-${next.p}">${next.n} →</a>` : '<a href="/hexagrams">卦象索引 →</a>'}
  </div>

  <div class="yao-siblings">
    <div class="sib-label">本卦各爻</div>
    <div class="sib-list">${sibLinks}</div>
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

// 全局爻序（用于上一爻/下一爻跨卦导航）
const all = [];
hexagrams.forEach(g => g.yaoci.forEach(y => all.push({ g: g.id, p: y.position, n: g.name + '·' + y.name })));

let count = 0;
const urls = [];
all.forEach((cur, i) => {
  const g = hexagrams.find(h => h.id === cur.g);
  const y = g.yaoci.find(yy => yy.position === cur.p);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i < all.length - 1 ? all[i + 1] : null;
  const file = path.join(OUT_DIR, `${cur.g}-${cur.p}.html`);
  fs.writeFileSync(file, yaoPage(g, y, prev, next));
  urls.push(`/yao/${cur.g}-${cur.p}`);
  count++;
});

console.log(`Generated ${count} yao pages in ${OUT_DIR}`);

// 导出 URL 列表，供 build-sitemap.js 使用
module.exports = { yaoUrls: urls };

// 直接运行时也打印 sitemap 可用的行数
if (require.main === module) {
  console.log(`yaoUrls: ${urls.length}`);
}
