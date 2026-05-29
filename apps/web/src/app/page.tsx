import React from 'react'

/**
 * 首页主组件设计说明：
 * 本组件为“爻卦易 (yaoguayi.com)”极速重塑的【Cyber Zen 极深科幻禅意落地页】。
 * 完美响应用户对 freedom.gov 极致宏大、深色系、地平线发光弧线以及神秘极简风的偏好：
 * 1. 采用 100% 纯内联 CSS (Vanilla Inline Styles) 进行全局防御性排版。由于本地开发环境的 TailwindCSS 编译缓存波动，本方案完全弃用对 Tailwind 的依赖，确保在裸 HTML 状态下也 100% 呈现完美像素级布局；
 * 2. 界面配色为极夜黑 (#030712)、高亮白 (#ffffff) 与荧光发光蓝 (#38bdf8) 的经典碰撞；
 * 3. 核心视觉焦点：
 *    - 顶部悬浮的极简离卦（☲）Logo，自带强烈的科幻荧光蓝色外发光 (Glow Filter)；
 *    - 正中央巨大尺寸、渐变发光主标题 "CHANGES ARE COMING"（变易将至 / 呼应易经之“变”）；
 *    - 底部横跨屏幕、极其震撼的荧光蓝色“太极视界地平线弧光”（Celestial Event Horizon Arc），渲染出跨越时代的神秘史诗感。
 */
export default function HomePage() {
  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#030712',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        padding: '60px 20px',
        boxSizing: 'border-box'
      }}
    >
      {/* 背景太极星雾发光圆（左侧淡紫发光体） */}
      <div 
        style={{
          position: 'absolute',
          left: '5%',
          top: '15%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 背景太极星雾发光圆（右侧淡蓝发光体） */}
      <div 
        style={{
          position: 'absolute',
          right: '8%',
          bottom: '20%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 主体交互视口，高层级置顶 */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          maxWidth: '800px',
          width: '100%'
        }}
      >
        {/* 1. 极简发光 Logo 区域 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            style={{
              width: '108px',
              height: '108px',
              color: '#38bdf8',
              filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.85))', // 极致发光设计，呼应离卦之光与现代 AI 火花
              transition: 'transform 0.5s ease'
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="2" />
              <line x1="31" y1="62" x2="69" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="31" y1="50" x2="47" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="53" y1="50" x2="69" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="31" y1="38" x2="69" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 2. 项目标识与艺术域名标注 */}
        <div style={{ spaceY: '4px' }}>
          <p 
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.45em',
              color: 'rgba(255, 255, 255, 0.4)',
              margin: '0 0 4px 0'
            }}
          >
            Yao Gua Yi
          </p>
          <p 
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              textTransform: 'lowercase',
              letterSpacing: '0.2em',
              color: 'rgba(56, 189, 248, 0.65)',
              margin: 0
            }}
          >
            yaoguayi.com
          </p>
        </div>

        {/* 3. 宏大发光主标题 (CHANGES ARE COMING) */}
        <h2 
          style={{
            fontSize: 'min(7vw, 68px)', // 响应式高档大字号，确保在大屏上宏大冲击，在手机端不换行错落
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '12px 0 0 0',
            lineHeight: 1.1,
            background: 'linear-gradient(to right, #ffffff 40%, #60a5fa 100%)', // 渐变色，从白到荧光蓝，高度契合科技感
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 10px rgba(96, 165, 250, 0.15))'
          }}
        >
          Changes Are Coming
        </h2>

        {/* 4. 极致禅意 Slogan */}
        <p 
          style={{
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '560px',
            margin: '12px auto 0 auto',
            letterSpacing: '0.04em'
          }}
        >
          In the roaring tides of Artificial Intelligence, human order rearranges in milliseconds. Reclaim your inner stillness. The ancient Chinese wisdom of <i>I Ching</i>. Get ready.
        </p>

        {/* 5. 极简高档的控制按钮 */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a
            href="#about"
            style={{
              backgroundColor: '#ffffff',
              color: '#030712',
              padding: '12px 28px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              borderRadius: '4px',
              boxShadow: '0 0 15px rgba(255,255,255,0.25)',
              transition: 'all 0.3s ease'
            }}
          >
            The Philosophy
          </a>
          <a
            href="https://github.com/Hypocrite65/yaoguayi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '12px 28px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              borderRadius: '4px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              transition: 'all 0.3s ease'
            }}
          >
            GitHub Source
          </a>
        </div>
      </div>

      {/* 6. 底部极其震撼的【太极乾坤视界蓝色地平线发光圆弧】 */}
      {/* 
        高度致敬 freedom.gov 的发光地球弧线。
        采用巨幅 50% 圆形，绝对定位横跨屏幕底部，通过外发光与双层渐变，
        渲染出宛如宇宙破晓、智慧曙光初现的地平线视界，极强视觉震撼！
      */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-380px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '500px',
          borderRadius: '50%',
          borderTop: '2px solid rgba(56, 189, 248, 0.8)', // 荧光蓝锋利发光主线
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 75%)', // 内部渐变微光
          boxShadow: '0 -15px 40px rgba(56, 189, 248, 0.38), inset 0 20px 40px rgba(0, 0, 0, 0.95)', // 向上映射的荧光发光与阴影
          pointerEvents: 'none',
          zIndex: 5
        }}
      />
    </div>
  )
}



