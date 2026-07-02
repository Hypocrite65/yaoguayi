import { describe, it, expect } from 'vitest'
import { ALL_HEXAGRAMS } from '@yaoguayi/iching-data'
import { HEXAGRAM_INDEX, lookupHexagram } from './lookup.js'

describe('HEXAGRAM_INDEX 索引表', () => {
  it('恰好收录 64 个键', () => {
    expect(Object.keys(HEXAGRAM_INDEX)).toHaveLength(64)
  })

  it('键均为 6 位二进制字符串', () => {
    for (const key of Object.keys(HEXAGRAM_INDEX)) {
      expect(key).toMatch(/^[01]{6}$/)
    }
  })

  it('值为 1-64 且互不重复', () => {
    const values = Object.values(HEXAGRAM_INDEX)
    expect(new Set(values).size).toBe(64)
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(64)
    }
  })

  it('与 iching-data 的 64 卦爻值数据完全一致', () => {
    // 交叉校验：索引表的每个映射都必须与源数据吻合
    expect(ALL_HEXAGRAMS).toHaveLength(64)
    for (const hex of ALL_HEXAGRAMS) {
      expect(lookupHexagram(hex.lines), `卦 ${hex.id} ${hex.name}`).toBe(hex.id)
    }
  })
})

describe('lookupHexagram', () => {
  it('乾（六阳）→ 1', () => {
    expect(lookupHexagram([1, 1, 1, 1, 1, 1])).toBe(1)
  })

  it('坤（六阴）→ 2', () => {
    expect(lookupHexagram([0, 0, 0, 0, 0, 0])).toBe(2)
  })

  it('既济 [1,0,1,0,1,0] → 63', () => {
    expect(lookupHexagram([1, 0, 1, 0, 1, 0])).toBe(63)
  })

  it('爻数不足 6 时返回 -1', () => {
    expect(lookupHexagram([1, 1, 1])).toBe(-1)
    expect(lookupHexagram([])).toBe(-1)
  })
})
