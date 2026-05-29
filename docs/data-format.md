# 易经数据格式规范

本文档描述 `packages/iching-data` 中卦象 JSON 数据的字段定义，供内容贡献者参考。

## 文件命名

```
packages/iching-data/src/hexagrams/
  001-qian.json    第1卦·乾
  002-kun.json     第2卦·坤
  ...
  064-weiji.json   第64卦·未济
```

序号依通行本（周易正义）顺序，三位数字补零。

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | number | ✅ | 卦序号（1-64） |
| `name` | string | ✅ | 卦名（汉字） |
| `pinyin` | string | ✅ | 拼音（带声调，如 "qián"） |
| `nameEn` | string | ✅ | 英文名（参照 Wilhelm 译本） |
| `symbol` | string | ✅ | Unicode 卦象符号（U+4DC0 起） |
| `lines` | number[6] | ✅ | 六爻（由下至上，1=阳，0=阴） |
| `upperTrigram` | string | ✅ | 上卦（外卦）名称 |
| `lowerTrigram` | string | ✅ | 下卦（内卦）名称 |
| `guaci` | string | ✅ | 卦辞原文 |
| `tuan` | string | | 彖传原文 |
| `xiang` | string | | 大象传原文 |
| `yaoci` | Yao[6] | ✅ | 六爻爻辞（乾坤另有用九/用六） |
| `aiSummary` | string | | AI 语义摘要，供 LLM 快速理解本卦核心 |

### Yao 对象

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `position` | 1-6 | ✅ | 爻位（1=初爻，6=上爻） |
| `name` | string | ✅ | 爻名（如"初九"、"六二"） |
| `text` | string | ✅ | 爻辞原文（含爻名） |
| `xiang` | string | | 小象传 |

## 内容来源说明

原典内容请以以下版本为主要参考，并在 PR 中注明出处：

- 中华书局版《周易正义》（十三经注疏）
- 中华书局版《周易本义》（朱熹）
- 公开领域数字版本需注明来源

**注意**：不同版本在个别字词上存在差异，校对时请在 PR 说明中注明版本选择依据。
