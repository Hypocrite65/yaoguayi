/**
 * build-sitemap.js — 生成 sitemap.xml
 *
 * 设计说明：
 * 站点页面 = 3 个固定页 + 64 个卦详情页（hexagram.html?id=N）。
 * 卦详情 URL 从 site/data/hexagrams.json 读取 id 生成，
 * 保证 sitemap 与实际数据一致；修改数据后与 build-data.js 一起重跑。
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://yaoguayi.com';
const DATA_FILE = path.join(__dirname, '..', 'site', 'data', 'hexagrams.json');
const OUT_FILE = path.join(__dirname, '..', 'site', 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

// 固定页面：[路径, 优先级]
const staticPages = [
  ['/', '1.0'],
  ['/hexagrams.html', '0.9'],
  ['/glossary.html', '0.8'],
  ['/divination.html', '0.8'],
  ['/hexagram.html', '0.7'],
  ['/learn.html', '0.8'],
];

const hexagrams = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

const KNOWLEDGE_FILE = path.join(__dirname, '..', 'site', 'data', 'knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(KNOWLEDGE_FILE, 'utf-8'));

const urls = [
  ...staticPages.map(([p, priority]) => ({ loc: SITE + p, priority })),
  ...hexagrams.map(h => ({ loc: `${SITE}/hexagram.html?id=${h.id}`, priority: '0.6' })),
  ...knowledge.map(a => ({ loc: `${SITE}/learn/${a.id}.html`, priority: '0.7' })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(u => [
    '  <url>',
    `    <loc>${u.loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <priority>${u.priority}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(OUT_FILE, xml, 'utf-8');
console.log(`Generated ${OUT_FILE} (${urls.length} URLs)`);
