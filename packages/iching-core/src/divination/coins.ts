import type { CastValue, DivinationResult } from './types.js'
import { buildDivinationResult } from './types.js'

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
 *
 * 概率分布：P(6)=P(9)=1/8，P(7)=P(8)=3/8
 */
export type CoinResult = CastValue

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
 * 执行金钱卦占卜
 * @returns 本卦 + 变卦结果
 */
export function castCoins(): DivinationResult {
  const raws = Array.from({ length: 6 }, () => tossThreeCoins())
  return buildDivinationResult(raws)
}
