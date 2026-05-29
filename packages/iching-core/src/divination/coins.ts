import type { LineValue } from '@yaoguayi/iching-data'

/**
 * 金钱卦（三枚铜钱法）
 *
 * 投掷规则：
 *   正面（字）= 3，反面（花）= 2
 *   三枚总和：
 *     6 = 老阴（阴爻，变爻）  ○──○
 *     7 = 少阳（阳爻，不变）  ───
 *     8 = 少阴（阴爻，不变）  ── ──
 *     9 = 老阳（阳爻，变爻）  ●───●
 */
export type CoinResult = 6 | 7 | 8 | 9

export interface DivinationLine {
  /** 爻值（当前卦） */
  value: LineValue
  /** 是否为动爻（变爻） */
  isChanging: boolean
  /** 原始投掷结果 */
  raw: CoinResult
}

export interface DivinationResult {
  /** 本卦六爻（由下至上） */
  lines: [
    DivinationLine,
    DivinationLine,
    DivinationLine,
    DivinationLine,
    DivinationLine,
    DivinationLine,
  ]
  /** 本卦爻值数组（便于查卦） */
  hexagramLines: [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue]
  /** 是否有动爻 */
  hasChangingLines: boolean
  /** 变卦爻值（若有动爻） */
  changedLines?: [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue]
}

/**
 * 模拟投掷三枚铜钱
 * 正面概率：1/2（各面等概率）
 */
function tossThreeCoins(): CoinResult {
  let sum = 0
  for (let i = 0; i < 3; i++) {
    // 正面(字)=3，反面(花)=2
    sum += Math.random() < 0.5 ? 3 : 2
  }
  return sum as CoinResult
}

/**
 * 将投掷结果转为爻值
 * 9(老阳)/7(少阳) → 阳爻(1)
 * 6(老阴)/8(少阴) → 阴爻(0)
 */
function coinResultToLine(result: CoinResult): DivinationLine {
  const isYang = result === 9 || result === 7
  return {
    value: isYang ? 1 : 0,
    isChanging: result === 9 || result === 6,
    raw: result,
  }
}

/**
 * 执行金钱卦占卜
 * @returns 本卦 + 变卦结果
 */
export function castCoins(): DivinationResult {
  const lines = Array.from({ length: 6 }, () =>
    coinResultToLine(tossThreeCoins())
  ) as DivinationResult['lines']

  const hexagramLines = lines.map((l) => l.value) as DivinationResult['hexagramLines']
  const hasChangingLines = lines.some((l) => l.isChanging)

  let changedLines: DivinationResult['changedLines'] | undefined
  if (hasChangingLines) {
    changedLines = lines.map((l) => (l.isChanging ? ((1 - l.value) as LineValue) : l.value)) as DivinationResult['changedLines']
  }

  return { lines, hexagramLines, hasChangingLines, changedLines }
}
