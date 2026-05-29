# 贡献指南 · Contributing Guide

感谢你愿意为爻卦易贡献力量！本项目欢迎所有**非商业**性质的贡献。

---

## 贡献方向

### 内容类（无需编程基础）
- **原典校对**：校对 64 卦卦辞、爻辞的准确性，参照通行版本（如中华书局版）
- **白话翻译**：为卦辞/爻辞添加现代汉语释义
- **案例收集**：整理历史或现代的卦例故事
- **多语言**：繁体中文、英文、日文翻译

### 代码类
- Bug 修复
- 性能优化
- 新功能开发（请先开 Issue 讨论）
- 无障碍访问（a11y）改进
- 测试覆盖率提升

---

## 开发流程

### 1. 环境准备

```bash
# 需要 Node.js >= 20，pnpm >= 9
node --version
pnpm --version

# Fork 并克隆仓库
git clone git@github.com:你的用户名/yaoguayi.git
cd yaoguayi
pnpm install
```

### 2. 创建分支

```bash
# 功能分支
git checkout -b feat/hexagram-search

# Bug 修复分支
git checkout -b fix/coins-divination-edge-case

# 内容分支
git checkout -b content/hexagram-002-kun
```

### 3. 开发与提交

```bash
# 启动开发服务器
pnpm dev

# 提交前检查
pnpm lint
pnpm typecheck
```

Commit 信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat: 添加蓍草起卦法
fix: 修复金钱卦阴爻判断错误
content: 补充第2卦坤卦爻辞注疏
docs: 更新贡献指南
```

### 4. 提交 Pull Request

- PR 标题清晰描述改动内容
- 关联相关 Issue（`Closes #123`）
- 填写 PR 模板中的说明项

---

## 数据格式规范

易经数据位于 `packages/iching-data/src/hexagrams/`，每卦一个 JSON 文件，命名格式：`001-qian.json`。

格式详见 [docs/data-format.md](./docs/data-format.md)。

---

## 行为准则

- 保持友善，尊重不同解读传统
- 内容以原典为准，观点性内容需注明来源
- 不引入商业推广内容
- 禁止算命 / 封建迷信导向的内容

---

## 联系

- **Issue**：功能建议、Bug 报告
- **Discussion**：开放话题、学习交流
- **Email**：见 GitHub Profile
