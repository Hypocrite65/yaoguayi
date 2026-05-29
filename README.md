# 爻卦易 · Yaoguayi

> 在 AI 时代的喧嚣中，借《易经》之智，寻一处静思之所。  
> *In the noise of the AI era, seek stillness through the wisdom of I Ching.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/Hypocrite65/yaoguayi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

**[Website](https://yaoguayi.com)** · **[贡献指南](./CONTRIBUTING.md)** · **[项目规划](./PROJECT_PLAN.md)**

---

## 项目简介

爻卦易是一个非盈利的《易经》学习与占卦平台，包含：

- **六十四卦全览** — 卦象、卦辞、彖传、象传完整呈现
- **起卦系统** — 金钱卦、蓍草法、数字起卦，支持变卦推导
- **AI 友好设计** — 清晰的语义结构，配合浏览器 AI（Chrome、Arc 等）可直接解读卦象
- **学习模式** — 易经基础教程、记忆卡片、每日一卦

**没有算命，没有商业推广，只有原典与思考。**

---

## 技术栈

| 层 | 技术 |
|----|------|
| Web | Next.js 14+ · TypeScript · Tailwind CSS · shadcn/ui |
| 移动端（规划中） | React Native · Expo |
| Monorepo | pnpm workspaces · Turborepo |
| 部署 | Vercel |

---

## 仓库结构

```
yaoguayi/
├── apps/
│   ├── web/              # Next.js Web 应用
│   └── mobile/           # React Native 移动端（Phase 2）
├── packages/
│   ├── iching-data/      # 易经数据（64卦 · 384爻 JSON）
│   ├── iching-core/      # 起卦算法 · 变卦逻辑
│   ├── ui/               # 共享组件（卦象 SVG 等）
│   └── typescript-config/# 共享 TS 配置
├── content/              # MDX 文章 · 注疏内容
└── docs/                 # 项目文档
```

---

## 快速开始

```bash
# 克隆仓库
git clone git@github.com:Hypocrite65/yaoguayi.git
cd yaoguayi

# 安装依赖（需要 pnpm >= 9）
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

---

## 参与贡献

欢迎任何形式的非商业贡献，包括：

- 易经原典数据校对
- 现代白话文翻译
- UI/UX 改进建议
- 多语言支持（繁中 · 英文 · 日文）
- Bug 报告

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 打赏支持

本项目完全非盈利，服务器和域名费用由维护者自行承担。  
如果你觉得有帮助，可以通过以下方式支持：

- **微信 / 支付宝**：见网站页脚二维码
- **GitHub Sponsors**：[Hypocrite65](https://github.com/sponsors/Hypocrite65)

收支情况每季度公开透明披露。

---

## 开源协议

- 代码：[MIT License](./LICENSE)
- 内容（注疏 · 文章）：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

---

*天行健，君子以自强不息。*
