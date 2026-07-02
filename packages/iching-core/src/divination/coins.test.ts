import { describe, it, expect, vi, afterEach } from 'vitest'
import { castCoins } from './coins.js'
import { lookupHexagram } from '../hexagram/lookup.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('castCoins 结构不变量', () => {
  it('返回六爻,每爻 raw ∈ {6,7,8,9},value/isChanging 与 raw 对应', () => {
    for (let i = 0; i < 200; i++) {
      const result = castCoins()
      expect(result.lines).toHaveLength(6)
      for (const line of result.lines) {
        expect([6, 7, 8, 9]).toContain(line.raw)
        // 9(老阳)/7(少阳) → 阳(1);6(老阴)/8(少阴) → 阴(0)
        expect(line.value).toBe(line.raw === 9 || line.raw === 7 ? 1 : 0)
        // 老阳(9)/老阴(6)为动爻
        expect(line.isChanging).toBe(line.raw === 9 || line.raw === 6)
      }
      // hexagramLines 与 lines[].value 一致
      expect(result.hexagramLines).toEqual(result.lines.map((l) => l.value))
      // hasChangingLines 与逐爻判断一致
      expect(result.hasChangingLines).toBe(result.lines.some((l) => l.isChanging))
      // 无动爻时不应有变卦;有动爻时必须有变卦
      expect(result.changedLines === undefined).toBe(!result.hasChangingLines)
      // 本卦必能在 64 卦中查到
      expect(lookupHexagram(result.hexagramLines)).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('castCoins 变卦推导(确定性用例)', () => {
  it('全部掷出老阳(9):本卦乾,变卦坤', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // 每枚都是正面(3),3+3+3=9
    const result = castCoins()
    expect(result.lines.every((l) => l.raw === 9)).toBe(true)
    expect(result.hexagramLines).toEqual([1, 1, 1, 1, 1, 1])
    expect(result.hasChangingLines).toBe(true)
    expect(result.changedLines).toEqual([0, 0, 0, 0, 0, 0])
    expect(lookupHexagram(result.hexagramLines)).toBe(1) // 乾
    expect(lookupHexagram(result.changedLines!)).toBe(2) // 坤
  })

  it('全部掷出老阴(6):本卦坤,变卦乾', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // 每枚都是反面(2),2+2+2=6
    const result = castCoins()
    expect(result.lines.every((l) => l.raw === 6)).toBe(true)
    expect(result.hexagramLines).toEqual([0, 0, 0, 0, 0, 0])
    expect(result.changedLines).toEqual([1, 1, 1, 1, 1, 1])
  })

  it('全部掷出少阳(7):无动爻,无变卦', () => {
    // 每爻三枚:一正两反 → 3+2+2=7
    const seq = [0.1, 0.9, 0.9]
    let call = 0
    vi.spyOn(Math, 'random').mockImplementation(() => seq[call++ % 3]!)
    const result = castCoins()
    expect(result.lines.every((l) => l.raw === 7)).toBe(true)
    expect(result.hasChangingLines).toBe(false)
    expect(result.changedLines).toBeUndefined()
  })
})

describe('castCoins 概率分布(统计检验)', () => {
  it('raw 分布接近理论值 6:1/8, 7:3/8, 8:3/8, 9:1/8', () => {
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 }
    const N = 10000 // 10000 次起卦 = 60000 爻
    for (let i = 0; i < N; i++) {
      for (const line of castCoins().lines) counts[line.raw]!++
    }
    const total = N * 6
    // 理论概率(三枚等概率硬币):P(6)=P(9)=1/8, P(7)=P(8)=3/8
    // 容差 ±0.015,对 60000 样本而言约为 8 个标准差,误报概率可忽略
    expect(counts[6]! / total).toBeCloseTo(1 / 8, 1)
    expect(counts[9]! / total).toBeCloseTo(1 / 8, 1)
    expect(Math.abs(counts[6]! / total - 1 / 8)).toBeLessThan(0.015)
    expect(Math.abs(counts[7]! / total - 3 / 8)).toBeLessThan(0.015)
    expect(Math.abs(counts[8]! / total - 3 / 8)).toBeLessThan(0.015)
    expect(Math.abs(counts[9]! / total - 1 / 8)).toBeLessThan(0.015)
  })
})
