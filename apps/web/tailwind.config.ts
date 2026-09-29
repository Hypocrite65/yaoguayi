import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 衬线字体用于正文，更具古典气质
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 国风色彩系统
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#4a4a4a',
        },
        paper: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d0',
        },
        vermilion: {
          DEFAULT: '#c0392b',
          light: '#e74c3c',
        },
        jade: {
          DEFAULT: '#27ae60',
          light: '#2ecc71',
        },
      },
    },
  },
  plugins: [],
}

export default config
