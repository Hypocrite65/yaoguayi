# 爻卦易 · yaoguayi.com

> 在 AI 时代的喧嚣中，借《易经》之智，寻一处静思之所。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/Hypocrite65/yaoguayi)

**[Website](https://yaoguayi.com)** · **[部署手册](./deploy/DEPLOY.md)**

---

## 项目简介

爻卦易是一个开源、非盈利的《易经》学习与卦象平台。

- **六十四卦全览** — 卦象、卦辞、彖传、象传完整呈现
- **起卦系统** — 金钱卦（三币法），支持变卦推导
- **读易** — 原典经文阅读与学习

**没有算命，没有商业推广，只有原典与思考。**

---

## 仓库结构

```
yaoguayi/
├── site/                      # 部署产物（Nginx root 指向此目录）
│   ├── index.html             # 首页（含密码门 · 64卦网格 · 动画）
│   └── favicon.svg            # 品牌 Logo
├── deploy/                    # 部署配置
│   ├── DEPLOY.md              # 服务器部署手册
│   └── nginx/
│       └── yaoguayi.com.conf  # Nginx 配置（HTTPS + 缓存 + 安全头）
├── apps/
│   ├── web/                   # Next.js 应用（开发中）
│   └── mobile/                # 移动端（规划中）
├── packages/
│   ├── iching-data/           # 六十四卦数据（JSON）
│   ├── iching-core/           # 起卦算法 · 卦象查询
│   ├── ui/                    # 共享 UI 组件
│   └── typescript-config/     # 共享 TS 配置
└── docs/                      # 设计稿与参考文件
```

## 品牌 Logo

**Y + i = Yi（易）**

- **Y**：左斜线 = 阴爻，右竖线 = 阳爻 — 取「爻」之形
- **i**：上下断开 — 取「易」之意（变化、变易）
- 圆框以温棕色连接水墨与朱砂，呼应古籍装帧

## 技术栈

| 层 | 技术 |
|----|------|
| Monorepo | pnpm workspaces + Turborepo |
| Web | Next.js 14 · TypeScript · Tailwind CSS |
| 数据 | 64 卦 JSON（含卦辞、爻辞、彖传、象传） |
| 部署 | Nginx + Let's Encrypt · Oracle Cloud Ubuntu 24.04 |

---

## 部署

当前为静态页部署阶段。服务器拉取 `main` 分支后，Nginx 指向 `site/` 目录即可。

```bash
# 服务器首次部署
cd /var/www
git clone https://github.com/Hypocrite65/yaoguayi.git
# Nginx root → /var/www/yaoguayi/site

# 后续更新
cd /var/www/yaoguayi && git pull origin main
```

详细步骤见 [deploy/DEPLOY.md](./deploy/DEPLOY.md)。

---

## 开发

```bash
git clone git@github.com:Hypocrite65/yaoguayi.git
cd yaoguayi
pnpm install
pnpm dev
# 访问 http://localhost:3000
```

---

## 路线图

- [x] 品牌 Logo 设计（Y+i=Yi）
- [x] 六十四卦数据整理
- [x] 静态首页 + 开发阶段密码门
- [x] 服务器部署（Nginx + HTTPS）
- [ ] 迁移至 Next.js 页面
- [ ] 卦象详情页
- [ ] 起卦功能（三币法）
- [ ] 读易 · 经文阅读
- [ ] 移动端适配优化

---

## 参与贡献

欢迎任何形式的非商业贡献：易经数据校对、白话文翻译、UI/UX 建议、Bug 报告。

---

## 开源协议

- 代码：[MIT License](./LICENSE)
- 内容（注疏 · 文章）：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

---

*天行健，君子以自强不息。*
