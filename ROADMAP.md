# 爻卦易 · 开发路线图

> 本文档是**当前生效的项目计划**,基于 2026-07 实际现状制定,替代 [PROJECT_PLAN.md](./PROJECT_PLAN.md)(v0.1 原始愿景稿,保留作历史参考)。
> 兼顾两个目标:把产品做扎实 + 借项目系统学习 Web 开发,因此每个阶段标注了对应的学习主题。

---

## 现状盘点(2026-07-02,已核实)

### 已落地 ✅

| 模块 | 说明 |
|------|------|
| 六十四卦库 | 64 卦数据完整,含卦辞/彖/象/爻辞 + **白话译文全 64 卦覆盖** |
| 单卦详情 | hexagram.html,SVG 卦象渲染 |
| 起卦 | 金钱卦(三币法)+ 变卦推导(qigua.html + iching-core/coins.ts) |
| 读易 / 观象 | knowledge.json 15 篇文章 + 生活场景入口 |
| 全局搜索 | Ctrl+K,search.js |
| PWA | manifest + Service Worker 离线 |
| AI 解读 | 走服务器代理 `/api/chat`(webhook.py → 上游 LLM API) |
| 部署 | Nginx + Let's Encrypt + GitHub webhook 自动 git pull |
| 仓库结构 | monorepo 规范化完成:`apps/site` + `packages/*`,文档与实态一致 |

### 已知欠账 ⚠️

- `iching-core` **没有任何单元测试**;蓍草法、数字起卦未实现
- CI 只做 `pnpm install`,不校验数据、不跑测试
- 无 robots.txt / sitemap.xml / OG 标签体系,SEO 基本裸奔
- README 仍写"AI 用户自带 Key 不经服务器",与实际的服务端代理架构**不符**
- GitHub webhook 走 `http://IP:9000` 明文直连,9000 端口对公网开放
- 服务器无监控告警、无备份策略(本周刚经历过一次资源耗尽卡死)
- 乾坤文言传、名家注疏未收录

---

## Phase A · 巩固静态站(当前 → 约 1 个月)

**目标:把已上线的产品补到"内容完整、对外体面"的状态,不引入新技术栈。**

### A1 内容完善
- [x] 修正 README:AI 解读架构说明改为"服务端代理,不存储用户对话"(如同时保留自带 Key 模式,写清两种模式)
- [ ] 乾坤两卦补《文言传》原文 + 译文
- [ ] 译文全量校对一轮(64 卦,可分批,每批 8 卦)
- [ ] 知识文章扩充:阴阳/八卦基础、卦序逻辑(承接观象已有方向)

### A2 SEO 与可发现性
- [x] `robots.txt` + `sitemap.xml`(64 卦详情页都是独立 URL,值得收录;`scripts/build-sitemap.js` 生成)
- [x] 每页补齐 `<title>` / `<meta description>` / Open Graph 标签(核查时发现已基本齐备,补了 404 noindex)
- [ ] 卦象详情页加 JSON-LD 结构化数据(Article 类型)
- [ ] 部署后到 Google Search Console 提交 sitemap

### A3 起卦补全(iching-core)
- [x] 蓍草法算法(大衍筮法,`castYarrow`,含概率分布测试)
- [ ] 蓍草法接入前端 qigua.html(含"十八变"过程演示)
- [ ] 数字起卦(梅花易数:时间起卦 / 数字起卦)
- [ ] 起卦历史记录页(localStorage,已有数据基础)

**学习主题:** 语义化 HTML 与 SEO 原理(搜索引擎如何抓取/索引)、结构化数据规范(schema.org)。

**验收:** Google Search Console 收录正常;三种起卦方式可用;README 与实现一致。

---

## Phase B · 工程化与运维加固(与 A 并行推进,约 1 个月)

**目标:补齐测试、CI、安全、监控——这是"正规教科书式"工程实践的核心一课。**

### B1 测试与 CI
- [x] iching-core 引入 Vitest,金钱卦概率分布、变卦推导、卦象查表全覆盖(首日即发现并修复第 60 卦節的数据错误)
- [x] 数据校验脚本:64 卦 JSON 结构完整性(`scripts/validate-data.js`,8 类规则)
- [x] CI 扩展:install → 数据校验 → typecheck → test,任一失败即红
- [ ] PR 必须过 CI 才能合入 main(分支保护规则,GitHub 仓库设置里操作)

### B2 部署与安全加固
- [x] GitHub webhook 改走 `https://yaoguayi.com/webhook`,关闭 9000 公网端口(配置与脚本已备好:`deploy/setup-webhook-https.sh`;**服务器执行 + GitHub 改 Payload URL 待手动操作**)
- [ ] Nginx 加 Content-Security-Policy 头(静态站点 CSP 很好写,是学习 CSP 的理想场景)
- [ ] 服务器基础加固:fail2ban、确认 sshd 已禁密码登录
- [ ] `/api/chat` 加简单限流(防止代理 Key 被刷)

