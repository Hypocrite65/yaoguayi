# Changelog

所有重要变更均记录于此，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [Semantic Versioning](https://semver.org/)。

## [Unreleased]

### Changed
- 将线上站点目录 `site/` 迁移至 `apps/site/`，与 monorepo 的 `apps/*` 布局约定保持一致；同步更新 Nginx root、`deploy/DEPLOY.md`、`scripts/build-data.js` 及各文档中的路径引用

### Removed
- 移除未构建的 `apps/web`（Next.js scaffold）与 `packages/ui`（React 组件包），线上产品统一为静态站点 `site/`
- 删除孤儿数据文件 `translations/001-qian.json`（构建实际读取 `001.json`）
- 删除 `docs/` 下过时设计稿（`mockup-*.html`、`preview-home.html`）
- 删除空的 `content/` 目录（Next.js/MDX 遗留，未使用）
- 将一次性迁移脚本移入 `scripts/archive/`（`fix-translations` / `build-pinyin` / `fix-pinyin-tones`）

### Changed
- 重写 README、architecture.md，更新 PROJECT_PLAN 现状说明，使文档与实态一致

### Added
- 初始化 Monorepo 项目结构
- `iching-data` 包：64 卦数据格式定义与乾坤两卦样例
- `iching-core` 包：金钱卦起卦算法骨架
- `ui` 包：卦象 SVG 组件骨架
- `apps/web`：Next.js 14 项目骨架
- GitHub Actions CI 配置
- 项目文档（README、CONTRIBUTING、规划）
