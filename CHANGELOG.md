# Changelog

所有重要变更均记录于此，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [Semantic Versioning](https://semver.org/)。

## [Unreleased]

### Added
- `iching-core` 新增蓍草法(大衍筮法)起卦 `castYarrow`,概率分布符合经典理论值(6:1/16, 7:5/16, 8:7/16, 9:3/16);公共变卦逻辑抽出为 `buildDivinationResult`
- `iching-core` 接入 Vitest,16 个单元测试覆盖金钱卦、蓍草法与查卦索引(含与 `iching-data` 的 64 卦交叉校验)
- 数据校验脚本 `scripts/validate-data.js`:卦符/爻值/上下卦一致性、爻辞结构、译文覆盖等 8 类规则
- CI 扩展为 install → 数据校验 → typecheck → test 完整流水线
- SEO 基础:`robots.txt`、`sitemap.xml`(69 个 URL,由 `scripts/build-sitemap.js` 生成)、404 页 noindex
- webhook 改经 Nginx HTTPS 反代(`/webhook`),9000 端口不再对公网开放;新增迁移脚本 `deploy/setup-webhook-https.sh`

### Fixed
- **第 60 卦「節」爻值数据错误**:`lines` 与上卦誊抄自 61 卦中孚(应为水泽节,上坎下兑),导致线上節卦卦象图错绘为中孚——由新增的交叉校验测试发现

### Changed
- 修正 README / architecture.md 中 AI 解读架构描述:实际默认走服务端代理 `/api/chat`,用户自带 Key 直连为可选模式
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
