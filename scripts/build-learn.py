#!/usr/bin/env python3
"""build-learn.py — 从 site/data/knowledge.json 生成知识栏目静态页。

输出：
  site/learn.html          知识首页（15 篇文章索引）
  site/learn/<id>.html    15 篇文章页

设计说明：
  - 纯静态 HTML，爬虫可直接抓取（替代 6 月旧版 JS fetch knowledge.json 方案）
  - 复用 glossary.html 的主题 CSS（深浅色自适应、手机端），视觉与全站一致
  - 构建期术语链接：正文中的多字术语（含简体变体）静态链向 /glossary.html#term-X
  - section 中的内联 HTML（含 SVG 图解）原样保留；<svg>/<style> 内不加链接
  - 每篇文章页含面包屑、目录、出处、上下篇导航、Article JSON-LD
"""

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DATA = SITE / "data" / "knowledge.json"
ANN = SITE / "data" / "annotations.json"
GLOSSARY_HTML = SITE / "glossary.html"
LEARN_DIR = SITE / "learn"
BASE = "https://yaoguayi.com"

# 打赏：填入爱发电创作者主页链接（如 https://afdian.com/a/你的ID）后，
# 文章页底部会自动显示打赏区；留空则不显示。拿到链接后设值并重跑本脚本即可。
DONATE_URL = "https://afdian.com/a/yaoguayi"

CATEGORIES = [
    ("基础", "先把基本概念搞清楚，再看卦就不晕了"),
    ("起卦", "三种起卦方法的手把手教程"),
    ("断卦", "起出卦之后，怎么看、怎么断"),
]

# 繁体术语 -> 简体变体（正文为简体，链接目标统一用繁体 key）
SIMP_VARIANTS = {
    "卦辭": "卦辞", "爻辭": "爻辞", "變爻": "变爻", "綜卦": "综卦",
    "錯卦": "错卦", "貞吉": "贞吉", "元亨利貞": "元亨利贞",
    "利見大人": "利见大人", "無攸利": "无攸利", "彖傳": "彖传",
    "象傳": "象传", "當位": "当位", "乘剛": "乘刚",
    "相應": "相应", "厲": "厉",
}


def load_term_map():
    ann = json.loads(ANN.read_text(encoding="utf-8"))
    surface_to_trad = {}
    for key in ann["glossary"]:
        if len(key) >= 2:  # 只链多字词，单字（卦/爻/吉…）在白话正文中噪音太大
            surface_to_trad[key] = key
    for trad, simp in SIMP_VARIANTS.items():
        if trad in ann["glossary"]:
            surface_to_trad[simp] = trad
    ordered = sorted(surface_to_trad, key=len, reverse=True)
    pattern = re.compile("|".join(re.escape(t) for t in ordered))

    def sub_func(m):
        surf = m.group(0)
        trad = surface_to_trad[surf]
        return f'<a class="term-link" href="/glossary.html#term-{trad}">{surf}</a>'

    return pattern, sub_func


TERM_PATTERN, TERM_SUB = load_term_map()

# 不加术语链接的保护区：svg 图解、style、已有链接
PROTECT_RE = re.compile(
    r"(<svg.*?</svg>|<style.*?</style>|<script.*?</script>|<a\b.*?</a>)",
    re.S,
)
TAG_SPLIT_RE = re.compile(r"(<[^>]+>)")


def link_terms(html_text: str) -> str:
    """只对文本节点加术语链接，保护 svg/style/已有 <a>。"""
    parts = PROTECT_RE.split(html_text)
    for i in range(0, len(parts), 2):
        tokens = TAG_SPLIT_RE.split(parts[i])
        for j in range(0, len(tokens), 2):
            tokens[j] = TERM_PATTERN.sub(TERM_SUB, tokens[j])
        parts[i] = "".join(tokens)
    return "".join(parts)


