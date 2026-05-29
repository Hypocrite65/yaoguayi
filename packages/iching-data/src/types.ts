/**
 * 爻的阴阳类型
 * 1 = 阳爻（—），0 = 阴爻（--）
 */
export type LineValue = 0 | 1

/**
 * 爻辞数据
 */
export interface Yao {
  /** 爻位（1-6，由下至上） */
  position: 1 | 2 | 3 | 4 | 5 | 6
  /** 爻名，如"初九"、"六二" */
  name: string
  /** 爻辞原文 */
  text: string
  /** 小象传 */
  xiang?: string
}

/**
 * 单卦（八卦之一）
 */
export interface Trigram {
  /** 卦名，如"乾"、"坤" */
  name: string
  /** 自然象征，如"天"、"地" */
  nature: string
  /** 爻象（由下至上），3位 */
  lines: [LineValue, LineValue, LineValue]
  /** Unicode 符号 */
  symbol: string
}

/**
 * 六十四卦完整数据
 */
export interface Hexagram {
  /** 序号（1-64，依通行本序） */
  id: number
  /** 卦名，如"乾"、"坤" */
  name: string
  /** 拼音，如"qián" */
  pinyin: string
  /** 英文名 */
  nameEn: string
  /** Unicode 卦象符号 */
  symbol: string
  /** 爻象（由下至上），6位 */
  lines: [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue]
  /** 上卦（外卦） */
  upperTrigram: string
  /** 下卦（内卦） */
  lowerTrigram: string
  /** 卦辞 */
  guaci: string
  /** 彖传 */
  tuan?: string
  /** 大象传 */
  xiang?: string
  /** 爻辞（6条，乾坤各有用九/用六） */
  yaoci: Yao[]
  /** AI 语义摘要（供浏览器 AI / LLM 快速理解本卦核心） */
  aiSummary?: string
}
