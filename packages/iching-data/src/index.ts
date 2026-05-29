export type { Hexagram, Yao, Trigram, LineValue } from './types.js'
export { TRIGRAMS } from './trigrams/index.js'

// 动态导入卦象数据（按需加载，减少初始包体积）
export async function getHexagram(id: number): Promise<import('./types.js').Hexagram> {
  const paddedId = String(id).padStart(3, '0')
  // 根据 id 映射文件名（001-064）
  const module = await import(`./hexagrams/${paddedId}-*.json`, {
    assert: { type: 'json' },
  })
  return module.default
}

export async function getAllHexagrams(): Promise<import('./types.js').Hexagram[]> {
  // 在构建时由打包工具静态分析展开
  const modules = import.meta.glob('./hexagrams/*.json', {
    eager: true,
    import: 'default',
  })
  return Object.values(modules) as import('./types.js').Hexagram[]
}
