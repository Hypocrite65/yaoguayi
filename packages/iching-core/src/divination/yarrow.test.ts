import { describe, it, expect } from 'vitest'
import { castYarrow } from './yarrow.js'
import { lookupHexagram } from '../hexagram/lookup.js'

describe('castYarrow 结构不变量', () => {
  it('返回六爻,每爻 raw ∈ {6,7,8,9},value/isChanging 与 raw 对应', () => {
    for (let i = 0; i < 200; i++) {
      const result = castYarrow()
      expect(result.lines).toHaveLength(6)
      for (const line of result.lines) {
        expect([6, 7, 8, 9]).toContain(line.raw)
        expect(line.value).toBe(line.raw === 9 || line.raw === 7 ? 1 : 0)
        expect(line.isChanging).toBe(line.raw === 9 || line.raw === 6)
      }
      expect(result.hexagramLines).toEqual(result.lines.map((l) => l.value))
      expect(result.hasChangingLines).toBe(result.lines.some((l) => l.isChanging))
      expect(result.changedLines === undefined).toBe(!result.hasChangingLines)
      expect(lookupHexagram(result.hexagramLines)).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('castYarrow 概率分布(统计检验)', () => {
  it('raw 分布接近大衍筮法理论值 6:1/16, 7:5/16, 8:7/16, 9:3/16', () => {
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 }
    const N = 10000 // 10000 次起卦 = 60000 爻
    for (let i = 0; i < N; i++) {
      for (const line of castYarrow().lines) counts[line.raw]!++
    }
    const total = N * 6
    // 蓍草法与金钱卦的核心差异:老阳(3/16)远多于老阴(1/16)
    // 均匀分堆模拟与经典理论值有 <0.01 的固有偏差,容差取 ±0.02
    expect(Math.abs(counts[6]! / total - 1 / 16)).toBeLessThan(0.02)
    expect(Math.abs(counts[7]! / total - 5 / 16)).toBeLessThan(0.02)
    expect(Math.abs(counts[8]! / total - 7 / 16)).toBeLessThan(0.02)
    expect(Math.abs(counts[9]! / total - 3 / 16)).toBeLessThan(0.02)
  })

  it('阴阳两仪出现概率各半', () => {
    let yang = 0
    const N = 5000
    for (let i = 0; i < N; i++) {
      for (const line of castYarrow().lines) if (line.value === 1) yang++
    }
    expect(Math.abs(yang / (N * 6) - 0.5)).toBeLessThan(0.02)
  })
})
