import type { CastValue, DivinationResult } from './types.js'
import { buildDivinationResult } from './types.js'

/**
 * 蓍草法（大衍筮法）
 *
 * 《系辞上》："大衍之数五十，其用四十有九。分而为二以象两，挂一以象三，
 * 揲之以四以象四时，归奇于扐以象闰。"
 *
 * 每爻经"三变"求得：
 *   一变：四十九策分二 → 右手取一策"挂一" → 左右两堆各以四为组数之，
 *         余数（1-4，整除记 4）归扐弃去。本变共弃 5 或 9 策。
 *   二变、三变：对余下的蓍草重复同样操作，各弃 4 或 8 策。
 *   三变后余策数 ∈ {36, 32, 28, 24}，除以 4 得四象值 9/8/7/6。
 *
 * 概率分布（区别于金钱卦的关键）：
 *   P(6 老阴)=1/16，P(7 少阳)=5/16，P(8 少阴)=7/16，P(9 老阳)=3/16
 *   —— 阴阳出现概率仍各半，但"变"的分布不对称：老阳远多于老阴。
 */

/** 以四数之，取余（整除时余数记为 4，即"归奇"规则） */
function countByFours(pile: number): number {
  const r = pile % 4
  return r === 0 ? 4 : r
}

/**
 * 一变：分二 → 挂一 → 揲四 → 归奇
 * @param n 本变开始时的蓍草总数
 * @returns 本变结束后剩余的蓍草数
 */
function performChange(n: number): number {
  // 分而为二：左堆至少 1 策，右堆至少 1 策
  const left = 1 + Math.floor(Math.random() * (n - 1))
  const right = n - left - 1 // 挂一（自右堆取一策）
  const discard = 1 + countByFours(left) + countByFours(right)
  return n - discard
}

/** 三变得一爻 */
function castYarrowLine(): CastValue {
  let n = 49 // 大衍之数五十，其用四十有九
  for (let i = 0; i < 3; i++) {
    n = performChange(n)
  }
  return (n / 4) as CastValue
}

/**
 * 执行蓍草法占卜（十八变成卦）
 * @returns 本卦 + 变卦结果
 */
export function castYarrow(): DivinationResult {
  const raws = Array.from({ length: 6 }, () => castYarrowLine())
  return buildDivinationResult(raws)
}
