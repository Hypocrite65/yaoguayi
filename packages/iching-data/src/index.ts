export type { Hexagram, Yao, Trigram, LineValue } from './types.js'
export { TRIGRAMS } from './trigrams/index.js'
export { ALL_HEXAGRAMS } from './hexagrams/all.js'

import type { Hexagram } from './types.js'
import { ALL_HEXAGRAMS } from './hexagrams/all.js'

/** 按序号（1-64）同步获取单卦数据 */
export function getHexagram(id: number): Hexagram {
  const h = ALL_HEXAGRAMS[id - 1]
  if (!h) throw new Error(`Hexagram id ${id} out of range (1-64)`)
  return h
}

/** 获取全部 64 卦数组（按序号升序） */
export function getAllHexagrams(): Hexagram[] {
  return ALL_HEXAGRAMS
}
