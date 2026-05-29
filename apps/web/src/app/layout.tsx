import type { Metadata } from 'next'
import './globals.css'

// 全局元数据配置，采用纯英文展示，符合用户对于展示字符串英文化的全局规则要求
export const metadata: Metadata = {
  title: {
    template: '%s · Yao Gua Yi',
    default: 'Yao Gua Yi · Ancient I Ching Wisdom & AI Zen',
  },
  description:
    'A premium non-profit open-source platform combining the timeless wisdom of I Ching with modern AI, helping you seek inner peace and clarity in an accelerating era.',
  keywords: ['I Ching', 'Yao Gua Yi', 'Hexagrams', 'Divination', 'Zen', 'Inner Peace', 'AI Wisdom', 'Book of Changes'],
  authors: [{ name: 'Hypocrite65', url: 'https://github.com/Hypocrite65' }],
  icons: {
    icon: '/logo-icon.svg', // 显式配置 Favicon，浏览器标签页将立即呈现极简矢量 Logo 图标
  },
  openGraph: {
    siteName: 'Yao Gua Yi',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * 根布局组件设计说明：
 * 本函数为整个 Web 站点的根布局模板，提供一致的数字禅意视觉框架。
 * 1. 采用 Noto Serif SC 衬线字体作为主要排版字体，彰显东方古典质感；
 * 2. Header 部分集成了内联的 SVG 动画 Logo，使用 currentColor 自适应文字墨黑色，加载时展示顺滑的起卦笔画描边动画；
 * 3. 布局上采用极简响应式，在 Footer 部分展示英文化的非盈利开源协议与中国经典哲学名句。
 * 本函数为整个 Web 站点的根布局模板，响应用户对 freedom.gov 深色高档美学的偏好，重塑为【深邃极夜星空】风格。
 * 1. 采用 Noto Serif SC 作为主字体，但搭配极致深黑（#030712）作为全局底色，文字默认为高洁乳白（#f3f4f6）；
 * 2. 顶部 Header 转换为半透明的深色磨砂玻璃，融入内联 SVG 发光 Logo；
 * 3. 页面主体与页脚全部进行硬编码内联样式防御，确保在 Tailwind 编译未生效时排版绝无变形，自适应大屏与小屏。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* 提供 AI/LLM 爬虫友好的语义化元标记 */}
        <meta name="description" content="Non-profit open-source I Ching platform featuring clean data structures and AI-friendly design." />
        <meta name="ai-readable" content="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/logo-icon.svg" type="image/svg+xml" /> {/* 极致双重防御：硬编码注入矢量 Logo Favicon，防 Next.js 静态检测延迟生效 */}
      </head>
      <body 
        className="min-h-screen bg-black font-serif antialiased flex flex-col justify-between"
        style={{ backgroundColor: '#030712', color: '#f3f4f6', margin: 0, padding: 0 }} // 极致防御性设计：兜底极夜黑背景与亮白文字
      >
        {/* 顶部导航栏，半透明深色磨砂 */}
        <header 
          className="sticky top-0 z-50 px-6 py-4 transition-all duration-300"
          style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)', 
            backgroundColor: 'rgba(3, 7, 18, 0.8)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }} // 兜底深色磨砂
        >
          <nav className="mx-auto flex items-center justify-between" style={{ maxWidth: '1024px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto' }}>
            {/* 品牌标识区域，内联 SVG 发光 Logo */}
            <a href="/" className="group flex items-center gap-3 text-lg font-bold tracking-widest hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#ffffff' }}>
              <svg 
                className="w-8 h-8" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  minWidth: '32px', 
                  minHeight: '32px', 
                  color: '#38bdf8',
                  filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))' 
                }} // 兜底发光荧光蓝 Logo 样式，锁定 32px 尺寸
              >
                <style>
                  {`
                    .header-logo-circle {
                      stroke: currentColor;
                      stroke-width: 2.2;
                      stroke-linecap: round;
                      stroke-dasharray: 264;
                      stroke-dashoffset: 264;
                      animation: headerDrawCircle 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    }
                    .header-logo-line {
                      stroke: currentColor;
                      stroke-width: 2.8;
                      stroke-linecap: round;
                      opacity: 0;
                      animation: headerFadeInLine 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    }
                    .header-line-bottom { animation-delay: 0.4s; }
                    .header-line-mid-1 { animation-delay: 0.7s; }
                    .header-line-mid-2 { animation-delay: 0.7s; }
                    .header-line-top { animation-delay: 1s; }
                    @keyframes headerDrawCircle { to { stroke-dashoffset: 0; } }
                    @keyframes headerFadeInLine {
                      from { opacity: 0; transform: translateY(2px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}
                </style>
                <circle className="header-logo-circle" cx="50" cy="50" r="41" />
                <line className="header-logo-line header-line-bottom" x1="31" y1="62" x2="69" y2="62" />
                <line className="header-logo-line header-line-mid-1" x1="31" y1="50" x2="47" y2="50" />
                <line className="header-logo-line header-line-mid-2" x1="53" y1="50" x2="69" y2="50" />
                <line className="header-logo-line header-line-top" x1="31" y1="38" x2="69" y2="38" />
              </svg>
              <span className="font-sans uppercase text-sm font-semibold tracking-widest text-white" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: 600, letterSpacing: '0.15em' }}>Yao Gua Yi</span>
            </a>
            
            {/* 极简英文导航链接 */}
            <div className="flex gap-8 text-xs font-semibold uppercase tracking-wider text-gray-400" style={{ display: 'flex', gap: '32px' }}>
              <a href="#about" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>Philosophy</a>
              <a href="#roadmap" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>Roadmap</a>
              <a href="#collaboration" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>Collaborate</a>
            </div>
          </nav>
        </header>

        {/* 核心展示区域 */}
        <main 
          className="mx-auto max-w-5xl w-full px-6 py-12 flex-grow"
          style={{ maxWidth: '1024px', width: '100%', margin: '0 auto', padding: '24px 16px', flexGrow: 1 }} // 极致防御性设计：兜底容器居中与内边距
        >
          {children}
        </main>

        {/* 页脚区域，包含英文版项目故事细节与开源哲学金句 */}
        <footer className="border-t border-paper-dark/60 bg-paper-dark/10 px-6 py-12 text-center text-xs text-ink/60">
          <div className="mx-auto max-w-5xl space-y-4">
            <p className="font-semibold tracking-wider uppercase">Yao Gua Yi · yaoguayi.com</p>
            <p className="max-w-md mx-auto leading-relaxed italic">
              "As Heaven maintains vigor through movement, a gentleman should unremittingly practice self-cultivation. As Earth is receptive and yielding, a gentleman should sustain all things with deep virtue."
            </p>
            <div className="pt-4 flex justify-center items-center gap-6 font-semibold uppercase tracking-wider text-ink/50">
              <a
                href="https://github.com/Hypocrite65/yaoguayi"
                className="hover:text-vermilion transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Open Source
              </a>
              <span>·</span>
              <a href="#sponsor" className="hover:text-vermilion transition-colors">Sponsor Project</a>
              <span>·</span>
              <span>MIT License</span>
            </div>
            <p className="text-[10px] text-ink/40 pt-2">© {new Date().getFullYear()} Yao Gua Yi. Dedicated to the pursuit of wisdom & clarity.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

