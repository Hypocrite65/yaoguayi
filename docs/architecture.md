# 项目架构说明

## 当前形态

线上产品是一套**手写静态站点**（`apps/site/`），由原生 HTML/CSS/JS 构成，通过 Nginx 部署，无框架、无数据库、支持 PWA 离线。

仓库同时保留 pnpm workspaces + Turborepo 结构，用于管理易经**数据包**与构建脚本；`apps/mobile`（React Native + Expo）为规划中的第二阶段，尚未开始。

> 历史说明：项目初期曾规划以 Next.js（`apps/web`）作为主站，并配套 React 组件包 `packages/ui`。实际迭代中改为直接手写静态站点，Next.js scaffold 与 `ui` 包已移除。若未来需要框架化重写，可参考 [PROJECT_PLAN.md](../PROJECT_PLAN.md) 的原始设想。

```
yaoguayi/
├── apps/
│   ├── site/              # ★ 线上产品（静态 HTML/CSS/JS，Nginx root）
│   └── mobile/            # React Native + Expo（规划中，尚未开始）
├── packages/
│   ├── iching-data/      # 易经数据包（卦象 JSON + 白话文译文，无框架依赖）
│   ├── iching-core/      # 起卦算法（纯 TS，无框架依赖，供未来复用）
│   └── typescript-config/# 共享 TypeScript 配置
├── scripts/              # 数据构建脚本（build-data.js 等）
├── deploy/               # Nginx 配置 · 部署手册 · webhook
├── docs/                 # 项目文档
└── .github/              # CI/CD 和 Issue/PR 模板
```

## 数据流

```
packages/iching-data (源 JSON：卦象 + 译文)
        ↓
scripts/build-data.js (合并、生成)
        ↓
apps/site/data/hexagrams.json (+ annotations.json / knowledge.json)
        ↓
apps/site/*.html  (前端 fetch 加载并渲染 SVG 卦象)
```

`packages/iching-core`（起卦 / 查卦 / 变卦算法）目前不参与线上站点构建，作为独立 TS 包保留，供后续移动端或框架化重写复用。

## 关键设计决策

### 1. 静态数据，无数据库
所有 64 卦数据以 JSON 文件形式内置于代码库，无需数据库。
优点：零运维成本，可完全离线运行（PWA），对 AI 爬虫友好（静态内容）。

### 2. AI 友好的语义化设计
- 每个卦象页面使用语义 HTML（`<article>`、`<section>`、`<blockquote>`）
- 添加 `data-hexagram-*` 属性供结构化读取
- 每条卦/爻辞单独成段，便于 LLM 分段理解
- 预留 AI 解读接口（标准输入：问题 + 卦象 JSON；标准输出：解读文本）

### 3. 隐私优先
- 占卦历史仅存 localStorage，不上传服务器
- 无强制注册、无追踪代码
- AI 解读：默认走服务端代理（`deploy/webhook.py` 的 `/api/chat`，服务器不记录对话内容）；用户也可自带 API Key 由浏览器直连上游，密钥不经过本站服务器

## 构建与部署

```bash
# 预览静态站点
python3 -m http.server -d apps/site 8000   # 访问 http://localhost:8000

# 重新生成前端数据（修改 packages/iching-data 后）
pnpm install
node scripts/build-data.js            # 生成 apps/site/data/hexagrams.json

# 部署
# 服务器 git pull main → Nginx 指向 apps/site/ 目录（支持 webhook 自动部署）
# 详见 deploy/DEPLOY.md
```
