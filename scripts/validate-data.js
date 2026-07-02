/**
 * validate-data.js — 卦象数据完整性校验
 *
 * 校验 packages/iching-data 的 64 卦源数据与译文,在 CI 中运行,
 * 任何一条不满足即以非零码退出。规则:
 *   1. 64 个文件,id 恰为 1-64 且不重复
 *   2. 必填字段非空(name/pinyin/symbol/guaci/tuan/xiang)
 *   3. 卦符与卦序一致(Unicode 易经六十四卦符号区从 U+4DC0 起按序排列)
 *   4. lines 为 6 个 0/1
 *   5. 上下卦字与 lines 前三爻/后三爻一致(可捕获复制粘贴类错误)
 *   6. 64 卦 lines 互不重复
 *   7. 爻辞 6 条(乾坤各多一条用九/用六),position 连续
 *   8. 每卦有对应译文文件,关键译文字段非空
 */

const fs = require('fs');
const path = require('path');

const HEX_DIR = path.join(__dirname, '..', 'packages', 'iching-data', 'src', 'hexagrams');
const TRANS_DIR = path.join(__dirname, '..', 'packages', 'iching-data', 'src', 'translations');

// 三卦画(由下至上) — 键含简繁体
const TRIGRAM_LINES = {
  乾: '111', 坤: '000', 震: '100', 巽: '011',
  坎: '010', 离: '101', 離: '101', 艮: '001', 兑: '110', 兌: '110',
};

const errors = [];
const err = (msg) => errors.push(msg);

const files = fs.readdirSync(HEX_DIR).filter((f) => f.endsWith('.json')).sort();
if (files.length !== 64) err(`卦文件数量应为 64,实际 ${files.length}`);

const seenIds = new Set();
const seenLines = new Map(); // lines 串 → 卦名(查重)

for (const file of files) {
  const label = `[${file}]`;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(HEX_DIR, file), 'utf-8'));
  } catch (e) {
    err(`${label} JSON 解析失败: ${e.message}`);
    continue;
  }

  // 1. id
  if (!Number.isInteger(data.id) || data.id < 1 || data.id > 64) {
    err(`${label} id 非法: ${data.id}`);
    continue;
  }
  if (seenIds.has(data.id)) err(`${label} id 重复: ${data.id}`);
  seenIds.add(data.id);

  // 2. 必填字段
  for (const field of ['name', 'pinyin', 'symbol', 'guaci', 'tuan', 'xiang']) {
    if (typeof data[field] !== 'string' || data[field].trim() === '') {
      err(`${label} 字段 ${field} 缺失或为空`);
    }
  }

  // 3. 卦符与卦序一致
  const expectedSymbol = String.fromCodePoint(0x4dc0 + data.id - 1);
  if (data.symbol !== expectedSymbol) {
    err(`${label} 卦符不符: 应为 ${expectedSymbol},实际 ${data.symbol}`);
  }

  // 4. lines
  const linesOk =
    Array.isArray(data.lines) &&
    data.lines.length === 6 &&
    data.lines.every((v) => v === 0 || v === 1);
  if (!linesOk) {
    err(`${label} lines 非法: ${JSON.stringify(data.lines)}`);
  } else {
    // 5. 上下卦一致性
    const lower = data.lines.slice(0, 3).join('');
    const upper = data.lines.slice(3, 6).join('');
    if (TRIGRAM_LINES[data.lowerTrigram] !== lower) {
      err(`${label} 下卦 ${data.lowerTrigram} 与爻值 ${lower} 不符`);
    }
    if (TRIGRAM_LINES[data.upperTrigram] !== upper) {
      err(`${label} 上卦 ${data.upperTrigram} 与爻值 ${upper} 不符`);
    }
    // 6. 查重
    const key = data.lines.join('');
    if (seenLines.has(key)) {
      err(`${label} lines 与 ${seenLines.get(key)} 重复: ${key}`);
    }
    seenLines.set(key, `${data.name}(${data.id})`);
  }

  // 7. 爻辞
  const expectedYao = data.id === 1 || data.id === 2 ? 7 : 6; // 乾坤含用九/用六
  if (!Array.isArray(data.yaoci) || data.yaoci.length !== expectedYao) {
    err(`${label} 爻辞应为 ${expectedYao} 条,实际 ${Array.isArray(data.yaoci) ? data.yaoci.length : '非数组'}`);
  } else {
    data.yaoci.forEach((y, i) => {
      if (y.position !== i + 1) err(`${label} 爻辞第 ${i + 1} 条 position 错误: ${y.position}`);
      if (typeof y.text !== 'string' || y.text.trim() === '') err(`${label} 爻辞第 ${i + 1} 条 text 为空`);
    });
  }

  // 8. 译文
  const transFile = path.join(TRANS_DIR, String(data.id).padStart(3, '0') + '.json');
  if (!fs.existsSync(transFile)) {
    err(`${label} 缺少译文文件 ${path.basename(transFile)}`);
  } else {
    try {
      const trans = JSON.parse(fs.readFileSync(transFile, 'utf-8'));
      if (trans.id !== data.id) err(`${label} 译文 id 不符: ${trans.id}`);
      for (const field of ['guaci_trans', 'xiang_trans']) {
        if (typeof trans[field] !== 'string' || trans[field].trim() === '') {
          err(`${label} 译文字段 ${field} 缺失或为空`);
        }
      }
      if (Array.isArray(trans.yaoci_trans) && Array.isArray(data.yaoci)) {
        if (trans.yaoci_trans.length !== data.yaoci.length) {
          err(`${label} 译文爻辞数量 ${trans.yaoci_trans.length} 与原文 ${data.yaoci.length} 不符`);
        }
      }
    } catch (e) {
      err(`${label} 译文 JSON 解析失败: ${e.message}`);
    }
  }
}

if (seenIds.size !== 64) err(`id 覆盖不全: 仅 ${seenIds.size}/64`);

if (errors.length > 0) {
  console.error(`数据校验失败,共 ${errors.length} 处问题:\n`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`数据校验通过: 64 卦 + 译文,共 ${files.length} 个文件`);