### B3 监控与备份
- [ ] 外部拨测(UptimeRobot 免费层即可):站点 + webhook 健康检查,宕机邮件告警
- [ ] 服务器每周快照 / 关键数据(Nginx 配置、env 文件)备份清单写入 DEPLOY.md
- [ ] webhook.log 加 logrotate,防日志无限增长

**学习主题:** 单元测试思想与覆盖率、CI/CD 流水线设计、HTTP 安全头、Linux 服务运维(systemd/logrotate/fail2ban)。

**验收:** CI 全绿门禁生效;9000 端口关闭;拨测告警实测触发一次。

---

## Phase C · 框架化重写(Web 框架学习主线,约 2-3 个月)

**目标:以现有静态站为"参照答案",用现代框架正式重写 Web 端——这是学习 Web 框架的主战场。**

策略:**并行重写,灰度切换**。静态站继续在线服务,新站在 `apps/web` 从零搭起,功能逐页对齐,全部对齐后切换 Nginx 指向,静态站归档。这样学习过程不影响线上,且每一页都有现成的功能规格可对照。

- [ ] 技术选型定稿(建议 Next.js App Router + TypeScript + Tailwind,与原始愿景一致,生态与教材最丰富;确定前可先做 3 天 spike 对比 Astro)
- [ ] `apps/web` 初始化,接入 monorepo(共享 `iching-data` / `iching-core` / `typescript-config`——monorepo 的价值在这一步才真正兑现)
- [ ] 卦象 SVG 抽成 React 组件(相当于复活当初 `packages/ui` 的设想)
- [ ] 逐页迁移:首页 → 卦表 → 卦详情(SSG 出 64 个静态页,SEO 直接受益)→ 起卦 → 读易/观象
- [ ] 搜索、PWA、暗色主题对齐
- [ ] 构建产物部署方案:静态导出(`next export` 路线)沿用 Nginx,或 Node 进程 + 反代(顺便学两种部署模式的取舍)
- [ ] 灰度:新站先挂 `beta.yaoguayi.com` 子域验证,稳定后主域切换

**学习主题:** React 组件模型与 Hooks、SSG/SSR/CSR 的区别与选择、App Router 数据获取、构建与部署管线。

**验收:** 新站功能与旧站 1:1 对齐,Lighthouse ≥ 90,主域完成切换。

---

## Phase D · 移动端(Web 框架掌握后,约 2 个月)

**目标:React 经验直接迁移到 React Native,兑现 `apps/mobile` 规划。**

- [ ] Expo 项目初始化,复用 `iching-core` / `iching-data`
- [ ] 核心三页:起卦、卦详情、历史记录(移动端做减法,不求全量对齐 Web)
- [ ] 离线优先(数据包内置,无网可用)
- [ ] 先发 Android(上架门槛低),iOS 视精力与开发者账号成本决定

**学习主题:** React Native 与 Web 的异同、原生构建与应用商店发布流程。

---

## Phase E · 社区与可持续(长期,按需启动)

- [ ] 打赏模块:GitHub Sponsors + 微信/支付宝收款码页面,收支透明公示
- [ ] GitHub Discussions 作为社区入口,用户提交释义/卦例的贡献流程(CC BY-NC)
- [ ] 名家注疏收录(王弼、程颐、朱熹,注意版本版权考据)
- [ ] 多语言(繁中优先,i18n 架构在 Phase C 重写时预留)
- [ ] 无障碍完整过一轮 WCAG 2.1 AA

---

## 非功能指标(长期约束)

| 项目 | 目标 |
|------|------|
| 性能 | Lighthouse > 90,首屏 < 2s |
| 隐私 | 无跟踪代码,占卦记录不离本地;AI 对话不落库 |
| 可用性 | 拨测在线率 > 99.5%(单机 Nginx 的合理目标) |
| 离线 | PWA 核心内容可离线访问 |
| 开源 | 代码 MIT / 内容 CC BY-NC 4.0,贡献流程文档化 |

---

## 近期行动项(接下来 2 周)

1. 修正 README 的 AI 架构描述(半小时,先把不一致消掉)
2. `robots.txt` + `sitemap.xml` + 基础 meta 标签(A2 最速收益项)
3. iching-core 接入 Vitest,给现有 `coins.ts` / `lookup.ts` 补测试(B1 起步,也是后续所有算法开发的安全网)
4. webhook 改 HTTPS 路由并关闭 9000 端口(B2,一次服务器操作解决)
5. 蓍草法算法调研 + 数据结构设计(A3 前置)

---

*文档版本:v1.0 · 2026-07-02 · 随进度更新,完成项打勾并移入 CHANGELOG*
