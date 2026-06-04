/**
 * fix-pinyin-tones.js — 修正卦名拼音声调
 *
 * 设计说明：
 * 将 64 卦 JSON 文件中的 pinyin 字段从无声调格式（如 "gui-mei"）
 * 更新为带声调格式（如 "guī mèi"），提升页面显示的专业性。
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'packages', 'iching-data', 'src', 'hexagrams');

// 64 卦带声调拼音映射（按卦序 1-64）
const TONED_PINYIN = {
  1: 'qián',
  2: 'kūn',
  3: 'zhūn',
  4: 'méng',
  5: 'xū',
  6: 'sòng',
  7: 'shī',
  8: 'bì',
  9: 'xiǎo xù',
  10: 'lǚ',
  11: 'tài',
  12: 'pǐ',
  13: 'tóng rén',
  14: 'dà yǒu',
  15: 'qiān',
  16: 'yù',
  17: 'suí',
  18: 'gǔ',
  19: 'lín',
  20: 'guān',
  21: 'shì hé',
  22: 'bì',
  23: 'bō',
  24: 'fù',
  25: 'wú wàng',
  26: 'dà xù',
  27: 'yí',
  28: 'dà guò',
  29: 'kǎn',
  30: 'lí',
  31: 'xián',
  32: 'héng',
  33: 'dùn',
  34: 'dà zhuàng',
  35: 'jìn',
  36: 'míng yí',
  37: 'jiā rén',
  38: 'kuí',
  39: 'jiǎn',
  40: 'jiě',
  41: 'sǔn',
  42: 'yì',
  43: 'guài',
  44: 'gòu',
  45: 'cuì',
  46: 'shēng',
  47: 'kùn',
  48: 'jǐng',
  49: 'gé',
  50: 'dǐng',
  51: 'zhèn',
  52: 'gèn',
  53: 'jiàn',
  54: 'guī mèi',
  55: 'fēng',
  56: 'lǚ',
  57: 'xùn',
  58: 'duì',
  59: 'huàn',
  60: 'jié',
  61: 'zhōng fú',
  62: 'xiǎo guò',
  63: 'jì jì',
  64: 'wèi jì'
};

// 逐个更新 JSON 文件
const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.json')).sort();
let updated = 0;

for (const file of files) {
  const filePath = path.join(SRC_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const toned = TONED_PINYIN[data.id];
  if (toned && data.pinyin !== toned) {
    const old = data.pinyin;
    data.pinyin = toned;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`${data.id}. ${data.name}: ${old} => ${toned}`);
    updated++;
  }
}

console.log(`\nUpdated ${updated} hexagram pinyin fields.`);
