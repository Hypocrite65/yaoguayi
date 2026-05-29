import type { LineValue } from '@yaoguayi/iching-data'

interface HexagramSymbolProps {
  /** 六爻数组（由下至上，1=阳，0=阴） */
  lines: [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue]
  /** 动爻位置列表（1-6） */
  changingLines?: number[]
  /** 尺寸（px） */
  size?: number
  className?: string
}

/**
 * 卦象 SVG 组件
 *
 * 渲染说明：
 * - 阳爻（1）：一条实线
 * - 阴爻（0）：两条断线（中间留空）
 * - 动爻：用朱红色标注
 * - 爻从下至上排列（index 0 在底部）
 *
 * AI 语义：
 * 组件输出包含 aria-label 和 data-* 属性，供屏幕阅读器和 AI 工具读取爻象信息。
 */
export function HexagramSymbol({
  lines,
  changingLines = [],
  size = 80,
  className = '',
}: HexagramSymbolProps) {
  const lineHeight = 6
  const lineGap = 8
  const totalHeight = 6 * lineHeight + 5 * lineGap
  const width = size
  const height = (totalHeight / 60) * size

  // 爻从下往上渲染，index 0 在最底部
  const renderedLines = [...lines].reverse()

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 60 ${totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`卦象：${lines.map((v) => (v === 1 ? '阳' : '阴')).join('，')}`}
      data-lines={lines.join('')}
    >
      {renderedLines.map((line, reverseIdx) => {
        const position = 6 - reverseIdx // 爻位（1=初爻，6=上爻）
        const isChanging = changingLines.includes(position)
        const y = reverseIdx * (lineHeight + lineGap)
        const color = isChanging ? '#c0392b' : 'currentColor'

        if (line === 1) {
          // 阳爻：实线
          return (
            <rect
              key={position}
              x="0"
              y={y}
              width="60"
              height={lineHeight}
              rx="1"
              fill={color}
              aria-label={`第${position}爻：阳${isChanging ? '（动爻）' : ''}`}
            />
          )
        } else {
          // 阴爻：两段断线
          return (
            <g key={position} aria-label={`第${position}爻：阴${isChanging ? '（动爻）' : ''}`}>
              <rect x="0" y={y} width="26" height={lineHeight} rx="1" fill={color} />
              <rect x="34" y={y} width="26" height={lineHeight} rx="1" fill={color} />
            </g>
          )
        }
      })}
    </svg>
  )
}