def inline_md(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return text


def md_to_html(text: str) -> str:
    """极简 markdown：段落 / **加粗** / 无序列表 / 有序列表 / 表格。"""
    blocks = re.split(r"\n\s*\n", text.strip())
    out = []
    for b in blocks:
        b = b.strip()
        if not b:
            continue
        lines = [ln.strip() for ln in b.split("\n") if ln.strip()]
        # 表格
        if lines and lines[0].startswith("|"):
            rows = []
            for ln in lines:
                if re.match(r"^\|[\s\-\:|]+\|$", ln):
                    continue
                cells = [c.strip() for c in ln.strip().strip("|").split("|")]
                rows.append(cells)
            if rows:
                head, body = rows[0], rows[1:]
                thead = "<thead><tr>" + "".join(
                    f"<th>{inline_md(c)}</th>" for c in head) + "</tr></thead>"
                tbody = "".join(
                    "<tr>" + "".join(f"<td>{inline_md(c)}</td>" for c in r) + "</tr>"
                    for r in body)
                out.append(f"<table>{thead}<tbody>{tbody}</tbody></table>")
                continue
        # 无序列表
        if all(re.match(r"^[-*]\s+", ln) for ln in lines):
            items = "".join(
                f"<li>{inline_md(re.sub(r'^[-*]\s+', '', ln))}</li>" for ln in lines)
            out.append(f"<ul>{items}</ul>")
            continue
        # 有序列表
        if all(re.match(r"^\d+[.、]\s*", ln) for ln in lines):
            items = "".join(
                f"<li>{inline_md(re.sub(r'^\d+[.、]\s*', '', ln))}</li>" for ln in lines)
            out.append(f"<ol>{items}</ol>")
            continue
        out.append(f"<p>{inline_md(b)}</p>")
    return "\n".join(out)


RAW_HTML_RE = re.compile(r"<(p|div|svg|table|ul|ol|h\d|blockquote)[\s>]")


def render_section(content: str) -> str:
    content = content.strip()
    if RAW_HTML_RE.search(content):
        return content  # 内联 HTML（含 SVG 图解）原样保留
    return md_to_html(content)


# ---------- 模板部件：从 glossary.html 复用 ----------

def shared_parts():
    src = GLOSSARY_HTML.read_text(encoding="utf-8")
    css = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
    nav = re.search(r'<nav class="top-nav" aria-label="主导航">.*?</nav>',
                    src, re.S).group(0)
    footer = re.search(r"<footer.*?</footer>", src, re.S).group(0)
    theme_svg = re.search(
        r'<button class="nav-btn" id="theme-toggle".*?</button>', src, re.S).group(0)
    return css, nav, footer, theme_svg


ARTICLE_CSS = """
/* ===== 知识文章 ===== */
.article-head{display:flex;gap:18px;align-items:flex-start;margin-bottom:10px;}
.article-icon{font-size:44px;line-height:1.2;flex:none;}
.article-kicker{font-size:11px;letter-spacing:0.3em;color:var(--faint);
  font-family:'Noto Sans SC',system-ui,sans-serif;margin-bottom:8px;}
.article-title{font-size:28px;letter-spacing:0.18em;font-weight:400;margin-bottom:8px;}
.article-sub{font-size:14px;color:var(--muted);letter-spacing:0.08em;}
.article-summary{font-size:14px;line-height:2;color:var(--ink-light);
  background:var(--card-bg);border:1px solid var(--border);border-radius:12px;
  padding:16px 20px;margin:24px 0 8px;}
.toc{background:var(--card-bg);border:1px solid var(--border);border-radius:12px;
  padding:16px 20px;margin:24px 0 8px;}
.toc-title{font-size:12px;letter-spacing:0.3em;color:var(--faint);margin-bottom:10px;
  font-family:'Noto Sans SC',system-ui,sans-serif;}
.toc ol{margin:0;padding-left:1.4em;font-size:14px;line-height:2;}
.toc a{color:var(--ink-light);text-decoration:none;transition:color 0.2s;}
.toc a:hover{color:var(--vermilion);}
.article-body{font-size:15px;line-height:2.05;color:var(--ink-light);margin-top:8px;}
.article-body h2{font-size:19px;letter-spacing:0.18em;color:var(--ink);font-weight:400;
  margin:44px 0 16px;padding-top:12px;border-top:0.5px solid var(--border);}
.article-body h2:first-child{margin-top:24px;}
.article-body p{margin:0 0 16px;}
.article-body strong{color:var(--ink);}
.article-body ul,.article-body ol{margin:0 0 16px;padding-left:1.5em;}
.article-body li{margin-bottom:8px;}
.article-body table{width:100%;border-collapse:collapse;margin:8px 0 24px;font-size:14px;line-height:1.8;}
.article-body th,.article-body td{border:1px solid var(--border-strong);padding:9px 12px;text-align:left;}
.article-body th{background:var(--card-bg);color:var(--ink);font-weight:600;white-space:nowrap;}
.article-body .diagram-wrap{margin:20px 0 28px;text-align:center;overflow-x:auto;}
.term-link{text-decoration:none;border-bottom:1.5px dashed var(--vermilion-faint);
  cursor:pointer;transition:border-color 0.2s,color 0.2s;color:inherit;}
.term-link:hover{border-bottom-color:var(--vermilion);color:var(--vermilion);}
.source-box{margin-top:44px;padding:14px 18px;border-left:3px solid var(--vermilion);
  background:var(--card-bg);border-radius:0 8px 8px 0;font-size:13px;line-height:1.9;
  color:var(--muted);}
.source-box .src-label{font-size:11px;letter-spacing:0.3em;color:var(--faint);
  font-family:'Noto Sans SC',system-ui,sans-serif;display:block;margin-bottom:4px;}
.prev-next{display:flex;justify-content:space-between;gap:12px;margin-top:36px;
  border-top:0.5px solid var(--border);padding-top:20px;}
.prev-next a{flex:1;text-decoration:none;color:var(--ink-light);font-size:14px;
  padding:12px 16px;border:1px solid var(--border);border-radius:10px;
  transition:border-color 0.2s,background 0.2s;line-height:1.7;}
.prev-next a:hover{border-color:var(--vermilion);background:var(--hover-bg);}
.prev-next .pn-next{text-align:right;}
.prev-next .pn-empty{flex:1;}
.prev-next .pn-label{display:block;font-size:11px;letter-spacing:0.2em;color:var(--faint);
  font-family:'Noto Sans SC',system-ui,sans-serif;margin-bottom:2px;}
/* 知识卡片 */
.learn-card{display:flex;gap:16px;align-items:flex-start;padding:16px;
  border:1px solid var(--border);border-radius:12px;background:var(--card-bg);
  text-decoration:none;color:inherit;transition:border-color 0.2s,transform 0.2s;}
.learn-card:hover{border-color:var(--vermilion);transform:translateY(-2px);}
.learn-icon{font-size:32px;line-height:1.3;flex:none;}
.learn-card h3{font-size:17px;letter-spacing:0.1em;font-weight:400;margin-bottom:4px;color:var(--ink);}
.learn-card .l-sub{font-size:12px;color:var(--faint);letter-spacing:0.06em;margin-bottom:8px;}
.learn-card .l-sum{font-size:13px;line-height:1.9;color:var(--muted);}
.learn-card .l-meta{font-size:11px;color:var(--ghost);margin-top:8px;letter-spacing:0.1em;
  font-family:'Noto Sans SC',system-ui,sans-serif;}
.learn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;}
@media(max-width:640px){
  .learn-grid{grid-template-columns:1fr;}
  .article-title{font-size:23px;}
  .article-head{gap:12px;}
  .article-icon{font-size:34px;}
  .prev-next{flex-direction:column;}
  .prev-next .pn-next{text-align:left;}
}
/* 移动端导航横滑，避免链接挤出 */
@media(max-width:640px){
  .top-nav .nav-left{overflow-x:auto;scrollbar-width:none;white-space:nowrap;max-width:78vw;}
  .top-nav .nav-left::-webkit-scrollbar{display:none;}
  .top-nav .nav-left a{flex:none;}
}
/* 打赏区 */
.donate{margin:40px 0 8px;}
.donate-card{border:1px solid var(--border);border-radius:12px;background:var(--card-bg);
  padding:30px 24px;text-align:center;}
.donate-title{font-size:17px;font-weight:700;color:var(--ink);margin-bottom:8px;letter-spacing:0.05em;}
.donate-desc{font-size:13.5px;color:var(--muted);line-height:1.9;margin:0 0 18px;}
.donate-btn{display:inline-block;background:var(--vermilion);color:#fff;text-decoration:none;
  font-size:15px;font-weight:600;padding:12px 40px;border-radius:999px;
  transition:transform 0.15s,box-shadow 0.15s;}
.donate-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.18);}
.donate-note{font-size:12px;color:var(--faint);margin:14px 0 0;line-height:1.8;}

/* 分享区 */
.share{margin:24px 0 8px;}
.share-card{border:1px solid var(--border);border-radius:12px;background:var(--card-bg);
  padding:30px 24px;text-align:center;}
.share-title{font-size:17px;font-weight:700;color:var(--ink);margin-bottom:8px;letter-spacing:0.05em;}
.share-desc{font-size:13.5px;color:var(--muted);line-height:1.9;margin:0 0 18px;}
.share-row{display:flex;gap:10px;max-width:520px;margin:0 auto;}
.share-link{flex:1;min-width:0;font-size:13px;color:var(--muted);background:var(--bg);
  border:1px solid var(--border);border-radius:8px;padding:10px 12px;}
.share-btn{flex:none;font-size:14px;font-weight:600;color:var(--ink);background:transparent;
  border:1px solid var(--border-strong);border-radius:8px;padding:10px 18px;cursor:pointer;}
.share-btn:hover{background:var(--hover-bg);}
@media(max-width:640px){.share-row{flex-direction:column;}}
"""

HEAD_TMPL = """<!DOCTYPE html>
<html lang="zh-Hans">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{title} · 爻卦易</title>
<meta name="description" content="{desc}"/>
<meta name="theme-color" content="#faf8f1"/>
<link rel="canonical" href="{canonical}"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="爻卦易"/>
<meta property="og:title" content="{title} · 爻卦易"/>
<meta property="og:description" content="{desc}"/>
<meta property="og:url" content="{canonical}"/>
<meta property="og:image" content="https://yaoguayi.com/img/og-cover.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://yaoguayi.com/img/og-cover.png"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<script type="application/ld+json">
{jsonld}
</script>
<style>{css}
{article_css}
</style>
</head>
<body>
"""

FOOT_TMPL = """
<script src="/js/theme.js"></script>
<script src="/js/version.js"></script>
</body>
</html>
"""


def article_page(art, prev_art, next_art, css, nav, footer):
    url = f"{BASE}/learn/{art['id']}.html"
    sections_html = []
    toc_items = []
    for i, sec in enumerate(art["sections"], 1):
        toc_items.append(
            f'<li><a href="#sec-{i}">{html.escape(sec["heading"])}</a></li>')
        body = link_terms(render_section(sec["content"]))
        sections_html.append(
            f'<h2 id="sec-{i}">{html.escape(sec["heading"])}</h2>\n{body}')

    pn = []
    if prev_art:
        pn.append(
            f'<a href="/learn/{prev_art["id"]}.html"><span class="pn-label">← 上一篇</span>'
            f'{html.escape(prev_art["title"])}</a>')
    else:
        pn.append('<span class="pn-empty" aria-hidden="true"></span>')
    if next_art:
        pn.append(
            f'<a class="pn-next" href="/learn/{next_art["id"]}.html">'
            f'<span class="pn-label">下一篇 →</span>{html.escape(next_art["title"])}</a>')
    else:
        pn.append('<span class="pn-empty" aria-hidden="true"></span>')

    # 打赏区：DONATE_URL 为空时不渲染
    if DONATE_URL:
        donate_html = f"""
    <section class="donate" aria-label="打赏支持">
      <div class="donate-card">
        <div class="donate-title">🍵 觉得有收获？</div>
        <p class="donate-desc">请作者喝杯茶，支持爻卦易持续更新。<br>打赏完全自愿，金额随意。</p>
        <a class="donate-btn" href="{html.escape(DONATE_URL, quote=True)}" target="_blank" rel="noopener">去爱发电打赏</a>
        <p class="donate-note">通过爱发电平台安全支付</p>
      </div>
    </section>"""
    else:
        donate_html = ""

    share_html = '''    <section class="share" aria-label="分享">
      <div class="share-card">
        <div class="share-title">📤 觉得有用？分享给朋友</div>
        <p class="share-desc">微信内点击右上角 ··· 即可分享给朋友或朋友圈</p>
        <div class="share-row">
          <input class="share-link" id="share-link" type="text" readonly value="{url_esc}" aria-label="本页链接" onclick="this.select()"/>
          <button class="share-btn" id="share-copy" type="button">复制链接</button>
        </div>
      </div>
    </section>
    <script>
(function(){var b=document.getElementById('share-copy');if(!b)return;
b.addEventListener('click',function(){var i=document.getElementById('share-link');
function ok(){b.textContent='已复制 ✓';setTimeout(function(){b.textContent='复制链接'},1600);}
function fallback(){i.select();try{document.execCommand('copy');ok();}catch(e){}}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(i.value).then(ok,fallback);}else{fallback();}});})();
</script>'''
    share_html = share_html.replace('{url_esc}', html.escape(url, quote=True))

    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": art["title"],
        "description": art["summary"],
        "inLanguage": "zh-Hans",
        "author": {"@type": "Organization", "name": "爻卦易",
                   "url": BASE},
        "publisher": {"@type": "Organization", "name": "爻卦易",
                      "url": BASE},
        "mainEntityOfPage": url,
    }, ensure_ascii=False, indent=2)

    desc = art["summary"].replace('"', "“")
    head = HEAD_TMPL.format(
        title=html.escape(art["title"]), desc=html.escape(desc),
        canonical=url, jsonld=jsonld, css=css, article_css=ARTICLE_CSS)
    # 术语表页脚已是标准顺序（含知识），直接沿用
    footer2 = footer

    return head + nav + f"""
<main class="page">
  <nav class="crumb" aria-label="面包屑">
    <button type="button" class="back-btn" onclick="goBack('/learn.html')">‹ 返回</button><a href="/">首页</a><span class="sep">/</span><a href="/learn.html">知识</a><span class="sep">/</span><span class="here">{html.escape(art["title"])}</span>
  </nav>

  <article>
    <div class="article-head">
      <span class="article-icon" aria-hidden="true">{art.get("icon", "📖")}</span>
      <div>
        <div class="article-kicker">易经知识 · {html.escape(art["category"])}</div>
        <h1 class="article-title">{html.escape(art["title"])}</h1>
        <div class="article-sub">{html.escape(art.get("subtitle", ""))}</div>
      </div>
    </div>

    <p class="article-summary">{html.escape(art["summary"])}</p>

    <nav class="toc" aria-label="本篇目录">
      <div class="toc-title">本篇目录</div>
      <ol>{"".join(toc_items)}</ol>
    </nav>

    <div class="article-body">
{"".join(sections_html)}
    </div>

    <aside class="source-box">
      <span class="src-label">参考资料</span>
      {html.escape(art.get("source", "本站整理"))}
    </aside>
{donate_html}
{share_html}
    <nav class="prev-next" aria-label="上下篇">
      {"".join(pn)}
    </nav>
  </article>
</main>
""" + footer2 + FOOT_TMPL


