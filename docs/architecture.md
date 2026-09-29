# 项目架构说明

## Monorepo 结构

本项目使用 **pnpm workspaces + Turborepo** 管理 Monorepo，参考 [Cal.com](https://github.com/calcom/cal.com) 和 [Vercel Turborepo 官方示例](https://turbo.build/repo/docs/getting-started/create-new)。

```
yaoguayi/
├── apps/
│   ├── web/              # Next.js 14 Web 应用（主站）
│   └── mobile/           # React Native + Expo（Phase 2）
├── packages/
│   ├── iching-data/      # 易经数据包（纯数据，无框架依赖）
│   ├── iching-core/      # 起卦算法（纯 TS，无框架依赖）
│   ├── ui/               # React 共享组件（卦象 SVG 等）
│   └── typescript-config/# 共享 TypeScript 配置
├── content/              # MDX 内容（文章、注疏）
├── docs/                 # 项目文档
└── .github/              # CI/CD 和 Issue/PR 模板
```

## 数据流

```
iching-data (JSON)
      ↓
iching-core (算法：起卦、查卦、变卦)
      ↓
ui (卦象 SVG 渲染)
      ↓
apps/web (页面展示)
apps/mobile (移动端展示)
```

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
- AI 解读接口：用户自带 API Key，密钥不经过本站服务器

## 构建与部署

```bash
# 本地开发
pnpm install
pnpm dev           # 启动所有应用的开发服务器

# 构建
pnpm build         # Turborepo 自动处理包依赖顺序

# 部署
# Web：推送到 main 分支，Vercel 自动部署
# Mobile：Expo EAS Build（Phase 2）
```
