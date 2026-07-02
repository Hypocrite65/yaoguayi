import type { LineValue } from '@yaoguayi/iching-data'

/**
 * 起卦通用类型与变卦推导
 *
 * 金钱卦与蓍草法殊途同归:每爻的最终结果都归为四象之一
 *   6 = 老阴(阴爻,变爻)  ○──○
 *   7 = 少阳(阳爻,不变)  ───
 *   8 = 少阴(阴爻,不变)  ── ──
 *   9 = 老阳(阳爻,变爻)  ●───●
 */
export type CastValue = 6 | 7 | 8 | 9

export interface DivinationLine {
  /** 爻值（当前卦） */
  value: LineValue
  /** 是否为动爻（变爻） */
  isChanging: boolean
  /** 原始起卦结果（四象值） */
  raw: CastValue
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
 * 将四象值转为爻
 * 9(老阳)/7(少阳) → 阳爻(1)；6(老阴)/8(少阴) → 阴爻(0)
 * 9(老阳)/6(老阴) 为动爻
 */
export function castValueToLine(raw: CastValue): DivinationLine {
  return {
    value: raw === 9 || raw === 7 ? 1 : 0,
    isChanging: raw === 9 || raw === 6,
    raw,
  }
}

/**
 * 由六爻四象值构建完整占卜结果（含变卦推导）
 * @param raws 六爻原始值（由下至上）
 */
export function buildDivinationResult(raws: CastValue[]): DivinationResult {
  const lines = raws.map(castValueToLine) as DivinationResult['lines']
  const hexagramLines = lines.map((l) => l.value) as DivinationResult['hexagramLines']
  const hasChangingLines = lines.some((l) => l.isChanging)

  let changedLines: DivinationResult['changedLines'] | undefined
  if (hasChangingLines) {
    changedLines = lines.map((l) =>
      l.isChanging ? ((1 - l.value) as LineValue) : l.value
    ) as DivinationResult['changedLines']
  }

  return { lines, hexagramLines, hasChangingLines, changedLines }
}
