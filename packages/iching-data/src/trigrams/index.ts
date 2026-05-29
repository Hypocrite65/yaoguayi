import type { Trigram } from '../types.js'

/**
 * 先天八卦数据
 * 爻位排列：[初爻, 二爻, 三爻]（由下至上）
 */
export const TRIGRAMS: Record<string, Trigram> = {
  乾: { name: '乾', nature: '天', lines: [1, 1, 1], symbol: '☰' },
  坤: { name: '坤', nature: '地', lines: [0, 0, 0], symbol: '☷' },
  震: { name: '震', nature: '雷', lines: [1, 0, 0], symbol: '☳' },
  巽: { name: '巽', nature: '风', lines: [0, 1, 1], symbol: '☴' },
  坎: { name: '坎', nature: '水', lines: [0, 1, 0], symbol: '☵' },
  离: { name: '离', nature: '火', lines: [1, 0, 1], symbol: '☲' },
  艮: { name: '艮', nature: '山', lines: [0, 0, 1], symbol: '☶' },
  兑: { name: '兑', nature: '泽', lines: [1, 1, 0], symbol: '☱' },
}
