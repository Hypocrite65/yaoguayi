# 爻卦易 · yaoguayi.com

> 在 AI 时代的喧嚣中，借《易经》之智，寻一处静思之所。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/Hypocrite65/yaoguayi)

**[Website](https://yaoguayi.com)** · **[路线图](./ROADMAP.md)** · **[部署手册](./deploy/DEPLOY.md)** · **[架构说明](./docs/architecture.md)**

---

## 项目简介

爻卦易是一个开源、非盈利的《易经》学习与卦象平台。当前线上产品是一套**手写静态站点**（`apps/site/`），通过 Nginx 部署，无数据库、可离线（PWA）。

- **六十四卦全览** — 卦象、卦辞、彖传、象传完整呈现
- **起卦系统** — 金钱卦（三币法），支持变卦推导
- **读易** — 原典经文与知识文章阅读
- **观象** — 从生活场景切入易经知识
- **AI 辅助解读** — 默认走本站服务端代理（对话不落库）；也可填入自己的 API Key 由浏览器直连上游，密钥不经过本站服务器

---

## 仓库结构

```
yaoguayi/
├── apps/
│   ├── site/                  # ★ 线上产品（Nginx root 指向此目录）
│   │   ├── index.html         # 首页（门户 · 每日一卦 · 导航卡片）
│   │   ├── hexagrams.html     # 六十四卦总览（8×8 卦表）
│   │   ├── hexagram.html      # 单卦详情
│   │   ├── qigua.html         # 起卦（金钱卦 + AI 解读）
│   │   ├── learn.html         # 读易 · 知识文章
│   │   ├── guanxiang.html     # 观象 · 生活场景入口
│   │   ├── 404.html
│   │   ├── css/                   # common.css · tool-window.css
│   │   ├── js/                    # layout · search(Ctrl+K) · theme · auth · admin-panel
│   │   ├── data/                  # hexagrams/annotations/knowledge.json（由脚本生成）
│   │   ├── manifest.json · sw.js  # PWA 离线支持
│   │   └── favicon.svg · icons/
│   └── mobile/                # 移动端（React Native + Expo，规划中，尚未开始）
├── packages/
│   ├── iching-data/           # 六十四卦源数据（卦象 JSON + 白话文译文）
│   ├── iching-core/           # 起卦算法 · 卦象查询（TS，供未来复用）
│   └── typescript-config/     # 共享 TS 配置
├── scripts/                   # 数据构建脚本（build-data.js 等）
├── deploy/                    # Nginx 配置 · 部署手册 · webhook 自动部署
└── docs/                      # 架构说明 · 数据格式
```

> 数据流：`packages/iching-data`（源 JSON）→ `scripts/build-data.js` → `apps/site/data/hexagrams.json` → 前端 `fetch` 加载。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 线上站点 | 原生 HTML · CSS · JavaScript（无框架，直接部署） |
| 数据 | 64 卦 JSON（卦辞、爻辞、彖传、象传 + 白话文译文） |
| 数据构建 | Node.js 脚本 + pnpm workspaces + Turborepo（管理 `packages/*`） |
| AI 解读 | 默认服务端代理（`/api/chat`，流式 SSE）；可选用户自带 Key 浏览器直连 |
| 离线 | PWA（Service Worker + manifest） |
| 部署 | Nginx + Let's Encrypt · Oracle Cloud Ubuntu 24.04 |
| 移动端（规划） | React Native + Expo，复用 `iching-core` / `iching-data` |

---

## 本地开发

线上站点是纯静态文件，任意静态服务器即可预览：

```bash
git clone git@github.com:Hypocrite65/yaoguayi.git
cd yaoguayi

# 预览站点
python3 -m http.server -d apps/site 8000
# 访问 http://localhost:8000
```

修改卦象数据后，重新生成前端 JSON：

```bash
pnpm install                    # 首次安装数据包依赖
node scripts/build-data.js      # 由 packages/iching-data 生成 apps/site/data/hexagrams.json
node scripts/build-sitemap.js   # 重新生成 apps/site/sitemap.xml（页面/卦数据变动后执行）
```

---

## 部署

服务器拉取 `main` 分支后，Nginx 指向 `apps/site/` 目录即可（支持 webhook 自动部署）。完整步骤见 **[deploy/DEPLOY.md](./deploy/DEPLOY.md)**。

---

## 参与贡献

欢迎任何形式的非商业贡献：易经数据校对、白话文翻译、UI/UX 建议、Bug 报告。详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 开源协议

- 代码：[MIT License](./LICENSE)
- 内容（注疏 · 文章）：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

---

*天行健，君子以自强不息。*