def index_page(articles, css, nav, footer):
    items = []
    for i, art in enumerate(articles, 1):
        items.append({
            "@type": "ListItem",
            "position": i,
            "url": f"{BASE}/learn/{art['id']}.html",
            "name": art["title"],
        })
    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "易经知识 · 爻卦易",
        "description": "15 篇《易经》入门与进阶知识：基础概念、起卦方法、断卦技巧。",
        "inLanguage": "zh-Hans",
        "numberOfItems": len(articles),
        "itemListElement": items,
    }, ensure_ascii=False, indent=2)

    groups = []
    for cat, gdesc in CATEGORIES:
        cards = []
        for art in articles:
            if art["category"] != cat:
                continue
            nsec = len(art["sections"])
            cards.append(f"""
      <a class="learn-card" href="/learn/{art["id"]}.html">
        <span class="learn-icon" aria-hidden="true">{art.get("icon", "📖")}</span>
        <span>
          <h3>{html.escape(art["title"])}</h3>
          <div class="l-sub">{html.escape(art.get("subtitle", ""))}</div>
          <div class="l-sum">{html.escape(art["summary"])}</div>
          <div class="l-meta">{nsec} 节 · 阅读约 {nsec * 3} 分钟</div>
        </span>
      </a>""")
        groups.append(f"""
  <section class="group" aria-label="{cat}">
    <div class="group-title"><h2>{cat}</h2><span class="count">{len(cards)} 篇</span></div>
    <p class="group-desc">{gdesc}</p>
    <div class="learn-grid">{"".join(cards)}
    </div>
  </section>""")

    desc = "15 篇《易经》知识文章：周易概述、八卦基础、河图洛书、天干地支、铜钱起卦法、蓍草揲卦法、变爻断卦法等，含图解，初学者也能看懂。"
    head = HEAD_TMPL.format(
        title="易经知识", desc=desc, canonical=f"{BASE}/learn.html",
        jsonld=jsonld, css=css, article_css=ARTICLE_CSS)
    footer2 = footer  # 同上，直接沿用标准页脚

    return head + nav + """
<main class="page">
  <nav class="crumb" aria-label="面包屑">
    <button type="button" class="back-btn" onclick="goBack('/')">‹ 返回</button><a href="/">首页</a><span class="sep">/</span><span class="here">知识</span>
  </nav>

  <h1 class="page-title">易经知识</h1>
  <p class="page-intro">
    看卦之前，先把底子打牢。这里有 15 篇文章：从「《易经》到底是什么」，
    到八卦、五行、天干地支，再到三种起卦方法和断卦技巧，配图一步步讲清楚。
    看到带虚线下划线的词，点击可以查术语解释。
  </p>
""" + "".join(groups) + """
</main>
""" + footer2 + FOOT_TMPL


def main():
    articles = json.loads(DATA.read_text(encoding="utf-8"))
    css, nav, footer, _ = shared_parts()
    LEARN_DIR.mkdir(exist_ok=True)

    (SITE / "learn.html").write_text(
        index_page(articles, css, nav, footer), encoding="utf-8")
    for i, art in enumerate(articles):
        prev_art = articles[i - 1] if i > 0 else None
        next_art = articles[i + 1] if i < len(articles) - 1 else None
        (LEARN_DIR / f"{art['id']}.html").write_text(
            article_page(art, prev_art, next_art, css, nav, footer),
            encoding="utf-8")
    print(f"生成 learn.html + {len(articles)} 篇文章页")


if __name__ == "__main__":
    main()
